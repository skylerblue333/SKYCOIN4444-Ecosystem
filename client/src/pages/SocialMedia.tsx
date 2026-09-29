import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Bot,
  BookOpen,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

type FeedTab = "all" | "following";

export default function SocialMedia() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const [postContent, setPostContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const feedQuery = trpc.post.list.useQuery({ limit: 50, offset: 0 });
  const followingQuery = trpc.post.following.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated && activeTab === "following" }
  );
  const trendingQuery = trpc.post.trending.useQuery();
  const statsQuery = trpc.user.getStats.useQuery(
    { userId: String(user?.id ?? "") },
    { enabled: Boolean(user?.id) }
  );
  const commentsQuery = trpc.post.comments.useQuery(
    { postId: selectedPostId ?? "", limit: 50 },
    { enabled: Boolean(selectedPostId) }
  );

  const createPost = trpc.post.create.useMutation({
    onSuccess: async () => {
      setPostContent("");
      await Promise.all([
        utils.post.list.invalidate(),
        utils.post.following.invalidate(),
        utils.post.trending.invalidate(),
      ]);
      toast.success("Post published");
    },
    onError: error => toast.error(error.message),
  });

  const likePost = trpc.post.like.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.post.list.invalidate(),
        utils.post.following.invalidate(),
      ]);
    },
    onError: error => toast.error(error.message),
  });

  const addComment = trpc.post.comment.useMutation({
    onSuccess: async () => {
      setCommentContent("");
      await Promise.all([
        utils.post.comments.invalidate(),
        utils.post.list.invalidate(),
        utils.post.following.invalidate(),
      ]);
    },
    onError: error => toast.error(error.message),
  });

  const followUser = trpc.user.follow.useMutation({
    onSuccess: async result => {
      if (!result.success) {
        toast.error(
          result.reason === "cannot_follow_self"
            ? "You cannot follow yourself"
            : "Follow could not be saved"
        );
        return;
      }
      await Promise.all([
        utils.user.getStats.invalidate(),
        utils.post.following.invalidate(),
      ]);
      toast.success("Follow saved");
    },
    onError: error => toast.error(error.message),
  });

  const baseFeed =
    activeTab === "following"
      ? followingQuery.data ?? []
      : feedQuery.data ?? [];

  const displayFeed = useMemo(() => {
    if (!selectedTag) return baseFeed;
    const normalized = selectedTag.toLowerCase();
    return baseFeed.filter(post =>
      String(post.content ?? "").toLowerCase().includes(normalized)
    );
  }, [baseFeed, selectedTag]);

  const creators = useMemo(() => {
    const ownId = String(user?.id ?? "");
    const byId = new Map<string, { id: string; posts: number }>();
    for (const post of feedQuery.data ?? []) {
      const id = typeof post.userId === "string" ? post.userId : "";
      if (!id || id === ownId) continue;
      const existing = byId.get(id);
      byId.set(id, { id, posts: (existing?.posts ?? 0) + 1 });
    }
    return [...byId.values()]
      .sort((a, b) => b.posts - a.posts || a.id.localeCompare(b.id))
      .slice(0, 5);
  }, [feedQuery.data, user?.id]);

  const toggleComments = (postId: string) => {
    setSelectedPostId(current => (current === postId ? null : postId));
    setCommentContent("");
  };

  const sharePost = async (postId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("post", postId);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "SKYCOIN4444 Social post",
          url: url.toString(),
        });
      } else {
        await navigator.clipboard.writeText(url.toString());
        toast.success("Post link copied");
      }
    } catch {
      // Native share cancellation is not an application error.
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
        <section className="mb-6 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-cyan-500/5 p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge className="mb-3 border-primary/20 bg-primary/10 text-primary">
                Persisted social beta
              </Badge>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Community without invented popularity.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                Posts, comments, likes, follows, follower counts, and trending
                hashtags on this screen come from the canonical backend. Empty
                communities stay empty instead of being filled with fake
                creators or engagement.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Link href="/hopeai">
                <Button variant="outline" className="w-full gap-2">
                  <Bot className="h-4 w-4" /> HopeAI
                </Button>
              </Link>
              <Link href="/charity">
                <Button variant="outline" className="w-full gap-2">
                  <Heart className="h-4 w-4" /> SkyHope
                </Button>
              </Link>
              <Link href="/skyschool">
                <Button variant="outline" className="w-full gap-2">
                  <GraduationCap className="h-4 w-4" /> Learn
                </Button>
              </Link>
              <Link href="/gaming">
                <Button variant="outline" className="w-full gap-2">
                  <Gamepad2 className="h-4 w-4" /> Games
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            <div className="flex gap-1 rounded-xl border border-border/40 bg-card/50 p-1">
              {(["all", "following"] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedTag(null);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "all" ? "Community" : "Following"}
                </button>
              ))}
            </div>

            {(trendingQuery.data?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2">
                {trendingQuery.data?.map(item => (
                  <button
                    key={item.hashtag}
                    type="button"
                    onClick={() =>
                      setSelectedTag(current =>
                        current === item.hashtag ? null : item.hashtag
                      )
                    }
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                      selectedTag === item.hashtag
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/40 bg-card/50 hover:border-primary/40"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-medium">{item.hashtag}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.mentions}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {isAuthenticated ? (
              <Card className="border-border/40 bg-card/60">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AvatarLabel value={user?.name || user?.username || "You"} />
                    <div className="flex-1 space-y-3">
                      <Textarea
                        value={postContent}
                        onChange={event => setPostContent(event.target.value)}
                        placeholder="Share an update, question, idea, or lesson…"
                        maxLength={255}
                        className="min-h-24 resize-none"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          {postContent.length}/255 · persisted after publish
                        </span>
                        <Button
                          size="sm"
                          disabled={
                            !postContent.trim() || createPost.isPending
                          }
                          onClick={() =>
                            createPost.mutate({ content: postContent.trim() })
                          }
                        >
                          {createPost.isPending ? "Publishing…" : "Publish"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium">Read publicly, post when signed in.</p>
                    <p className="text-xs text-muted-foreground">
                      Authentication is required for posting, likes, comments,
                      and follows.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      window.location.href = "/api/oauth/login";
                    }}
                  >
                    Sign in
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "following" && !isAuthenticated ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  Sign in to load the persisted posts from accounts you follow.
                </CardContent>
              </Card>
            ) : (
              <FeedState
                loading={
                  activeTab === "following"
                    ? followingQuery.isLoading
                    : feedQuery.isLoading
                }
                error={
                  activeTab === "following"
                    ? followingQuery.error?.message
                    : feedQuery.error?.message
                }
                empty={displayFeed.length === 0}
                filtered={Boolean(selectedTag)}
              />
            )}

            <div className="space-y-3">
              {displayFeed.map(post => {
                const postId = String(post.id);
                const authorId = String(post.userId ?? "unknown");
                const isOwnPost =
                  Boolean(user?.id) && authorId === String(user?.id);
                const commentsOpen = selectedPostId === postId;

                return (
                  <Card
                    key={postId}
                    className="border-border/40 bg-card/60 transition hover:border-primary/20"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <AvatarLabel
                          value={
                            isOwnPost
                              ? user?.name || "You"
                              : authorId.slice(0, 8)
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold">
                                {isOwnPost
                                  ? user?.name || user?.username || "You"
                                  : `Member ${authorId.slice(0, 12)}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {post.createdAt
                                  ? new Date(post.createdAt).toLocaleString()
                                  : "Persisted post"}
                              </p>
                            </div>
                            {isAuthenticated && !isOwnPost && authorId !== "unknown" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5"
                                disabled={followUser.isPending}
                                onClick={() =>
                                  followUser.mutate({ userId: authorId })
                                }
                              >
                                <UserPlus className="h-3.5 w-3.5" /> Follow
                              </Button>
                            )}
                          </div>

                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {post.content}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <button
                              type="button"
                              disabled={!isAuthenticated || likePost.isPending}
                              onClick={() =>
                                likePost.mutate({ postId })
                              }
                              className="flex items-center gap-1.5 transition hover:text-red-400 disabled:opacity-50"
                            >
                              <Heart className="h-4 w-4" />
                              {post.likes ?? 0}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleComments(postId)}
                              className={`flex items-center gap-1.5 transition hover:text-primary ${
                                commentsOpen ? "text-primary" : ""
                              }`}
                            >
                              <MessageCircle className="h-4 w-4" />
                              {post.comments ?? 0}
                            </button>
                            <button
                              type="button"
                              onClick={() => void sharePost(postId)}
                              className="flex items-center gap-1.5 transition hover:text-primary"
                            >
                              <Share2 className="h-4 w-4" /> Share
                            </button>
                          </div>

                          {commentsOpen && (
                            <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                              {commentsQuery.isLoading && (
                                <p className="text-xs text-muted-foreground">
                                  Loading comments…
                                </p>
                              )}
                              {commentsQuery.data?.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                  No comments yet.
                                </p>
                              )}
                              {commentsQuery.data?.map(comment => (
                                <div
                                  key={String(comment.id)}
                                  className="rounded-xl bg-muted/35 p-3"
                                >
                                  <p className="text-xs font-semibold">
                                    Member {String(comment.userId ?? "").slice(0, 12)}
                                  </p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {comment.content}
                                  </p>
                                </div>
                              ))}

                              {isAuthenticated && (
                                <div className="flex gap-2">
                                  <Input
                                    value={commentContent}
                                    onChange={event =>
                                      setCommentContent(event.target.value)
                                    }
                                    onKeyDown={event => {
                                      if (
                                        event.key === "Enter" &&
                                        commentContent.trim()
                                      ) {
                                        addComment.mutate({
                                          postId,
                                          content: commentContent.trim(),
                                        });
                                      }
                                    }}
                                    maxLength={255}
                                    placeholder="Add a persisted comment…"
                                  />
                                  <Button
                                    size="icon"
                                    disabled={
                                      !commentContent.trim() ||
                                      addComment.isPending
                                    }
                                    onClick={() =>
                                      addComment.mutate({
                                        postId,
                                        content: commentContent.trim(),
                                      })
                                    }
                                    aria-label="Send comment"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4">
            {user && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-primary" /> Your network
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2">
                  <Stat value={statsQuery.data?.posts ?? 0} label="Posts" />
                  <Stat
                    value={statsQuery.data?.followers ?? 0}
                    label="Followers"
                  />
                  <Stat
                    value={statsQuery.data?.following ?? 0}
                    label="Following"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Active creators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {creators.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No other persisted creators are visible in the recent feed
                    yet.
                  </p>
                ) : (
                  creators.map(creator => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          Member {creator.id.slice(0, 12)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {creator.posts} recent{" "}
                          {creator.posts === 1 ? "post" : "posts"}
                        </p>
                      </div>
                      {isAuthenticated && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={followUser.isPending}
                          onClick={() =>
                            followUser.mutate({ userId: creator.id })
                          }
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" /> Continue across
                  SKYCOIN4444
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <QuickLink
                  href="/hopeai"
                  icon={<Bot className="h-4 w-4" />}
                  title="Work through an idea with HopeAI"
                />
                <QuickLink
                  href="/charity"
                  icon={<Heart className="h-4 w-4" />}
                  title="Explore SkyHope charity beta"
                />
                <QuickLink
                  href="/skyschool"
                  icon={<BookOpen className="h-4 w-4" />}
                  title="Learn in SkySchool"
                />
                <QuickLink
                  href="/gaming"
                  icon={<Gamepad2 className="h-4 w-4" />}
                  title="Open SKY Gaming"
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function AvatarLabel({ value }: { value: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
      {value.trim().charAt(0).toUpperCase() || "U"}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link href={href}>
      <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/40 p-3 text-sm transition hover:border-primary/30 hover:bg-primary/5">
        <span className="text-primary">{icon}</span>
        <span>{title}</span>
      </div>
    </Link>
  );
}

function FeedState({
  loading,
  error,
  empty,
  filtered,
}: {
  loading: boolean;
  error?: string;
  empty: boolean;
  filtered: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading persisted posts…
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="py-8 text-center text-sm text-destructive">
          Social feed unavailable: {error}
        </CardContent>
      </Card>
    );
  }
  if (empty) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Globe className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">
            {filtered
              ? "No persisted posts match this hashtag."
              : "No persisted posts are available in this feed yet."}
          </p>
          <p className="max-w-md text-xs text-muted-foreground">
            SKYCOIN4444 does not insert fictional creators or engagement to make
            an empty beta community look busy.
          </p>
        </CardContent>
      </Card>
    );
  }
  return null;
}
