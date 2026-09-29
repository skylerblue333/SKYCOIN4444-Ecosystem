import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  Heart,
  HandHeart,
  Globe,
  Users,
  TrendingUp,
  Sparkles,
  Vote,
  Trophy,
  BarChart3,
  Target,
  Coins,
  Shield,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Award,
  Flame,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

// Preview data for the engineering beta. These are examples, not verified live campaigns or governance results.
const DAO_PROPOSALS = [
  {
    id: "prop-1",
    title: "Allocate 50,000 SKY444 to Clean Water Initiative",
    description:
      "Fund the deployment of water purification systems in 3 rural communities in East Africa. Preview scenario for a future verified nonprofit partnership; no partnership is claimed by this beta.",
    category: "Environment",
    requestedAmount: 50000,
    votesFor: 847,
    votesAgainst: 123,
    status: "active" as const,
    endsIn: "3 days",
    proposer: "SkylerDev",
  },
  {
    id: "prop-2",
    title: "Fund 100 STEM Scholarships for Underserved Youth",
    description:
      "Provide full scholarships for coding bootcamps and university CS programs. Preview scenario for future education partners; no partnership is claimed by this beta.",
    category: "Education",
    requestedAmount: 120000,
    votesFor: 1203,
    votesAgainst: 89,
    status: "active" as const,
    endsIn: "5 days",
    proposer: "CryptoKing",
  },
  {
    id: "prop-3",
    title: "Emergency Relief: Disaster Recovery Fund",
    description:
      "Rapid-response fund for natural disaster relief. Preview scenario for a future rapid-response workflow; automated distribution is not active in this beta.",
    category: "Humanitarian",
    requestedAmount: 200000,
    votesFor: 2341,
    votesAgainst: 156,
    status: "passed" as const,
    endsIn: "Ended",
    proposer: "NFTQueen",
  },
];

function DonateDialog({
  campaign,
  onSuccess,
}: {
  campaign: any;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const donate = trpc.charity.donate.useMutation({
    onSuccess: () => {
      toast.success(
        `Beta donation intent recorded: ${amount} SKY444 for "${campaign.title}". This is not proof of settlement or a charitable receipt.`
      );
      setAmount("");
      setOpen(false);
      onSuccess();
    },
    onError: () => toast.error("The beta donation intent was not recorded. No settlement is implied."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-xs font-semibold"
        >
          <Heart className="w-3 h-3 mr-1" /> Record Intent
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg">Record Donation Intent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <div className="p-3 rounded-lg bg-background/50 border border-border/30">
            <h4 className="font-semibold text-sm">{campaign.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {campaign.description}
            </p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Intended Amount (SKY444)
            </label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="bg-background/50 border-border/30 font-mono"
            />
            <div className="flex gap-2 mt-2">
              {[10, 50, 100, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="px-3 py-1 rounded-md border border-border/30 bg-background/50 text-xs font-mono hover:border-primary/50 transition-all"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-600/5 border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Shield className="w-3.5 h-3.5" />
              <span>
                Beta notice: donation settlement and on-chain verification must be confirmed before treating this transaction as a real charitable contribution.
              </span>
            </div>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={!amount || parseFloat(amount) <= 0 || donate.isPending}
            onClick={() =>
              donate.mutate({
                campaignId: campaign.id,
                amount: parseFloat(amount),
              })
            }
          >
            {donate.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Heart className="w-4 h-4 mr-2" />
            )}
            Record Donation Intent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProposalCard({ proposal }: { proposal: (typeof DAO_PROPOSALS)[0] }) {
  const { isAuthenticated } = useAuth();
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercent =
    totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  return (
    <div
      className={`p-5 rounded-xl border ${proposal.status === "passed" ? "border-purple-500/30 bg-purple-600/5" : "border-border/50 bg-card/80"} backdrop-blur`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {proposal.category}
          </Badge>
          <Badge
            className={`text-[10px] ${proposal.status === "passed" ? "bg-purple-600/10 text-purple-400 border-purple-500/30" : "bg-primary/10 text-primary border-primary/30"}`}
          >
            {proposal.status === "passed" ? (
              <>
                <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Passed
              </>
            ) : (
              <>
                <Clock className="w-2.5 h-2.5 mr-0.5" /> {proposal.endsIn}
              </>
            )}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          by {proposal.proposer}
        </span>
      </div>

      <h3 className="font-semibold mb-2">{proposal.title}</h3>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
        {proposal.description}
      </p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-purple-400 font-mono">
          {proposal.votesFor} For
        </span>
        <span className="text-red-400 font-mono">
          {proposal.votesAgainst} Against
        </span>
      </div>
      <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30 mb-3">
        <div
          className="h-full bg-purple-600 rounded-full"
          style={{ width: `${forPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          <Coins className="w-3 h-3 inline mr-1" />
          {(proposal.requestedAmount ?? 0).toLocaleString()} SKY444
        </span>
        {proposal.status === "active" &&
          (isAuthenticated ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-xs h-7 text-purple-400 border-purple-500/30"
              >
                <ThumbsUp className="w-3 h-3 mr-1" /> Preview For
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-xs h-7 text-red-400 border-red-500/30"
              >
                <ThumbsDown className="w-3 h-3 mr-1" /> Preview Against
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="text-xs h-7" disabled>
              Voting Preview
            </Button>
          ))}
      </div>
    </div>
  );
}

export default function Charity() {
  const { isAuthenticated } = useAuth();
  const {
    data: campaigns,
    isLoading,
    refetch,
  } = trpc.charity.campaigns.useQuery({});
  const { data: charityStats } = trpc.charity.stats.useQuery();
  const { data: donorLeaderboard } = trpc.charity.leaderboard.useQuery();
  const impactMetrics = [
    {
      label: "Active Campaigns",
      value: String(charityStats?.activeCampaigns ?? "—"),
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Total Campaigns",
      value: String(charityStats?.totalCampaigns ?? "—"),
      icon: HandHeart,
      color: "text-purple-400",
    },
    {
      label: "SKY444 Intent",
      value: charityStats ? String(Math.round(charityStats.totalRaised)) : "—",
      icon: Coins,
      color: "text-[oklch(0.7_0.2_60)]",
    },
    {
      label: "Intent Contributors",
      value: String(charityStats?.totalDonors ?? "—"),
      icon: Users,
      color: "text-green-400",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══ CINEMATIC CHARITY HERO ═══ */}
      <section
        className="hero-cinematic border-b border-slate-800/60"
        style={{ minHeight: 320 }}
      >
        <div className="glow-orb glow-orb-pink w-96 h-96 -top-20 right-0 animate-hero-float" />
        <div
          className="glow-orb w-64 h-64 bottom-0 left-10 animate-hero-float"
          style={{
            background: "oklch(0.55 0.24 15 / 0.18)",
            animationDelay: "2s",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 mb-6">
              <Heart className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-400 tracking-wide">
                SKYHOPE · CHARITY ENGINEERING BETA
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight text-rainbow">
              <span className="text-white">Charity</span>{" "}
              <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl desc-metallic">
              Explore campaigns, donation-intent flows, impact reporting, and governance previews. Live settlement, nonprofit verification, receipts, and on-chain execution require separate production verification.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/90">
            <strong>Beta boundary:</strong> campaign records and database totals may be exercised in this engineering beta, but the interface does not claim regulated charitable processing, tax-deductible receipts, custody, nonprofit verification, or blockchain settlement.
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {impactMetrics.map((metric, i) => (
              <div
                key={metric.label}
                className="card-epic p-5 text-center animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 bg-white/5">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div
                  className={`text-3xl font-black stat-number ${metric.color} mb-1`}
                >
                  {metric.value}
                </div>
                <div className="text-xs text-slate-500">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="w-full max-w-lg bg-card/80 border border-border/50">
              <TabsTrigger value="campaigns" className="flex-1">
                <HandHeart className="w-4 h-4 mr-1.5" /> Campaigns
              </TabsTrigger>
              <TabsTrigger value="dao" className="flex-1">
                <Vote className="w-4 h-4 mr-1.5" /> DAO Voting
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex-1">
                <Trophy className="w-4 h-4 mr-1.5" /> Leaderboard
              </TabsTrigger>
              <TabsTrigger value="impact" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-1.5" /> Impact
              </TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="p-5 rounded-xl border border-border/50 animate-pulse"
                    >
                      <div className="h-4 bg-muted/20 rounded w-1/3 mb-3" />
                      <div className="h-5 bg-muted/20 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-muted/20 rounded w-full mb-4" />
                      <div className="h-2 bg-muted/20 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((c: any) => {
                    const progress =
                      c.goalAmount > 0
                        ? (Number(c.raisedAmount) / Number(c.goalAmount)) * 100
                        : 0;
                    return (
                      <div
                        key={c.id}
                        className="p-5 rounded-xl border border-border/50 bg-card/80 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[10px]">
                            {c.category}
                          </Badge>
                          <Badge
                            className={`text-[10px] ${c.status === "active" ? "bg-purple-600/10 text-purple-400 border-purple-500/30" : "bg-muted/20 text-muted-foreground"}`}
                          >
                            {c.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                          {c.description}
                        </p>
                        <div className="mb-2">
                          {/* Progress bar with milestone markers */}
                          <div className="relative h-3 bg-background/50 rounded-full overflow-visible border border-border/30 mb-1">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-[oklch(0.72_0.28_160)] rounded-full transition-all"
                              style={{ width: `${Math.min(100, progress)}%` }}
                            />
                            {/* Milestone markers at 25%, 50%, 75% */}
                            {[25, 50, 75].map(pct => (
                              <div
                                key={pct}
                                className="absolute top-0 bottom-0 w-0.5 flex flex-col items-center"
                                style={{ left: `${pct}%` }}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full border-2 mt-0.5 transition-all ${progress >= pct ? "bg-[oklch(0.80_0.18_70)] border-[oklch(0.80_0.18_70)]" : "bg-background border-border/50"}`}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] text-muted-foreground/50 px-1">
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="font-mono text-primary">
                            {Number(c.raisedAmount).toLocaleString()} SKY444
                            recorded as intent
                          </span>
                          <span className="text-muted-foreground">
                            {Math.round(progress)}% intent-to-goal
                          </span>
                        </div>
                        {isAuthenticated ? (
                          <DonateDialog campaign={c} onSuccess={refetch} />
                        ) : (
                          <a href={getLoginUrl()} className="block">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                            >
                              Sign In to Record Intent
                            </Button>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <HandHeart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    No Active Campaigns
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    No registered SkyHope beta campaigns are available yet. Live charitable settlement is not configured.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* DAO Voting Tab */}
            <TabsContent value="dao" className="mt-6">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6 flex items-start gap-3">
                <Vote className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">
                    Governance Preview
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Example proposals demonstrate a future governance experience. Voting, token-weight rules, treasury execution, and fund allocation are not active in this engineering beta.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {DAO_PROPOSALS.map(proposal => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="mt-6">
              <div className="rounded-xl border border-border/50 bg-card/80 p-6">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
                  <div>
                    <h4 className="text-sm font-semibold">Privacy-first contributor reporting</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Public donor rankings are disabled until display-name privacy and explicit leaderboard consent are implemented. Beta donation intents are not charitable receipts or settled donations.
                    </p>
                    <div className="mt-4 rounded-lg border border-border/30 bg-background/40 p-3 text-xs text-muted-foreground">
                      {(donorLeaderboard?.length ?? 0) === 0
                        ? "No public contributor leaderboard is available."
                        : `${donorLeaderboard?.length ?? 0} consented contributor records available.`}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Impact Analytics Tab */}
            <TabsContent value="impact" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Campaign registry",
                    value: String(charityStats?.totalCampaigns ?? "—"),
                    detail: "Database-backed SkyHope campaign records.",
                  },
                  {
                    title: "Donation intent amount",
                    value: charityStats ? `${Math.round(charityStats.totalRaised)} SKY444` : "—",
                    detail: "Intent-only audit records. This is not settled or raised money.",
                  },
                  {
                    title: "Settlement",
                    value: "Not configured",
                    detail: "No custody, token transfer, charitable receipt, or blockchain settlement is claimed.",
                  },
                  {
                    title: "Public leaderboard",
                    value: "Withheld",
                    detail: "Contributor rankings stay private until consent and display-name controls exist.",
                  },
                ].map(item => (
                  <div key={item.title} className="rounded-xl border border-border/50 bg-card/80 p-5">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{item.title}</div>
                    <div className="mt-2 text-2xl font-bold">{item.value}</div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
