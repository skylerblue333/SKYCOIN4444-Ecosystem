import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import WebRTCBroadcaster from "@/components/WebRTCBroadcaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Radio, ShieldCheck } from "lucide-react";

export default function LiveStreamSetup() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Community");
  const [session, setSession] = useState<{
    id: string;
    status: string;
    hlsUrl?: string | null;
  } | null>(null);

  const create = trpc.stream.create.useMutation({
    onError: error => toast.error(error.message),
  });
  const goLive = trpc.stream.goLive.useMutation({
    onSuccess: data => {
      setSession(data);
      toast.success("Shared stream is live");
    },
    onError: error => toast.error(error.message),
  });
  const end = trpc.stream.endStream.useMutation({
    onSuccess: () => {
      toast.success("Stream session ended");
      setSession(null);
    },
    onError: error => toast.error(error.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in for creator setup</CardTitle>
            <CardDescription>
              Creator tools require an authenticated account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = "/api/oauth/login";
              }}
            >
              Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createAndRequestLive = async () => {
    if (!title.trim()) {
      toast.error("Add a title before creating a session");
      return;
    }

    let current = session;
    if (!current) {
      const created = await create.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
      });
      setSession(created);
      current = created;
      toast.success("Stream session saved");
    }

    goLive.mutate({ sessionId: current.id });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-screen-xl items-center gap-3 px-4 py-4 lg:px-6">
          <Link href="/live">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to live
            </Button>
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Creator beta
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-red-300">
            <Radio className="h-5 w-5" />
            <span className="text-sm font-semibold">Creator studio</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Live-stream setup
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Camera and microphone preview runs in your browser. Session metadata
            is persisted in MySQL. SKYCOIN4444 will not advertise the session as
            live until a playable shared-media/HLS URL is attached by a real
            ingest service.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <WebRTCBroadcaster
              isLive={session?.status === "live"}
              title={title}
              onGoLive={createAndRequestLive}
              onEndStream={() =>
                session && end.mutate({ streamId: session.id })
              }
            />
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Stream details</CardTitle>
              <CardDescription>
                These details are stored with the beta stream session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stream-title">Title</Label>
                <Input
                  id="stream-title"
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  placeholder="What are you sharing?"
                  maxLength={120}
                  disabled={Boolean(session)}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {title.length}/120
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream-description">Description</Label>
                <Textarea
                  id="stream-description"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  placeholder="Give viewers a reason to join…"
                  maxLength={255}
                  disabled={Boolean(session)}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {description.length}/255
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream-category">Category</Label>
                <Input
                  id="stream-category"
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  placeholder="Community"
                  maxLength={40}
                  disabled={Boolean(session)}
                />
              </div>

              {session && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                  Session status: <strong>{session.status}</strong>
                  <p className="mt-1 text-xs text-emerald-100/70">
                    Session metadata is persisted across application restarts.
                    Shared media still requires a configured ingest pipeline.
                  </p>
                </div>
              )}

              <Button
                className="w-full gap-2"
                disabled={create.isPending || goLive.isPending}
                onClick={createAndRequestLive}
              >
                <Radio className="h-4 w-4" />
                {create.isPending || goLive.isPending
                  ? "Checking live readiness…"
                  : session
                    ? "Check shared-media readiness"
                    : "Create session and check readiness"}
              </Button>

              {session && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/live")}
                >
                  Open viewer experience
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
