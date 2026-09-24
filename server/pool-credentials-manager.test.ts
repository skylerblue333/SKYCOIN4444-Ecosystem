import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PoolCredentialsManager } from "./pool-credentials-manager";

const originalKey = process.env.POOL_ENCRYPTION_KEY;

describe("PoolCredentialsManager credential encryption", () => {
  beforeEach(() => {
    delete process.env.POOL_ENCRYPTION_KEY;
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.POOL_ENCRYPTION_KEY;
    } else {
      process.env.POOL_ENCRYPTION_KEY = originalKey;
    }
  });

  it("fails closed when no strong encryption key is configured", () => {
    const manager = new PoolCredentialsManager();

    expect(() =>
      manager.addPoolCredential(
        "test-pool",
        "SKY444",
        "tester",
        "secret-password",
        "pool.example.invalid",
        4444
      )
    ).toThrow(/POOL_ENCRYPTION_KEY/);
  });

  it("encrypts stored credentials and decrypts them only with the configured key", () => {
    process.env.POOL_ENCRYPTION_KEY =
      "ci-pool-encryption-key-0000000000000000000000000000";
    const manager = new PoolCredentialsManager();

    const stored = manager.addPoolCredential(
      "test-pool",
      "SKY444",
      "tester",
      "secret-password",
      "pool.example.invalid",
      4444
    );

    expect(stored.password).toMatch(/^v1:/);
    expect(stored.password).not.toContain("secret-password");
    expect(manager.exportConfiguration()).not.toContain("secret-password");

    const restored = manager.getPoolCredential(stored.id);
    expect(restored?.password).toBe("secret-password");
  });

  it("uses different salts and IVs for identical passwords", () => {
    process.env.POOL_ENCRYPTION_KEY =
      "ci-pool-encryption-key-0000000000000000000000000000";
    const manager = new PoolCredentialsManager();

    const first = manager.addPoolCredential(
      "pool-one",
      "SKY444",
      "tester",
      "same-password",
      "one.example.invalid",
      4444
    );
    const second = manager.addPoolCredential(
      "pool-two",
      "SKY444",
      "tester",
      "same-password",
      "two.example.invalid",
      4445
    );

    expect(first.password).not.toBe(second.password);
  });
});
