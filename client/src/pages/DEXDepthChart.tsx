import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowUpDown,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function DEXDepthChart() {
  const prices = trpc.prices.list.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: false,
  });
  const [selectedId, setSelectedId] = useState<string>("bitcoin");

  const available = prices.data ?? [];
  const selected =
    available.find(item => item.id === selectedId) ?? available[0] ?? null;

  const sorted = useMemo(
    () =>
      [...available].sort(
        (a, b) => Number(b.market_cap ?? 0) - Number(a.market_cap ?? 0)
      ),
    [available]
  );

  return (
    <div className="min-h-screen bg-[#090611] p-4 text-white md:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <ArrowUpDown className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold">DEX Market Preview</h1>
            </div>
            <p className="text-sm text-slate-400">
              Provider spot-price reference; no SKYCOIN4444 order book or
              liquidity engine is enabled.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => prices.refetch()}
            disabled={prices.isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${prices.isFetching ? "animate-spin" : ""}`}
            />
            Refresh provider data
          </Button>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                Trading and liquidity actions are disabled
              </h2>
              <p className="mt-1 text-sm text-amber-100/80">
                This surface does not fabricate bids, asks, TVL, swap execution,
                pool balances, or liquidity-provider returns. A real DEX view
                requires a verified order-book or AMM provider plus settlement
                and accounting contracts.
              </p>
            </div>
          </div>
        </div>

        {prices.isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            Market provider data is unavailable. No simulated price or depth data
            has been substituted.
          </div>
        )}

        {!prices.isLoading && available.length === 0 && !prices.isError && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
            No verified provider quotes are currently available.
          </div>
        )}

        {available.length > 0 && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sorted.slice(0, 12).map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    selected?.id === item.id
                      ? "border-purple-500/50 bg-purple-500/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{item.symbol}</div>
                  <div className="text-xs text-slate-400">{item.name}</div>
                </button>
              ))}
            </div>

            {selected && (
              <div className="grid gap-4 md:grid-cols-4">
                <Metric
                  label="Provider spot price"
                  value={`$${formatPrice(selected.current_price)}`}
                />
                <Metric
                  label="24h change"
                  value={`${selected.price_change_percentage_24h >= 0 ? "+" : ""}${Number(
                    selected.price_change_percentage_24h ?? 0
                  ).toFixed(2)}%`}
                  trend={selected.price_change_percentage_24h}
                />
                <Metric
                  label="Provider market cap"
                  value={formatUsd(selected.market_cap)}
                />
                <Metric
                  label="Provider 24h volume"
                  value={formatUsd(selected.total_volume)}
                />
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-[#0e0a1a] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <h2 className="font-semibold">Order-book depth</h2>
                </div>
                <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                  Not configured. No synthetic order book is rendered.
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#0e0a1a] p-5">
                <h2 className="mb-3 font-semibold">Execution capability</h2>
                <div className="space-y-3 text-sm">
                  <Capability label="Swap settlement" />
                  <Capability label="Liquidity provisioning" />
                  <Capability label="Pool TVL accounting" />
                  <Capability label="Slippage / routing proof" />
                </div>
                <Button className="mt-5 w-full" disabled>
                  Swap unavailable in engineering beta
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="font-mono text-lg font-bold">{value}</p>
        {typeof trend === "number" &&
          (trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          ))}
      </div>
    </div>
  );
}

function Capability({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2">
      <span className="text-slate-300">{label}</span>
      <Badge variant="outline">not configured</Badge>
    </div>
  );
}

function formatPrice(value: number) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric < 1 ? numeric.toFixed(6) : numeric.toLocaleString();
}

function formatUsd(value: number) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(numeric);
}
