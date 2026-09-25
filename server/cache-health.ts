import Redis from "ioredis";
import { performance } from "perf_hooks";

export interface CacheHealthResult {
  status: "pass" | "warn" | "fail";
  responseTime: number;
  message: string;
  lastChecked: Date;
  provider: "ioredis";
  configured: boolean;
}

export interface RedisPingClient {
  ping(): Promise<string>;
  disconnect(): void;
}

export type RedisClientFactory = (url: string) => RedisPingClient;

function createRedisClient(url: string): RedisPingClient {
  return new Redis(url, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 0,
    connectTimeout: 1_000,
  });
}

/**
 * Performs a real Redis PING against the configured cache instead of reporting
 * success from an in-memory placeholder. A missing REDIS_URL is reported as a
 * warning because distributed caching is optional in the current engineering
 * beta; a configured-but-unreachable Redis instance is a failure.
 */
export class RedisHealthProbe {
  private client: RedisPingClient | null = null;

  constructor(
    private readonly url: string | undefined = process.env.REDIS_URL,
    private readonly clientFactory: RedisClientFactory = createRedisClient
  ) {}

  async check(): Promise<CacheHealthResult> {
    const lastChecked = new Date();

    if (!this.url) {
      return {
        status: "warn",
        responseTime: 0,
        message: "Redis not configured; distributed cache disabled",
        lastChecked,
        provider: "ioredis",
        configured: false,
      };
    }

    const startedAt = performance.now();

    try {
      this.client ??= this.clientFactory(this.url);
      const response = await this.client.ping();
      const responseTime = performance.now() - startedAt;

      if (response !== "PONG") {
        return {
          status: "fail",
          responseTime,
          message: "Redis ping returned an unexpected response",
          lastChecked,
          provider: "ioredis",
          configured: true,
        };
      }

      return {
        status: "pass",
        responseTime,
        message: `Redis reachable (${responseTime.toFixed(2)}ms)`,
        lastChecked,
        provider: "ioredis",
        configured: true,
      };
    } catch {
      this.client?.disconnect();
      this.client = null;

      return {
        status: "fail",
        responseTime: performance.now() - startedAt,
        message: "Redis health check failed",
        lastChecked,
        provider: "ioredis",
        configured: true,
      };
    }
  }

  close(): void {
    this.client?.disconnect();
    this.client = null;
  }
}

export const redisHealthProbe = new RedisHealthProbe();
