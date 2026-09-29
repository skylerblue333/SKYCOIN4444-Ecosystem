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
    expect(charity).toContain("Record Donation Intent");
    expect(charity).toContain("Beta boundary:");
    expect(charity).not.toContain("TRANSPARENT GIVING — ON-CHAIN");
    expect(charity).not.toContain("On-Chain Verified");
    expect(charity).not.toContain("All charity fund flows are publicly auditable on-chain.");
    expect(charity).toContain("Intent Contributors");
  });

  it("backs SkyHope with a durable intent-only router rather than the placeholder namespace", () => {
    const routers = read("server/routers.ts");
    const db = read("server/db.ts");
    expect(routers).toContain("export const charityRouter = router");
    expect(routers).toContain("charity: charityRouter");
    expect(routers).not.toContain("charity: placeholderRouter");
    expect(db).toContain('CHARITY_INTENT_PREFIX = "charity_intent:"');
    expect(db).toContain('status: "intent_only"');
    expect(db).toContain("settlement: false");
    expect(db).toContain("receipt: false");
    expect(db).toContain("txHash: null");
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
