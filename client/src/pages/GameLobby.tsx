import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, ShieldCheck, Sparkles, Trophy } from "lucide-react";

const games = [
  { name: "Crash", href: "/games/crash", description: "Timing-based multiplier demo with fast rounds.", status: "Demo" },
  { name: "Blackjack", href: "/games/blackjack", description: "Classic card-table experience with clear hand state.", status: "Demo" },
  { name: "Roulette", href: "/games/roulette", description: "Table-style wheel game with transparent controls.", status: "Demo" },
  { name: "Plinko", href: "/games/plinko", description: "Physics-inspired drop-board experience.", status: "Preview" },
  { name: "High-Low", href: "/games/high-low", description: "Quick prediction rounds built for short sessions.", status: "Preview" },
];

export default function GameLobby() {
  return (
    <main className="min-h-screen bg-[#07050f] text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/80 via-[#0e0a1a] to-cyan-950/50 p-6 shadow-2xl sm:p-10">
          <Badge className="mb-4 border-violet-400/30 bg-violet-400/10 text-violet-200">
            SKY Gaming Beta
          </Badge>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            A cleaner, faster crypto-game arcade.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Play the current beta catalog with demo balances while wallet settlement,
            server-authoritative outcomes, and fairness verification complete release validation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> Demo-first economy
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Sparkles className="h-4 w-4 text-violet-300" /> Mobile-ready UI
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Trophy className="h-4 w-4 text-amber-300" /> Progression-ready
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.map(game => (
            <article key={game.name} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/[0.06]">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <Gamepad2 className="h-6 w-6 text-violet-300" />
                </div>
                <Badge variant="outline" className="border-white/10 text-slate-300">{game.status}</Badge>
              </div>
              <h2 className="mt-5 text-xl font-bold">{game.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{game.description}</p>
              <Link href={game.href}>
                <Button className="mt-5 w-full bg-violet-600 font-semibold hover:bg-violet-500">
                  Open {game.name}
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <aside className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5 text-sm leading-6 text-amber-100/90">
          <strong>Beta integrity:</strong> game screens must not imply real-money settlement or
          provably-fair cryptography until those paths are server-authoritative, independently
          verifiable, persistent, and covered by accounting/idempotency tests.
        </aside>
      </section>
    </main>
  );
}
