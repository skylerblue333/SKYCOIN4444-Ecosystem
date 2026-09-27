import { describe, expect, it, vi } from "vitest";
import {
  RedisHealthProbe,
  type RedisClientFactory,
} from "./cache-health";

describe("RedisHealthProbe", () => {
  it("reports an unconfigured cache as a warning instead of a false pass", async () => {
    const factory = vi.fn(() => {
      throw new Error("factory should not be called");
    }) as unknown as RedisClientFactory;

    const probe = new RedisHealthProbe(undefined, factory);
    const result = await probe.check();

    expect(result).toMatchObject({
      status: "warn",
      configured: false,
      provider: "ioredis",
      message: "Redis not configured; distributed cache disabled",
    });
    expect(factory).not.toHaveBeenCalled();
  });

  it("reports pass only after a real PONG and reuses the client", async () => {
    const disconnect = vi.fn();
    const ping = vi.fn().mockResolvedValue("PONG");
    const factory = vi.fn(() => ({ ping, disconnect }));

    const probe = new RedisHealthProbe(
      "redis://cache.example.test:6379",
      factory
    );

    const first = await probe.check();
    const second = await probe.check();

    expect(first.status).toBe("pass");
    expect(first.configured).toBe(true);
    expect(second.status).toBe("pass");
    expect(factory).toHaveBeenCalledTimes(1);
    expect(ping).toHaveBeenCalledTimes(2);

    probe.close();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("fails closed when configured Redis cannot be reached", async () => {
    const disconnect = vi.fn();
    const ping = vi.fn().mockRejectedValue(new Error("connection refused"));
    const factory = vi.fn(() => ({ ping, disconnect }));

    const probe = new RedisHealthProbe(
      "redis://cache.example.test:6379",
      factory
    );

    const result = await probe.check();

    expect(result).toMatchObject({
      status: "fail",
      configured: true,
      provider: "ioredis",
      message: "Redis health check failed",
    });
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("treats a non-PONG response as a failed health check", async () => {
    const factory = vi.fn(() => ({
      ping: vi.fn().mockResolvedValue("unexpected"),
      disconnect: vi.fn(),
    }));

    const probe = new RedisHealthProbe(
      "redis://cache.example.test:6379",
      factory
    );

    const result = await probe.check();

    expect(result.status).toBe("fail");
    expect(result.message).toBe("Redis ping returned an unexpected response");
  });
});
