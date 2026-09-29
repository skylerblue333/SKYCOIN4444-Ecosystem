import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  Send,
  Sparkles,
  Users,
  TrendingUp,
  ShieldCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type FeedMode = "latest" | "trending";

export default function SocialMedia() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [feedMode, setFeedMode] = useState<FeedMode>("latest");
  const [search, setSearch] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const {
    data: feed,
    isLoading,
    isError,
    refetch,
  } = trpc.post.list.useQuery({ limit: 50, offset: 0 });
  const { data: trends } = trpc.post.trending.useQuery();
  const { data: userStats } = trpc.user.getStats.useQuery(
    { userId: String(user?.id ?? "") },
    { enabled: Boolean(user?.id) }
  );
  const { data: comments } = trpc.post.comments.useQuery(
    { postId: selectedPost ?? "" },
    { enabled: Boolean(selectedPost) }
  );

  const createPost = trpc.post.create.useMutation({
    onSuccess: async () => {
      setPostContent("");
      await Promise.all([
        utils.post.list.invalidate(),
        utils.post.trending.invalidate(),
      ]);
      toast.success("Post saved to the beta feed");
    },
    onError: error => toast.error(error.message || "Could not save post"),
  });

  const likePost = trpc.post.like.useMutation({
    onSuccess: async (_data, variables) => {
      setLikedPosts(current => new Set([...current, variables.postId]));
      await utils.post.list.invalidate();
    },
    onError: error => toast.error(error.message || "Could not like post"),
  });

  const unlikePost = trpc.post.unlike.useMutation({
    onSuccess: async (_data, variables) => {
      setLikedPosts(current => {
        const next = new Set(current);
        next.delete(variables.postId);
        return next;
      });
      await utils.post.list.invalidate();
    },
    onError: error => toast.error(error.message || "Could not remove like"),
  });

  const addComment = trpc.post.comment.useMutation({
    onSuccess: async () => {
      setCommentContent("");
      await Promise.all([
        utils.post.comments.invalidate(),
        utils.post.list.invalidate(),
      ]);
      toast.success("Comment saved");
    },
    onError: error => toast.error(error.message || "Could not save comment"),
  });

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: async result => {
      if (!result.success) {
        toast.error("Post was not found or is not yours");
        return;
      }
      if (selectedPost) setSelectedPost(null);
      await Promise.all([
        utils.post.list.invalidate(),
        utils.post.trending.invalidate(),
      ]);
      toast.success("Post deleted");
    },
    onError: error => toast.error(error.message || "Could not delete post"),
  });

  const displayedPosts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = (feed ?? []).filter(post =>
      needle ? (post.content ?? "").toLowerCase().includes(needle) : true
    );

    if (feedMode === "trending") {
      return [...filtered].sort((a, b) => {
        const aScore = Number(a.likes ?? 0) + Number(a.comments ?? 0) * 2;
        const bScore = Number(b.likes ?? 0) + Number(b.comments ?? 0) * 2;
        return bScore - aScore;
      });
    }
    return filtered;
  }, [feed, feedMode, search]);

  const submitPost = () => {
    const content = postContent.trim();
    if (!content) return;
    createPost.mutate({ content });
  };

  const submitComment = (postId: string) => {
    const content = commentContent.trim();
    if (!content) return;
    addComment.mutate({ postId, content });
  };

  const toggleLike = (postId: string) => {
    if (!user) {
      toast.error("Sign in to like posts");
      return;
    }
    if (likedPosts.has(postId)) unlikePost.mutate({ postId });
    else likePost.mutate({ postId });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-black">Sky Social</h1>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">
                persisted beta
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Posts, likes, and comments on this screen use the current database-backed
              beta API. Suggested creators, fake follower counts, and simulated trending
              totals are intentionally not shown as live data.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/communityhub">
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Communities
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/hopeai">
              <Button size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                HopeAI
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <main className="space-y-4">
            <Card className="border-border/40 p-4">
              {user ? (
                <>
                  <Textarea
                    value={postContent}
                    onChange={event => setPostContent(event.target.value)}
                    maxLength={255}
                    placeholder="Share an update with the SKYCOIN4444 beta community..."
                    className="min-h-24 resize-none"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {postContent.length}/255 · saved only after the server confirms
                    </span>
                    <Button
                      onClick={submitPost}
                      disabled={!postContent.trim() || createPost.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {createPost.isPending ? "Saving..." : "Post"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Read the public beta feed</p>
                    <p className="text-sm text-muted-foreground">
                      Sign in to create posts, like, comment, or delete your own content.
                    </p>
                  </div>
                  <Link href="/signin">
                    <Button>Sign in</Button>
                  </Link>
                </div>
              )}
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                {(["latest", "trending"] as const).map(mode => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={feedMode === mode ? "default" : "outline"}
                    onClick={() => setFeedMode(mode)}
                    className="capitalize"
                  >
                    {mode === "trending" && <TrendingUp className="mr-2 h-4 w-4" />}
                    {mode}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1 sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Filter loaded posts"
                    className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={() => refetch()} aria-label="Refresh feed">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading && (
              <Card className="p-8 text-center text-sm text-muted-foreground">
                Loading persisted posts…
              </Card>
            )}

            {isError && (
              <Card className="border-red-500/30 p-6">
                <p className="font-semibold text-red-400">Feed unavailable</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The beta API did not return the feed. No demo posts are substituted.
                </p>
              </Card>
            )}

            {!isLoading && !isError && displayedPosts.length === 0 && (
              <Card className="p-10 text-center">
                <p className="font-semibold">No matching posts</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create the first persisted post or clear the local filter.
                </p>
              </Card>
            )}

            {displayedPosts.map(post => {
              const postId = String(post.id);
              const ownsPost = user && String(post.userId) === String(user.id);
              const isLiked = likedPosts.has(postId);
              const createdLabel =
                post.createdAt instanceof Date
                  ? post.createdAt.toLocaleString()
                  : post.createdAt
                    ? new Date(String(post.createdAt)).toLocaleString()
                    : "recently";

              return (
                <Card key={postId} className="border-border/40 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">User {String(post.userId ?? "unknown")}</p>
                      <p className="text-xs text-muted-foreground">{createdLabel}</p>
                    </div>
                    {ownsPost && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletePost.isPending}
                        onClick={() => deletePost.mutate({ postId })}
                        aria-label="Delete post"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {post.content ?? ""}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!user || likePost.isPending || unlikePost.isPending}
                      onClick={() => toggleLike(postId)}
                      className={isLiked ? "text-red-400" : ""}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                      {Number(post.likes ?? 0)}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedPost(selectedPost === postId ? null : postId)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {Number(post.comments ?? 0)}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          toast.success("Page link copied");
                        } catch {
                          toast.error("Clipboard unavailable");
                        }
                      }}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  {selectedPost === postId && (
                    <div className="mt-3 space-y-3 rounded-xl border border-border/40 bg-muted/20 p-3">
                      {(comments ?? []).length === 0 ? (
                        <p className="text-xs text-muted-foreground">No comments yet.</p>
                      ) : (
                        comments?.map(comment => (
                          <div key={comment.id} className="rounded-lg bg-background/70 p-3">
                            <p className="text-xs font-semibold">
                              User {String(comment.userId ?? "unknown")}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      )}
                      {user && (
                        <div className="flex gap-2">
                          <input
                            value={commentContent}
                            onChange={event => setCommentContent(event.target.value)}
                            onKeyDown={event => {
                              if (event.key === "Enter") submitComment(postId);
                            }}
                            maxLength={255}
                            placeholder="Write a comment"
                            className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                          />
                          <Button
                            size="sm"
                            disabled={!commentContent.trim() || addComment.isPending}
                            onClick={() => submitComment(postId)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </main>

          <aside className="space-y-4">
            {user && (
              <Card className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <h2 className="font-semibold">Your persisted stats</h2>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/30 p-2">
                    <p className="text-xl font-bold">{Number(userStats?.posts ?? 0)}</p>
                    <p className="text-[10px] text-muted-foreground">posts</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2">
                    <p className="text-xl font-bold">{Number(userStats?.followers ?? 0)}</p>
                    <p className="text-[10px] text-muted-foreground">followers</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2">
                    <p className="text-xl font-bold">{Number(userStats?.following ?? 0)}</p>
                    <p className="text-[10px] text-muted-foreground">following</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Trending hashtags</h2>
              </div>
              {(trends ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No hashtag trend data exists yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {trends?.map(trend => (
                    <button
                      key={trend.hashtag}
                      onClick={() => setSearch(trend.hashtag)}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-muted/40"
                    >
                      <span className="text-sm font-medium">{trend.hashtag}</span>
                      <span className="text-xs text-muted-foreground">
                        {trend.mentions} posts
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card className="border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">HopeAI</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Open HopeAI for an explicit conversation. This social screen does not
                claim that HopeAI is silently reading your thoughts, private activity,
                or hidden signals.
              </p>
              <Link href="/hopeai">
                <Button size="sm" className="mt-3 w-full">
                  Open HopeAI
                </Button>
              </Link>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
