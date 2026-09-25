import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE_CAPABILITIES } from "@/data/routeCatalog";
import {
  Bot,
  BriefcaseBusiness,
  Coins,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  LayoutGrid,
  MessageCircle,
  Radio,
  Search,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

const primaryAreas = [
  { label: "Home", path: "/", icon: Home },
  { label: "Ecosystem", path: "/ecosystem", icon: LayoutGrid },
  { label: "Social", path: "/socialmedia", icon: Users },
  { label: "Messages", path: "/messages", icon: MessageCircle },
  { label: "Hope AI", path: "/hopeai", icon: Bot },
  { label: "Crypto", path: "/cryptohub", icon: Coins },
  { label: "Gaming", path: "/gaming", icon: Gamepad2 },
  { label: "Learn", path: "/skyschool", icon: GraduationCap },
  { label: "Live", path: "/live", icon: Radio },
  { label: "Shop", path: "/marketplace", icon: ShoppingBag },
  { label: "Dating", path: "/datinghome", icon: Heart },
  { label: "Enterprise", path: "/enterprise", icon: BriefcaseBusiness },
] as const;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(ROUTE_CAPABILITIES.map(capability => capability.category))
      ).sort(),
    ],
    []
  );

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return ROUTE_CAPABILITIES.filter(capability => {
      if (category !== "All" && capability.category !== category) return false;
      if (!needle) return true;
      return normalize(
        `${capability.label} ${capability.route} ${capability.category} ${capability.intent}`
      ).includes(needle);
    });
  }, [category, query]);

  const closeDirectory = () => {
    setOpen(false);
    setQuery("");
    setCategory("All");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#08050f]/95 shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-3 py-2">
          <Link
            href="/"
            className="mr-1 shrink-0 rounded-lg px-2 py-2 font-black tracking-tight text-white hover:bg-white/5"
          >
            SKY4444
          </Link>

          <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none">
            <div className="flex w-max items-center gap-1">
              {primaryAreas.map(area => {
                const Icon = area.icon;
                return (
                  <Link
                    key={area.path}
                    href={area.path}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white sm:text-sm"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {area.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 bg-purple-600 text-white hover:bg-purple-500"
          >
            <LayoutGrid className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">All Screens</span>
            <span className="sm:hidden">All</span>
            <span className="ml-1.5 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-mono">
              {ROUTE_CAPABILITIES.length}
            </span>
          </Button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/80 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0712] shadow-2xl">
            <header className="border-b border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black text-white">
                    All SKYCOIN4444 Screens
                  </h2>
                  <p className="mt-1 text-sm text-white/45">
                    Search every registered route in the current beta build.
                    Internal subcomponents are not presented as standalone pages.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={closeDirectory}
                  className="text-white/60 hover:text-white"
                  aria-label="Close all screens"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_220px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <Input
                    autoFocus
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search wallet, AI, games, analytics, admin..."
                    className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30"
                  />
                </div>
                <select
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  className="h-10 rounded-md border border-white/10 bg-[#120b1d] px-3 text-sm text-white outline-none"
                  aria-label="Filter screen category"
                >
                  {categories.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                <span>
                  Showing {filtered.length} of {ROUTE_CAPABILITIES.length} registered screens
                </span>
                <span>
                  994 page files in source · embedded section files are not standalone routes
                </span>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-sm text-white/45">
                  No registered screen matches that search.
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map(capability => (
                    <Link
                      key={`${capability.route}-${capability.component}`}
                      href={capability.route}
                      onClick={closeDirectory}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-purple-400/40 hover:bg-purple-500/10"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-white">
                          {capability.label}
                        </span>
                        <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/45">
                          {capability.category}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-mono text-[11px] text-purple-300/70">
                        {capability.route}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/40">
                        {capability.intent}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
