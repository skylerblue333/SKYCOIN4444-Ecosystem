import { Link } from "wouter";
import { TrendingUp, Hash, Flame } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function TrendingHashtags() {
  const { data: trends } = trpc.feed.trending.useQuery(undefined, {
    staleTime: 60_000,
  });

  const items = (trends ?? []).slice(0, 8);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Trending Now</h3>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">
            No hashtag activity has been recorded yet.
          </p>
        ) : items.map((item, i) => (
          <Link
            key={item.hashtag}
            href={`/search?q=${encodeURIComponent(item.hashtag)}`}
          >
            <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2">
                {i < 3 ? (
                  <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                ) : (
                  <Hash className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                )}
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {item.hashtag}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {item.mentions.toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/search">
        <div className="mt-3 text-xs text-primary hover:underline cursor-pointer text-center">
          View all trends →
        </div>
      </Link>
    </div>
  );
}
