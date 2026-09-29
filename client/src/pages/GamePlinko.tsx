import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CircleDot, ShieldAlert } from "lucide-react";

const MULTIPLIERS = [5, 2, 1.3, 1, 0.6, 1, 1.3, 2, 5];

function secureBit() {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] & 1;
}

export default function GamePlinko() {
  const [demoPoints, setDemoPoints] = useState(1000);
  const [stake, setStake] = useState(20);
  const [lastBucket, setLastBucket] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ bucket: number; multiplier: number }>>([]);

  const pegs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: row + 2 }, (_, peg) => ({ row, peg }))
      ),
    []
  );

  const drop = () => {
    const wager = Math.max(1, Math.min(Math.floor(stake), demoPoints));
    if (wager <= 0 || demoPoints <= 0) return;

    let bucket = 0;
    for (let row = 0; row < 8; row += 1) bucket += secureBit();
    const multiplier = MULTIPLIERS[bucket];
    setDemoPoints(points => Math.max(0, Math.round(points - wager + wager * multiplier)));
    setLastBucket(bucket);
    setHistory(prev => [{ bucket, multiplier }, ...prev].slice(0, 10));
  };

  return (
    <main className="min-h-screen bg-[#07050f] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/gaming" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to arcade
          </Link>
          <Badge variant="outline" className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
            Physics-inspired demo
          </Badge>
        </div>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950/40 via-[#0b0a18] to-violet-950/40 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Plinko demo</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">Drop. Bounce. Score.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                An eight-row browser simulation with local demo points. Bucket selection is generated locally and is not a verifiable wagering outcome.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
              <div className="text-xs uppercase tracking-wider text-white/40">Demo points</div>
              <div className="text-3xl font-black tabular-nums">{demoPoints}</div>
            </div>
          </div>
        </section>

        <Card className="border-white/10 bg-white/[0.035] text-white">
          <CardContent className="p-5 sm:p-8">
            <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="space-y-3">
                {pegs.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-6">
                    {row.map(({ peg }) => (
                      <CircleDot key={peg} className="h-4 w-4 text-cyan-300/70" />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-9 gap-1">
                {MULTIPLIERS.map((multiplier, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border px-1 py-2 text-center text-[10px] font-bold sm:text-xs ${lastBucket === index ? "border-cyan-300 bg-cyan-400/20 text-cyan-100" : "border-white/10 bg-white/5 text-white/55"}`}
                  >
                    {multiplier}x
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <label className="text-sm text-white/60">Stake</label>
              <input
                type="number"
                min={1}
                max={demoPoints}
                value={stake}
                onChange={e => setStake(Number(e.target.value) || 1)}
                className="h-10 w-28 rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-cyan-400/50"
              />
              <Button onClick={drop} disabled={demoPoints <= 0}>Drop demo chip</Button>
              {demoPoints <= 0 && <Button variant="outline" onClick={() => setDemoPoints(1000)}>Reset demo</Button>}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader><CardTitle className="text-base">Recent drops</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {history.length === 0 ? (
                <p className="text-sm text-white/40">No drops yet.</p>
              ) : history.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <span className="text-white/55">Bucket {item.bucket + 1}</span>
                  <span className="font-bold text-cyan-200">{item.multiplier}x</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-amber-400/20 bg-amber-400/[0.06] text-white">
            <CardContent className="flex gap-3 p-5">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm leading-6 text-amber-100/85">
                <strong>Integrity boundary:</strong> this is a client-side demo. It has no wallet connection, real-money settlement, server-authoritative outcome, or cryptographic fairness proof.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
