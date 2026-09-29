import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CircleDollarSign, RotateCw, ShieldAlert } from "lucide-react";

type BetKind = "red" | "black" | "even" | "odd";

const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

function secureInt(maxExclusive: number) {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] % maxExclusive;
}

export default function GameRoulette() {
  const [demoPoints, setDemoPoints] = useState(1000);
  const [stake, setStake] = useState(25);
  const [bet, setBet] = useState<BetKind>("red");
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const resultLabel = useMemo(() => {
    if (result === null) return "Ready";
    if (result === 0) return "0 · Green";
    return `${result} · ${RED.has(result) ? "Red" : "Black"} · ${result % 2 === 0 ? "Even" : "Odd"}`;
  }, [result]);

  const spin = () => {
    const wager = Math.max(1, Math.min(Math.floor(stake), demoPoints));
    if (wager <= 0 || demoPoints <= 0) return;

    const number = secureInt(37);
    const won =
      number !== 0 &&
      ((bet === "red" && RED.has(number)) ||
        (bet === "black" && !RED.has(number)) ||
        (bet === "even" && number % 2 === 0) ||
        (bet === "odd" && number % 2 === 1));

    setDemoPoints(points => points - wager + (won ? wager * 2 : 0));
    setResult(number);
    setHistory(prev => [number, ...prev].slice(0, 12));
  };

  return (
    <main className="min-h-screen bg-[#07050f] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/gaming" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to arcade
          </Link>
          <Badge variant="outline" className="border-amber-400/30 bg-amber-400/10 text-amber-200">
            Demo points only
          </Badge>
        </div>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/40 via-[#120917] to-violet-950/40 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">Roulette demo</p>
              <h1 className="mt-2 text-4xl font-black sm:text-5xl">Pick a side. Spin the wheel.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                Fast table-style rounds with local demo points. Nothing here transfers tokens, creates a wager, or proves a cryptographic outcome.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
              <div className="text-xs uppercase tracking-wider text-white/40">Demo points</div>
              <div className="text-3xl font-black tabular-nums">{demoPoints}</div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RotateCw className="h-5 w-5" /> Wheel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-full border-[14px] border-red-900/50 bg-[radial-gradient(circle_at_center,#120914_0%,#08050c_62%,#271019_63%,#07050f_100%)] shadow-2xl">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/35">Last result</div>
                  <div className="mt-2 text-4xl font-black">{resultLabel}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["red","black","even","odd"] as BetKind[]).map(option => (
                  <Button
                    key={option}
                    variant={bet === option ? "default" : "outline"}
                    onClick={() => setBet(option)}
                    className="capitalize"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-white/60">Stake</label>
                <input
                  type="number"
                  min={1}
                  max={demoPoints}
                  value={stake}
                  onChange={e => setStake(Number(e.target.value) || 1)}
                  className="h-10 w-28 rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-red-400/50"
                />
                <Button onClick={spin} disabled={demoPoints <= 0} className="min-w-36">
                  Spin demo wheel
                </Button>
                {demoPoints <= 0 && (
                  <Button variant="outline" onClick={() => setDemoPoints(1000)}>Reset demo</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-white/10 bg-white/[0.035] text-white">
              <CardHeader><CardTitle className="text-base">Recent results</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {history.length === 0 ? (
                  <span className="text-sm text-white/40">No spins yet.</span>
                ) : history.map((number, i) => (
                  <span
                    key={`${number}-${i}`}
                    className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${number === 0 ? "bg-green-600" : RED.has(number) ? "bg-red-600" : "bg-black ring-1 ring-white/20"}`}
                  >
                    {number}
                  </span>
                ))}
              </CardContent>
            </Card>

            <Card className="border-amber-400/20 bg-amber-400/[0.06] text-white">
              <CardContent className="flex gap-3 p-5">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div className="text-sm leading-6 text-amber-100/85">
                  <strong>Integrity boundary:</strong> results are generated in this browser. They are not server-authoritative, cryptographically verifiable, or eligible for real-money/token settlement.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
