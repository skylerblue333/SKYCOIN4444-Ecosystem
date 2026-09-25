/**
 * Global capability navigator.
 * Searches every registered route, remembers recent destinations, and lets
 * customers pin the workflows they use most.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Search,
  ArrowRight,
  Star,
  Clock3,
  Sparkles,
  Users,
  Coins,
  Wrench,
  GraduationCap,
  Bot,
  Command,
  X,
} from "lucide-react";
import { ROUTE_CAPABILITIES, type RouteCapability } from "@/data/routeCatalog";

const RECENT_KEY = "skycoin4444.recent-capabilities";
const FAVORITES_KEY = "skycoin4444.favorite-capabilities";
const MAX_RECENT = 8;
const MAX_RESULTS = 80;

const CATEGORY_COLORS: Record<string, string> = {
  AI: "text-fuchsia-300",
  Community: "text-cyan-300",
  "Money & Web3": "text-amber-300",
  "Build & Admin": "text-blue-300",
  "Learn & Play": "text-emerald-300",
  "Tools & Utilities": "text-violet-300",
  Explore: "text-slate-300",
};

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  AI: Bot,
  Community: Users,
  "Money & Web3": Coins,
  "Build & Admin": Wrench,
  "Learn & Play": GraduationCap,
  "Tools & Utilities": Wrench,
  Explore: Sparkles,
};

function readList(key: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function rankCapability(capability: RouteCapability, query: string, recent: string[], favorites: string[]) {
  if (!query.trim()) {
    return (favorites.includes(capability.route) ? 1000 : 0) + (recent.indexOf(capability.route) >= 0 ? 500 - recent.indexOf(capability.route) : 0);
  }
  const needle = query.trim().toLowerCase();
  const haystack = `${capability.label} ${capability.route} ${capability.category} ${capability.intent}`.toLowerCase();
  if (!haystack.includes(needle)) return -1;
  let score = 1;
  if (capability.label.toLowerCase().startsWith(needle)) score += 100;
  if (capability.label.toLowerCase().includes(needle)) score += 40;
  if (capability.category.toLowerCase().includes(needle)) score += 25;
  if (capability.route.includes(needle.replace(/\s+/g, "-"))) score += 20;
  if (favorites.includes(capability.route)) score += 15;
  return score;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ROUTE_CAPABILITIES.map(item => item.category))).sort()],
    []
  );

  const results = useMemo(() => {
    const ranked = ROUTE_CAPABILITIES
      .filter(item => activeCategory === "All" || item.category === activeCategory)
      .map(item => ({ item, score: rankCapability(item, query, recent, favorites) }))
      .filter(result => result.score >= 0)
      .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label));
    return ranked.slice(0, MAX_RESULTS).map(result => result.item);
  }, [activeCategory, favorites, query, recent]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    setActiveCategory("All");
    setRecent(readList(RECENT_KEY));
    setFavorites(readList(FAVORITES_KEY));
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setSelected(index => Math.min(index, Math.max(results.length - 1, 0)));
  }, [results.length]);

  const toggleFavorite = useCallback((route: string) => {
    setFavorites(current => {
      const next = current.includes(route)
        ? current.filter(item => item !== route)
        : [route, ...current].slice(0, 40);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const execute = useCallback((capability: RouteCapability) => {
    setRecent(current => {
      const next = [capability.route, ...current.filter(item => item !== capability.route)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
    navigate(capability.route);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected(index => Math.min(index + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected(index => Math.max(index - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (results[selected]) execute(results[selected]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [execute, onClose, open, results, selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 px-4 pt-[7vh] backdrop-blur-sm" role="presentation">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close capability navigator" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="capability-navigator-title"
        className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Command className="h-4 w-4 text-purple-300" aria-hidden="true" />
          <div className="sr-only" id="capability-navigator-title">Capability navigator</div>
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={event => { setQuery(event.target.value); setSelected(0); }}
            placeholder="What do you want to do? Search 969 capabilities..."
            aria-label="Search capabilities"
            className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-white/10 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-2 scrollbar-none" role="tablist" aria-label="Capability categories">
          {categories.map(category => (
            <button
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => { setActiveCategory(category); setSelected(0); }}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs transition ${activeCategory === category ? "bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40" : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-xs text-white/45">
          <span>{query ? `Results for “${query}”` : "Start with a goal, feature, or category"}</span>
          <span>{results.length} of {ROUTE_CAPABILITIES.length} capabilities</span>
        </div>

        <div className="min-h-0 overflow-y-auto px-2 pb-2" role="listbox" aria-label="Capability results">
          {results.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No matching capability. Try a broader goal such as “wallet”, “create”, “learn”, or “analytics”.</div>
          ) : results.map((capability, index) => {
            const Icon = CATEGORY_ICONS[capability.category] || Sparkles;
            const isRecent = recent.includes(capability.route);
            const isFavorite = favorites.includes(capability.route);
            return (
              <div
                key={`${capability.route}-${capability.component}`}
                role="option"
                aria-selected={index === selected}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${index === selected ? "bg-white/10" : "hover:bg-white/5"}`}
                onMouseEnter={() => setSelected(index)}
              >
                <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => execute(capability)}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${index === selected ? "bg-purple-500/20" : "bg-white/5"}`}>
                    <Icon className={`h-4 w-4 ${index === selected ? "text-purple-200" : "text-white/55"}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-white">{capability.label}</span>
                      {isRecent && <Clock3 className="h-3 w-3 shrink-0 text-white/35" aria-label="Recently used" />}
                    </div>
                    <div className="truncate text-xs text-white/45">{capability.intent} · <span className={CATEGORY_COLORS[capability.category]}>{capability.category}</span></div>
                  </div>
                  {index === selected && <ArrowRight className="h-4 w-4 shrink-0 text-purple-300" aria-hidden="true" />}
                </button>
                <button onClick={() => toggleFavorite(capability.route)} className="rounded-md p-1.5 text-white/35 opacity-0 transition hover:bg-white/10 hover:text-amber-300 group-hover:opacity-100 focus:opacity-100" aria-label={`${isFavorite ? "Remove" : "Add"} ${capability.label} ${isFavorite ? "from" : "to"} favorites`}>
                  <Star className={`h-4 w-4 ${isFavorite ? "fill-amber-300 text-amber-300" : ""}`} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3"><span><kbd className="rounded border border-white/10 bg-white/5 px-1">↑↓</kbd> navigate</span><span><kbd className="rounded border border-white/10 bg-white/5 px-1">↵</kbd> open</span><span><kbd className="rounded border border-white/10 bg-white/5 px-1">Esc</kbd> close</span></div>
          <span>Star a capability to pin it for your next visit</span>
        </div>
      </section>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(current => !current);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return { open, setOpen };
}
