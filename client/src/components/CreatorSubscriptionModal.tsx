import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap } from "lucide-react";

interface CreatorSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName?: string;
  creatorId?: number;
}

const TIERS = [
  {
    id: "supporter",
    name: "Supporter",
    price: 5,
    icon: Star,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    features: ["Early access to posts", "Supporter badge", "Monthly shoutout"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 15,
    icon: Crown,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    features: [
      "All Supporter perks",
      "Exclusive content",
      "Direct messages",
      "Premium badge",
    ],
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: 50,
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-500/30",
    features: [
      "All Premium perks",
      "1-on-1 calls",
      "Custom content requests",
      "VIP badge",
      "Revenue share",
    ],
  },
];

export function CreatorSubscriptionModal({
  open,
  onOpenChange,
  creatorName = "Creator",
}: CreatorSubscriptionModalProps) {
  const [selected, setSelected] = useState("premium");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Support {creatorName}</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          Creator subscriptions are a product preview in this engineering beta.
          Checkout, recurring billing, and creator payouts are not configured,
          so this screen cannot charge you or activate a paid tier.
        </div>

        <div className="grid gap-3 mt-2">
          {TIERS.map(tier => {
            const Icon = tier.icon;
            const isSelected = selected === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelected(tier.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? `${tier.bg} border-current`
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-2 left-4 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                    Example tier
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${tier.color}`} />
                    <span className="font-semibold">{tier.name}</span>
                  </div>
                  <span className="font-bold text-lg">
                    ${tier.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo concept
                    </span>
                  </span>
                </div>
                <ul className="space-y-1">
                  {tier.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <Check className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <Button className="w-full mt-2" disabled>
          Subscriptions unavailable in engineering beta
        </Button>
      </DialogContent>
    </Dialog>
  );
}
