import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import WebRTCBroadcaster from "@/components/WebRTCBroadcaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [session, setSession] = useState<{ id: string; status: string; streamKey?: string } | null>(null);
  const create = trpc.stream.create.useMutation({ onError: error => toast.error(error.message) });
  const goLive = trpc.stream.goLive.useMutation({ onSuccess: data => { setSession(data); toast.success("You are live"); }, onError: error => toast.error(error.message) });
  const end = trpc.stream.endStream.useMutation({ onSuccess: () => { toast.success("Stream ended"); setSession(null); }, onError: error => toast.error(error.message) });

  if (!isAuthenticated) return <div className="flex min-h-screen items-center justify-center p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>Sign in to go live</CardTitle><CardDescription>Creator tools require an authenticated account.</CardDescription></CardHeader><CardContent><Button className="w-full" onClick={() => { window.location.href = "/api/oauth/login"; }}>Sign in</Button></CardContent></Card></div>;

  const createAndGoLive = async () => {
    if (!title.trim()) return toast.error("Add a title before going live");
    const created = await create.mutateAsync({ title: title.trim(), description: description.trim() || undefined, category });
    setSession(created);
    goLive.mutate({ sessionId: created.id });
  };

  return <div className="min-h-screen bg-background"><header className="border-b border-border/60"><div className="mx-auto flex max-w-screen-xl items-center gap-3 px-4 py-4 lg:px-6"><Link href="/live"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to live</Button></Link><div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Creator beta</div></div></header><main className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6"><div className="mb-8"><div className="mb-2 flex items-center gap-2 text-red-300"><Radio className="h-5 w-5" /><span className="text-sm font-semibold">Creator studio</span></div><h1 className="text-3xl font-bold tracking-tight">Go live</h1><p className="mt-2 max-w-2xl text-muted-foreground">Create a session, check your camera and microphone, then publish it to the live discovery feed. Browser preview is available now; external RTMP publishing needs a configured ingest service.</p></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"><section><WebRTCBroadcaster isLive={session?.status === "live"} streamKey={session?.streamKey} rtmpUrl="rtmp://configure-ingest.example/live" title={title} onGoLive={createAndGoLive} onEndStream={() => session && end.mutate({ streamId: session.id })} /></section><Card><CardHeader><CardTitle>Stream details</CardTitle><CardDescription>These details appear in the live feed.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="stream-title">Title</Label><Input id="stream-title" value={title} onChange={event => setTitle(event.target.value)} placeholder="What are you sharing?" maxLength={120} disabled={Boolean(session)} /><p className="text-right text-xs text-muted-foreground">{title.length}/120</p></div><div className="space-y-2"><Label htmlFor="stream-description">Description</Label><Textarea id="stream-description" value={description} onChange={event => setDescription(event.target.value)} placeholder="Give viewers a reason to join…" maxLength={500} disabled={Boolean(session)} /></div><div className="space-y-2"><Label htmlFor="stream-category">Category</Label><Input id="stream-category" value={category} onChange={event => setCategory(event.target.value)} placeholder="Community" maxLength={40} disabled={Boolean(session)} /></div>{session && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">Session status: <strong>{session.status}</strong><p className="mt-1 text-xs text-emerald-100/70">The live feed can discover this session while this server process is running.</p></div>}<Button className="w-full gap-2" disabled={create.isPending || goLive.isPending || Boolean(session)} onClick={createAndGoLive}><Radio className="h-4 w-4" /> {create.isPending || goLive.isPending ? "Starting…" : "Create and go live"}</Button>{session && <Button variant="outline" className="w-full" onClick={() => navigate("/live")}>Open viewer experience</Button>}</CardContent></Card></div></main></div>;
}
