import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("gaming beta integrity", () => {
  it("keeps the focused five-game beta catalog visible", () => {
    const lobby = read("client/src/pages/GameLobby.tsx");
    for (const route of [
      "/games/crash",
      "/games/blackjack",
      "/games/roulette",
      "/games/plinko",
      "/games/high-low",
    ]) {
      expect(lobby).toContain(route);
    }
    expect(lobby).toContain("Demo-first economy");
    expect(lobby).toContain("Beta integrity:");
  });

  it("never presents the client-side Crash simulation as provably fair", () => {
    const crash = read("client/src/pages/GameCrash.tsx");
    expect(crash).toContain("Math.random()");
    expect(crash).toContain("Demo simulation only");
    expect(crash).toContain("not cryptographically verifiable");
    expect(crash).toContain("not real-money settlement");
    expect(crash).not.toContain("Provably fair game");
  });
});
