import { afterEach, describe, expect, it, vi } from "vitest";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
  vi.resetModules();
});

describe("database configuration boundary", () => {
  it("does not crash the process when DATABASE_URL is absent", async () => {
    delete process.env.DATABASE_URL;
    vi.resetModules();

    const databaseModule = await import("./db");

    await expect(databaseModule.getDb()).rejects.toThrow(
      "DATABASE_URL is not configured"
    );
    expect(() => (databaseModule.db as any).select()).toThrow(
      "DATABASE_URL is not configured"
    );
  });
});
