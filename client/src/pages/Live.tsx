import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import StreamViewer from "@/components/StreamViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertCircle,
  Eye,
  MessageCircle,
  Radio,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";

export default function Live() {
  const { isAuthenticated } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const streamsQuery = trpc.stream.live.useQuery(
    { limit: 20 },
    { refetchInterval: 10000 }
  );
  const streams = streamsQuery.data ?? [];
  const active =
    streams.find(stream => stream.id === selectedId) ?? streams[0];

  const chatQuery = trpc.stream.chat.useQuery(
    { streamId: active?.id ?? "", limit: 100 },
    { enabled: Boolean(active?.id), refetchInterval: 3000 }
  );
  const sendChat = trpc.stream.sendChat.useMutation({
    onSuccess: () => {
      setMessage("");
      void chatQuery.refetch();
    },
    onError: error => toast.error(error.message),
  });
  const comments = useMemo(() => chatQuery.data ?? [], [chatQuery.data]);

  const submitMessage = () => {
    if (!active?.id || !message.trim() || !isAuthenticated) return;
    sendChat.mutate({ streamId: active.id, message: message.trim() });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: active?.title ?? "Live stream",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
      toast.success("Stream link ready to share");
    } catch {
      // User cancelled the native share sheet.
    }
  };

  if (streamsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 text-center text-muted-foreground">
        Finding verified live streams…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Live beta</h1>
              <p className="text-xs text-muted-foreground">
                Only sessions with configured shared media appear as live
              </p>
            </div>
          </div>
          <Link href="/livestreamsetup">
            <Button className="gap-2">
              <Radio className="h-4 w-4" /> Creator setup
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
        {streamsQuery.isError && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertCircle className="h-4 w-4" /> Live discovery is temporarily
            unavailable. Retry in a moment.
          </div>
        )}

        {!active ? (
          <Card className="mx-auto max-w-2xl border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Radio className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">
                No verified live sessions yet
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Creator session metadata can be saved now. A session is not
                advertised as live until a playable shared-media URL is
                configured.
              </p>
              <Link href="/livestreamsetup">
                <Button>Open creator setup</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              <StreamViewer
                title={active.title}
                streamerName="SKYCOIN4444 creator"
                viewerCount={active.viewerCount}
                isLive={active.status === "live"}
                hlsUrl={active.hlsUrl}
              />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                      LIVE
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {active.category || "General"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{active.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {active.description ||
                      "Verified shared-media session."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Stat
                  icon={<Eye className="h-4 w-4" />}
                  label="Watching now"
                  value={active.viewerCount.toLocaleString()}
                />
                <Stat
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Peak viewers"
                  value={active.peakViewers.toLocaleString()}
                />
                <Stat
                  icon={<MessageCircle className="h-4 w-4" />}
                  label="Chat messages"
                  value={comments.length.toLocaleString()}
                />
              </div>
            </section>

            <aside className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircle className="h-4 w-4 text-cyan-300" /> Live
                    chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-amber-100/80">
                    Beta chat is ephemeral and can reset on server restart. It
                    is not yet durable message history.
                  </p>
                  <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <p className="py-10 text-center text-sm text-muted-foreground">
                        Be the first to say hello.
                      </p>
                    ) : (
                      comments.map(comment => (
                        <div
                          key={comment.id}
                          className="rounded-lg bg-muted/40 p-2.5"
                        >
                          <div className="text-xs font-semibold text-primary">
                            {comment.author}
                          </div>
                          <p className="mt-1 text-sm">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={event => setMessage(event.target.value)}
                      onKeyDown={event =>
                        event.key === "Enter" && submitMessage()
                      }
                      placeholder={
                        isAuthenticated ? "Say something…" : "Sign in to chat"
                      }
                      maxLength={255}
                      disabled={!isAuthenticated || sendChat.isPending}
                    />
                    <Button
                      size="icon"
                      onClick={submitMessage}
                      disabled={
                        !isAuthenticated ||
                        !message.trim() ||
                        sendChat.isPending
                      }
                      aria-label="Send chat message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-amber-500/[0.04]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Creator support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Monetary tipping is disabled in this beta until a verified
                    settlement and accounting contract is integrated and
                    tested.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Live now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {streams.map(stream => (
                    <button
                      key={stream.id}
                      onClick={() => setSelectedId(stream.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        active.id === stream.id
                          ? "border-primary bg-primary/10"
                          : "border-border/60 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {stream.title}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {stream.viewerCount}
                        </span>
                      </div>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {stream.category || "General"}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
