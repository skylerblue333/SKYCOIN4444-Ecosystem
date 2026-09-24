import { scryptSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  betaAccessKeyIssue,
  betaAccessOpenId,
  betaAuthMode,
  normalizeBetaEmail,
  verifyBetaAccessKey,
} from "./_core/betaAccessAuth";
import { evaluateBetaAdmission } from "./_core/betaAdmission";

const strongKey = "A".repeat(48);

describe("beta access authentication", () => {
  it("requires explicit access-key mode", () => {
    expect(betaAuthMode({} as NodeJS.ProcessEnv)).toBe("oauth");
    expect(
      betaAuthMode({
        VITE_BETA_AUTH_MODE: "access_key",
      } as NodeJS.ProcessEnv)
    ).toBe("access_key");
  });

  it("requires a strong access key when no scrypt credential is present", () => {
    expect(
      betaAccessKeyIssue({
        VITE_BETA_AUTH_MODE: "access_key",
        BETA_ACCESS_KEY: "short",
      } as NodeJS.ProcessEnv)
    ).toMatch(/48 bytes/);

    expect(
      betaAccessKeyIssue({
        VITE_BETA_AUTH_MODE: "access_key",
        BETA_ACCESS_KEY: strongKey,
      } as NodeJS.ProcessEnv)
    ).toBeNull();
  });

  it("verifies a scrypt-backed beta credential", () => {
    const salt = Buffer.from("00112233445566778899aabbccddeeff", "hex");
    const password = "beta-password";
    const credential =
      salt.toString("hex") +
      ":" +
      scryptSync(password, salt, 32).toString("hex");
    const env = {
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_PASSWORD_SCRYPT: credential,
    } as NodeJS.ProcessEnv;

    expect(betaAccessKeyIssue(env)).toBeNull();
    expect(verifyBetaAccessKey(password, env)).toBe(true);
    expect(verifyBetaAccessKey("wrong-password", env)).toBe(false);
  });

  it("normalizes email and derives an opaque stable beta identity", () => {
    expect(normalizeBetaEmail(" Tester@Example.COM ")).toBe(
      "tester@example.com"
    );
    const first = betaAccessOpenId("tester@example.com");
    const second = betaAccessOpenId("Tester@Example.com");
    expect(first).toBe(second);
    expect(first).toMatch(/^beta_email_[a-f0-9]{40}$/);
    expect(first).not.toContain("tester");
  });

  it("requires invite admission in production", () => {
    const identity = {
      openId: betaAccessOpenId("tester@example.com"),
      email: "tester@example.com",
    };
    expect(
      evaluateBetaAdmission(identity, {
        NODE_ENV: "production",
        BETA_ACCESS_MODE: "invite_only",
        BETA_ALLOWED_EMAILS: "tester@example.com",
      } as NodeJS.ProcessEnv).allowed
    ).toBe(true);
    expect(
      evaluateBetaAdmission(identity, {
        NODE_ENV: "production",
        BETA_ACCESS_MODE: "invite_only",
        BETA_ALLOWED_EMAILS: "someone-else@example.com",
      } as NodeJS.ProcessEnv).allowed
    ).toBe(false);
  });
});
