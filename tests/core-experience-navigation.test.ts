import { describe, expect, it } from "vitest";
import {
  CORE_EXPERIENCES,
  getCoreExperience,
} from "../client/src/data/coreExperiences";

describe("core experience navigation contract", () => {
  it("keeps HopeAI and SkyHope as the first two priority paths", () => {
    expect(CORE_EXPERIENCES[0]).toMatchObject({
      id: "hopeai",
      route: "/hopeai",
    });
    expect(CORE_EXPERIENCES[1]).toMatchObject({
      id: "skyhope",
      route: "/charity",
    });
  });

  it("covers the primary social, games, education, messaging and live paths", () => {
    expect(CORE_EXPERIENCES.map(item => item.id)).toEqual(
      expect.arrayContaining([
        "social",
        "games",
        "learn",
        "messages",
        "live",
      ])
    );
  });

  it("uses unique absolute routes and truthful beta stage labels", () => {
    const routes = CORE_EXPERIENCES.map(item => item.route);
    expect(new Set(routes).size).toBe(routes.length);

    for (const experience of CORE_EXPERIENCES) {
      expect(experience.route.startsWith("/")).toBe(true);
      expect(experience.stage).toBe("engineering-beta");
    }
  });

  it("resolves known experiences without inventing unsupported entries", () => {
    expect(getCoreExperience("hopeai")?.label).toBe("HopeAI");
    expect(getCoreExperience("skyhope")?.label).toBe("SkyHope");
  });
});
