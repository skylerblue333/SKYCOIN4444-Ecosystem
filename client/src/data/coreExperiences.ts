export type CoreExperienceId =
  | "hopeai"
  | "skyhope"
  | "social"
  | "games"
  | "learn"
  | "messages"
  | "live";

export type CoreExperienceStage = "engineering-beta";

export interface CoreExperience {
  id: CoreExperienceId;
  label: string;
  route: string;
  description: string;
  stage: CoreExperienceStage;
}

export const CORE_EXPERIENCES: readonly CoreExperience[] = [
  {
    id: "hopeai",
    label: "HopeAI",
    route: "/hopeai",
    description: "Ask for help, tutoring, planning, and guided next actions.",
    stage: "engineering-beta",
  },
  {
    id: "skyhope",
    label: "SkyHope",
    route: "/charity",
    description: "Explore charity and impact workflows with explicit beta boundaries.",
    stage: "engineering-beta",
  },
  {
    id: "social",
    label: "Social",
    route: "/socialmedia",
    description: "Publish, discuss, and discover community activity.",
    stage: "engineering-beta",
  },
  {
    id: "games",
    label: "Games",
    route: "/gaming",
    description: "Play supported beta games and review game readiness.",
    stage: "engineering-beta",
  },
  {
    id: "learn",
    label: "Learn",
    route: "/skyschool",
    description: "Study courses, practice quizzes, and use HopeAI as a tutor.",
    stage: "engineering-beta",
  },
  {
    id: "messages",
    label: "Messages",
    route: "/messages",
    description: "Continue conversations in the messaging workspace.",
    stage: "engineering-beta",
  },
  {
    id: "live",
    label: "Live",
    route: "/live",
    description: "Explore supported live and creator experiences.",
    stage: "engineering-beta",
  },
] as const;

export function getCoreExperience(id: CoreExperienceId) {
  return CORE_EXPERIENCES.find(experience => experience.id === id);
}
