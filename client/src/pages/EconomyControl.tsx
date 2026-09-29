import { Link } from "wouter";
import {
  Activity,
  ArrowLeft,
  BarChart2,
  ChevronRight,
  Database,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";

function formatNumber(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString();
}

export default function EconomyControl() {
  const token = trpc.token.metrics.useQuery();
  const platform = trpc.platform.stats.useQuery();

  const tokenData = token.data;
  const platformData = platform.data;
  const loading = token.isLoading || platform.isLoading;
  const unavailable = token.isError || platform.isError;

  const cards = [
    {
      label: "Recorded SKY444 supply",
      value: loading ? "Loading…" : formatNumber(tokenData?.totalSupply),
      icon: Zap,
      note: tokenData?.supplySource ?? "database aggregation",
    },
    {
      label: "Recorded staked amount",
      value: loading ? "Loading…" : formatNumber(tokenData?.totalStaked),
      icon: TrendingUp,
      note: "canonical staking-position rows",
    },
    {
      label: "Platform users",
      value: loading ? "Loading…" : formatNumber(platformData?.totalUsers),
      icon: Activity,
      note: "database user count",
    },
    {
      label: "Recorded transactions",
      value: loading ? "Loading…" : formatNumber(platformData?.totalTransactions),
      icon: BarChart2,
      note: "database transaction rows",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Link href="/unhidden">
          <button
            className="rounded-lg p-1.5 transition-colors hover:bg-secondary"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-sm font-bold">
            <DollarSign className="h-4 w-4 text-green-400" />
            Economy Status
          </h1>
          <p className="text-xs text-muted-foreground">
            Read-only engineering-beta accounting view
          </p>
        </div>
        <Badge variant="outline">Beta · read only</Badge>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                Financial controls are not enabled
              </h2>
              <p className="mt-1 text-sm text-amber-100/80">
                This page reports only values available from the current database.
                It does not claim live revenue, treasury funds, token price, payment
                settlement, custody, fee administration, or creator payouts.
              </p>
            </div>
          </div>
        </div>

        {unavailable && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            Current economy metrics could not be loaded. No fallback financial
            numbers are being substituted.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-border/50 bg-secondary/30 p-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {card.label}
                  </span>
                </div>
                <p className="text-lg font-bold">{card.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {card.note}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border/50 bg-secondary/20 p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Database className="h-4 w-4 text-primary" />
            Capability status
          </h2>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <StatusRow
              label="Market price"
              value={tokenData?.priceSource ?? "not_configured"}
            />
            <StatusRow
              label="Burn accounting"
              value={tokenData?.burnAccounting ?? "not_configured"}
            />
            <StatusRow
              label="Session tracking"
              value={platformData?.sessionTracking ?? "not_configured"}
            />
            <StatusRow
              label="Asset"
              value={tokenData?.asset ?? "SKY444"}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-secondary/20 p-5">
          <h2 className="mb-2 font-semibold">Administration boundary</h2>
          <p className="text-sm text-muted-foreground">
            Editable fee percentages, monthly revenue totals, and treasury
            balances were removed from this surface because there is no verified
            persisted administration contract behind them. Future controls must
            be server-authorized, audited, and backed by the canonical accounting
            model before they can appear as active controls.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Token overview", path: "/token-economy", icon: Zap },
            { label: "Investor room", path: "/investor-room", icon: TrendingUp },
          ].map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div className="flex cursor-pointer items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{link.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  const configured = value !== "not_configured";
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant={configured ? "secondary" : "outline"}>{value}</Badge>
    </div>
  );
}
