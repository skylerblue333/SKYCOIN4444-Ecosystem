import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { AlertTriangle, CheckCircle2, ChevronRight, CircleDashed, FlaskConical, Map } from "lucide-react";
import { AREA_STATUS_LABELS, ECOSYSTEM_AREAS, type AreaReadiness } from "@/data/ecosystemAreas";
import { ROUTE_CAPABILITIES } from "@/data/routeCatalog";

const ALIASES: Record<string, string[]> = {
  "live-streaming": ["live", "stream", "gifting", "reaction"],
  "ai-assistants": ["hope", "assistant", "chatbot"],
  wallets: ["wallet", "custody"],
  messaging: ["message", "chat", "comment", "conversation"],
  video: ["video", "vod", "clip"],
  "developer-apis": ["api", "apidoc", "apiusage"],
  analytics: ["analytic", "dashboard", "report"],
  learning: ["school", "course", "lesson", "certificate"],
  communities: ["community", "server", "forum"],
};

const STATUS_STYLES: Record<AreaReadiness, { icon: typeof CheckCircle2; tone: string; surface: string }> = {
  verified: { icon: CheckCircle2, tone: "text-emerald-300", surface: "border-emerald-400/20 bg-emerald-400/[0.05]" },
  beta: { icon: FlaskConical, tone: "text-cyan-300", surface: "border-cyan-400/20 bg-cyan-400/[0.05]" },
  planned: { icon: CircleDashed, tone: "text-amber-300", surface: "border-amber-400/20 bg-amber-400/[0.05]" },
  blocked: { icon: AlertTriangle, tone: "text-rose-300", surface: "border-rose-400/20 bg-rose-400/[0.05]" },
};

function scoreArea(areaId: string, pathname: string) {
  const clean = pathname.toLowerCase().replace(/[^a-z0-9]/g, "");
  const area = ECOSYSTEM_AREAS.find(item => item.id === areaId);
  if (!area) return 0;
  const tokens = [areaId.replace(/-/g, ""), ...area.label.toLowerCase().split(/[^a-z0-9]+/), ...(ALIASES[areaId] ?? [])].filter(Boolean);
  return tokens.reduce((score, token) => score + (clean.includes(token.replace(/[^a-z0-9]/g, "")) ? (token.length > 4 ? 4 : 2) : 0), 0);
}

export function EcosystemAreaStatus() {
  const [location] = useLocation();
  const area = useMemo(() => {
    const ranked = ECOSYSTEM_AREAS.map(item => ({ item, score: scoreArea(item.id, location) })).sort((a, b) => b.score - a.score);
    return ranked[0]?.score ? ranked[0].item : undefined;
  }, [location]);

  if (!area || location === "/" || location === "/ecosystem") return null;
  const style = STATUS_STYLES[area.status];
  const Icon = style.icon;
  const related = ROUTE_CAPABILITIES.filter(capability => {
    const haystack = `${capability.route} ${capability.label} ${capability.intent}`.toLowerCase();
    return haystack.includes(area.id.split("-")[0]) || (ALIASES[area.id] ?? []).some(alias => haystack.includes(alias));
  }).slice(0, 3);

  return (
    <div className={`border-b ${style.surface}`} role="status" aria-label={`${area.label} readiness`}>
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 text-xs lg:px-6">
        <Icon className={`h-3.5 w-3.5 ${style.tone}`} aria-hidden="true" />
        <strong className="text-foreground">{area.label}</strong>
        <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-foreground" title={`Maturity ${area.maturityScore}/10; next gate: ${area.nextGate}`}>
          {area.maturityScore}/10
        </span>
        <span className="text-white/45">Engineering beta</span>
        <span className={style.tone}>{AREA_STATUS_LABELS[area.status]}</span>
        <span className="hidden text-muted-foreground md:inline">{area.statusDescription}</span>
        {area.status === "blocked" && <span className="font-medium text-rose-200">Do not use this surface for settlement or custody.</span>}
        {area.status === "planned" && <span className="font-medium text-amber-200">Preview only until the required backend is connected.</span>}
        <span className="hidden text-white/45 xl:inline">Next: {area.nextGate}</span>
        {related.length > 0 && <span className="ml-auto flex items-center gap-1 text-muted-foreground">Related: {related.map((route, index) => <span key={route.route}><Link href={route.route} className="hover:text-foreground">{route.label}</Link>{index < related.length - 1 ? "," : ""}</span>)}</span>}
        <Link href="/ecosystem" className="ml-auto inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"><Map className="h-3.5 w-3.5" /> Area map <ChevronRight className="h-3 w-3" /></Link>
      </div>
    </div>
  );
}
