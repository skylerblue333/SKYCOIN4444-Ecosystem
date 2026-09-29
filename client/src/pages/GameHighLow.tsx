import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowDown, ArrowUp, RefreshCw, ShieldCheck } from "lucide-react";

function drawValue() {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return 2 + (values[0] % 13);
}

function cardLabel(value: number) {
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  if (value === 14) return "A";
  return String(value);
}

export default function GameHighLow() {
  const [current, setCurrent] = useState(() => drawValue());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState<"win" | "loss" | "push" | null>(null);

  const guess = (direction: "higher" | "lower") => {
    const next = drawValue();
    const win = direction === "higher" ? next > current : next < current;
    const push = next === current;

    setLastResult(push ? "push" : win ? "win" : "loss");
    if (win) {
      setScore(value => value + 100 + streak * 20);
      setStreak(value => value + 1);
    } else if (!push) {
      setStreak(0);
    }
    setCurrent(next);
  };

  const reset = () => {
    setCurrent(drawValue());
    setScore(0);
    setStreak(0);
    setLastResult(null);
  };

  return (
    <main className="min-h-screen bg-[#07050f] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/gaming" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to arcade
          </Link>
          <Badge variant="outline" className="border-violet-400/30 bg-violet-400/10 text-violet-200">
            Score game · no wagering
          </Badge>
        </div>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/55 via-[#0d0918] to-fuchsia-950/35 p-6 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">High-Low</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Will the next card be higher or lower?</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/55">
            Build a streak and score points. This version has no stake, wallet, token reward, or cash-out path.
          </p>
        </section>

        <Card className="border-white/10 bg-white/[0.035] text-white">
          <CardContent className="p-6 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="text-center md:text-right">
                <div className="text-xs uppercase tracking-wider text-white/35">Score</div>
                <div className="text-4xl font-black text-violet-200">{score}</div>
                <div className="mt-1 text-sm text-white/45">Streak {streak}</div>
              </div>

              <div className="mx-auto grid h-56 w-40 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br from-white to-slate-200 text-slate-950 shadow-2xl">
                <div className="text-center">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Current</div>
                  <div className="mt-2 text-7xl font-black">{cardLabel(current)}</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={() => guess("higher")} className="w-full justify-center gap-2">
                  <ArrowUp className="h-4 w-4" /> Higher
                </Button>
                <Button onClick={() => guess("lower")} variant="outline" className="w-full justify-center gap-2">
                  <ArrowDown className="h-4 w-4" /> Lower
                </Button>
                <Button onClick={reset} variant="ghost" className="w-full justify-center gap-2 text-white/55">
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            <div className="mt-8 min-h-10 text-center">
              {lastResult && (
                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${lastResult === "win" ? "bg-green-500/10 text-green-300" : lastResult === "loss" ? "bg-red-500/10 text-red-300" : "bg-white/10 text-white/65"}`}>
                  {lastResult === "win" ? "Correct — streak continues." : lastResult === "loss" ? "Miss — start a new streak." : "Push — same value, streak preserved."}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm leading-6 text-emerald-100/85">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
            <p><strong>Beta boundary:</strong> card values are generated in-browser for a score game. There is no real-money betting, token settlement, purchase, or reward claim.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
