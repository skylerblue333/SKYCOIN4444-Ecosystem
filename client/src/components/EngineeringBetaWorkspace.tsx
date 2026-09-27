import { Link } from "wouter";
import { ArrowRight, CheckCircle2, CircleDashed, FlaskConical, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AREA_STATUS_LABELS, ECOSYSTEM_AREAS } from "@/data/ecosystemAreas";

type Props = {
  areaId: string;
  title: string;
  description: string;
  actions: string[];
  related?: Array<{ label: string; href: string }>;
};

export function EngineeringBetaWorkspace({ areaId, title, description, actions, related = [] }: Props) {
  const area = ECOSYSTEM_AREAS.find(item => item.id === areaId);
  const score = area?.maturityScore ?? 1;
  const status = area?.status ?? "planned";
  const Icon = status === "blocked" ? ShieldAlert : status === "beta" ? FlaskConical : status === "verified" ? CheckCircle2 : CircleDashed;
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground lg:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4 text-cyan-300" /> Engineering beta · {AREA_STATUS_LABELS[status]} · {score}/10</div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </header>
        <Card className="border-cyan-400/20 bg-cyan-400/[0.03]"><CardHeader><CardTitle className="text-lg">What you can do now</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{actions.map(action => <div key={action} className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/50 p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{action}</div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Next quality gate</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{area?.nextGate ?? "Define an owned backend action, persistence, tests, recovery behavior, and deployment evidence."}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${score * 10}%` }} /></div><div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Evidence maturity</span><span>{score}/10</span></div></CardContent></Card>
        {related.length > 0 && <div className="flex flex-wrap gap-2">{related.map(route => <Link key={route.href} href={route.href}><Button variant="outline" className="gap-2">{route.label}<ArrowRight className="h-4 w-4" /></Button></Link>)}</div>}
      </div>
    </main>
  );
}
