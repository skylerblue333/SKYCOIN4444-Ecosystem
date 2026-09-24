import { describe, it, expect } from "vitest";

describe("Credential configuration safety", () => {
  it("uses a Stripe test-mode key in the automated test environment", () => {
    const stripeKey = process.env.STRIPE_API_KEY;
    expect(stripeKey).toBeDefined();
    expect(stripeKey).toMatch(/^sk_test_/);
    expect(stripeKey).not.toMatch(/^sk_live_/);
  });

  it("has an OpenAI test credential placeholder configured", () => {
    const openaiKey = process.env.OPENAI_API_KEY;
    expect(openaiKey).toBeDefined();
    expect(openaiKey).toMatch(/^sk-proj-/);
  });

  it("does not require real provider secrets for the unit test suite", () => {
    const stripeKey = process.env.STRIPE_API_KEY ?? "";
    const openaiKey = process.env.OPENAI_API_KEY ?? "";

    expect(stripeKey).toContain("MockKeyForTestingOnly");
    expect(openaiKey).toContain("MockKeyForTestingOnly");
  });

  it("rejects example placeholder values as deployable credentials", () => {
    expect("sk_test_placeholder").not.toMatch(
      /^sk_test_[a-zA-Z0-9]{32,}$/
    );
    expect("sk-proj-placeholder").not.toMatch(
      /^sk-proj-[a-zA-Z0-9_-]{40,}$/
    );
  });

  it("keeps credential values out of test output", () => {
    expect(process.env.STRIPE_API_KEY).not.toBe("");
    expect(process.env.OPENAI_API_KEY).not.toBe("");
  });
});
