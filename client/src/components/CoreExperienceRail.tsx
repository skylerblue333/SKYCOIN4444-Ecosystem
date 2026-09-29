import { Link } from "wouter";
import {
  Bot,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  Radio,
  Users,
} from "lucide-react";
import {
  CORE_EXPERIENCES,
  type CoreExperienceId,
} from "@/data/coreExperiences";

const ICONS = {
  hopeai: Bot,
  skyhope: HeartHandshake,
  social: Users,
  games: Gamepad2,
  learn: GraduationCap,
  messages: MessageCircle,
  live: Radio,
} satisfies Record<CoreExperienceId, typeof Bot>;

export interface CoreExperienceRailProps {
  current?: CoreExperienceId;
  title?: string;
  className?: string;
}

export function CoreExperienceRail({
  current,
  title = "Core paths",
  className = "",
}: CoreExperienceRailProps) {
  return (
    <section
      aria-label="SKYCOIN4444 core experience navigation"
      className={`rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur ${className}`}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
            {title}
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">
            HopeAI and SkyHope stay one tap away from every primary experience.
          </p>
        </div>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold text-amber-200">
          Engineering beta
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CORE_EXPERIENCES.map(experience => {
          const Icon = ICONS[experience.id];
          const isCurrent = experience.id === current;
          const isPriority =
            experience.id === "hopeai" || experience.id === "skyhope";

          return (
            <Link
              key={experience.id}
              href={experience.route}
              aria-current={isCurrent ? "page" : undefined}
              title={experience.description}
              className={`flex min-w-max items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                isCurrent
                  ? "border-purple-400/60 bg-purple-500/20 text-white"
                  : isPriority
                    ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100 hover:bg-fuchsia-500/20"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {experience.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
