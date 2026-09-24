import { describe, expect, it } from "vitest";
import {
  isBetaAccessKeyValid,
  isBetaEmailAllowed,
} from "./auth.router";

describe("beta access authentication helpers", () => {
  it("accepts only the configured access key", () => {
    expect(isBetaAccessKeyValid("correct-key", "correct-key")).toBe(true);
    expect(isBetaAccessKeyValid("wrong-key", "correct-key")).toBe(false);
    expect(isBetaAccessKeyValid("", "correct-key")).toBe(false);
    expect(isBetaAccessKeyValid("correct-key", "")).toBe(false);
  });

  it("allows any email when no allowlist is configured", () => {
    expect(isBetaEmailAllowed("tester@example.com", "")).toBe(true);
  });

  it("matches allowlisted emails case-insensitively", () => {
    expect(
      isBetaEmailAllowed(
        "Tester@Example.com",
        "first@example.com, tester@example.com"
      )
    ).toBe(true);
  });

  it("supports comma, semicolon, and newline separated allowlists", () => {
    const configured =
      "one@example.com;two@example.com\nthree@example.com";
    expect(isBetaEmailAllowed("three@example.com", configured)).toBe(true);
  });

  it("rejects emails outside a configured allowlist", () => {
    expect(
      isBetaEmailAllowed("outsider@example.com", "tester@example.com")
    ).toBe(false);
  });
});
