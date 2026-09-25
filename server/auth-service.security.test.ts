import { afterEach, describe, expect, it, vi } from "vitest";
import {
  changePassword,
  createToken,
  hashPassword,
  requestPasswordReset,
  resetPassword,
  signin,
  signup,
  verifyPassword,
  verifyToken,
} from "./auth-service";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("legacy password auth hardening", () => {
  it("uses salted scrypt hashes and timing-safe verification", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");

    expect(first).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(second).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(first).not.toBe(second);
    await expect(
      verifyPassword("correct horse battery staple", first)
    ).resolves.toBe(true);
    await expect(verifyPassword("wrong password", first)).resolves.toBe(false);
  });

  it("rejects legacy SHA-256 and malformed password hashes", async () => {
    await expect(
      verifyPassword(
        "password",
        "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
      )
    ).resolves.toBe(false);
    await expect(verifyPassword("password", "not-a-hash")).resolves.toBe(false);
  });

  it("does not mint JWTs from a missing or weak fallback secret", async () => {
    vi.stubEnv("JWT_SECRET", "");
    await expect(createToken(1, "user@example.test")).rejects.toThrow(
      /JWT_SECRET/
    );

    vi.stubEnv("JWT_SECRET", "too-short");
    await expect(createToken(1, "user@example.test")).rejects.toThrow(
      /JWT_SECRET/
    );
  });

  it("creates and verifies a JWT only with explicit strong configuration", async () => {
    vi.stubEnv(
      "JWT_SECRET",
      "test-only-secret-that-is-long-enough-for-hs256-4444"
    );

    const token = await createToken(42, "user@example.test");
    await expect(verifyToken(token)).resolves.toEqual({
      userId: 42,
      email: "user@example.test",
    });
  });

  it("fails closed for unconfigured password account workflows", async () => {
    await expect(
      signup({
        email: "new@example.test",
        password: "StrongPassword123!",
        name: "New User",
      })
    ).resolves.toBeNull();

    await expect(
      signin({
        email: "any@example.test",
        password: "anything-at-all",
      })
    ).resolves.toBeNull();

    await expect(
      changePassword(1, "old-password", "new-password")
    ).resolves.toBe(false);

    await expect(
      requestPasswordReset("user@example.test")
    ).resolves.toBeNull();

    await expect(
      resetPassword("fake-token", "new-password")
    ).resolves.toBe(false);
  });
});
