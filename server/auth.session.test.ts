import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL = {
  JWT_SECRET: process.env.JWT_SECRET,
  VITE_APP_ID: process.env.VITE_APP_ID,
  DATABASE_URL: process.env.DATABASE_URL,
};

async function loadSdk(secret?: string) {
  vi.resetModules();
  if (secret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = secret;
  process.env.VITE_APP_ID = "skycoin4444-test-app";
  process.env.DATABASE_URL =
    process.env.DATABASE_URL || "mysql://root:root@127.0.0.1:3306/skycoin";
  return (await import("./_core/sdk")).sdk;
}

afterEach(() => {
  vi.resetModules();
  for (const [key, value] of Object.entries(ORIGINAL)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("signed session persistence contract", () => {
  it("round-trips a signed session even when display name is empty", async () => {
    const sdk = await loadSdk("s".repeat(48));
    const token = await sdk.createSessionToken("user-open-id", { name: "" });

    await expect(sdk.verifySession(token)).resolves.toEqual({
      openId: "user-open-id",
      appId: "skycoin4444-test-app",
      name: "",
    });
  });

  it("rejects tampered session tokens", async () => {
    const sdk = await loadSdk("s".repeat(48));
    const token = await sdk.createSessionToken("user-open-id", {
      name: "Beta User",
    });
    const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");

    await expect(sdk.verifySession(tampered)).resolves.toBeNull();
  });

  it("fails closed when the signing secret is missing", async () => {
    const sdk = await loadSdk(undefined);

    await expect(
      sdk.createSessionToken("user-open-id", { name: "Beta User" })
    ).rejects.toThrow(/JWT_SECRET must be configured/);
  });

  it("fails closed when the signing secret is too short", async () => {
    const sdk = await loadSdk("short-secret");

    await expect(
      sdk.createSessionToken("user-open-id", { name: "Beta User" })
    ).rejects.toThrow(/at least 32 characters/);
  });
});
