import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("core experience integrity", () => {
  it("keeps HopeAI and SkyHope on the primary navigation path", () => {
    const nav = read("client/src/components/Navigation.tsx");
    expect(nav).toContain('path: "/hopeai"');
    expect(nav).toContain('path: "/charity"');
    expect(nav).toContain("useLocation");
    expect(nav).not.toContain('icon: Bot },\\n');
  });

  it("requires explicit opt-in before HopeAI behavior-signal analysis", () => {
    const hope = read("client/src/pages/HopeAI.tsx");
    expect(hope).toContain("behaviorSignalsEnabled");
    expect(hope).toContain("if (behaviorSignalsEnabled)");
    expect(hope).toContain("Signals Off");
    expect(hope).not.toContain("All analysis is local. Never stored or shared.");
  });

  it("does not present SkyHope beta actions as verified settlement", () => {
    const charity = read("client/src/pages/Charity.tsx");
    expect(charity).toContain("SKYHOPE · CHARITY ENGINEERING BETA");
    expect(charity).toContain("Record Beta Donation Intent");
    expect(charity).toContain("Beta boundary:");
    expect(charity).not.toContain("TRANSPARENT GIVING — ON-CHAIN");
  });

  it("removes fabricated social inference and links to the canonical HopeAI route", () => {
    const social = read("client/src/pages/SocialMedia.tsx");
    expect(social).toContain('href="/hopeai"');
    expect(social).toContain("Creator Discovery Preview");
    expect(social).not.toContain("I'm reading your feed signals");
    expect(social).not.toContain('href="/hope-ai"');
  });

  it("connects SkySchool to quiz, HopeAI, community, and SkyHope", () => {
    const school = read("client/src/pages/SkySchool.tsx");
    expect(school).toContain('href: "/quiz"');
    expect(school).toContain('href: "/hopeai"');
    expect(school).toContain('href: "/socialmedia"');
    expect(school).toContain('href: "/charity"');
  });
});
