import { createHash, randomBytes } from "node:crypto";
import IORedis from "ioredis";
import { Queue } from "bullmq";
import {
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type IntegrationId =
  | "valkey"
  | "bullmq"
  | "s3"
  | "opensearch"
  | "qdrant"
  | "clickhouse"
  | "prometheus"
  | "opentelemetry"
  | "fluentbit"
  | "flagsmith"
  | "keycloak"
  | "kong";

export type IntegrationHealthStatus =
  | "ready"
  | "degraded"
  | "not_configured";

export interface IntegrationDescriptor {
  id: IntegrationId;
  product: string;
  upstream: string;
  license: string;
  role: string;
  capabilities: readonly string[];
}

export interface IntegrationHealth {
  id: IntegrationId;
  status: IntegrationHealthStatus;
  latencyMs: number;
  detail: string;
}

export interface EnterpriseIntegrationConfig {
  redisUrl?: string;
  queuePrefix: string;
  s3: {
    endpoint?: string;
    region?: string;
    bucket?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  openSearch: {
    url?: string;
    apiKey?: string;
    username?: string;
    password?: string;
  };
  qdrant: {
    url?: string;
    apiKey?: string;
    collection?: string;
  };
  clickHouse: {
    url?: string;
    username?: string;
    password?: string;
    database?: string;
  };
  otelHttpEndpoint?: string;
  fluentBitHttpEndpoint?: string;
  flagsmith: {
    url?: string;
    environmentKey?: string;
  };
  keycloak: {
    issuer?: string;
    audience?: string;
  };
  kong: {
    adminUrl?: string;
    adminToken?: string;
  };
}

type RedisLike = {
  ping(): Promise<unknown>;
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    mode?: "EX",
    ttlSeconds?: number
  ): Promise<unknown>;
  del(key: string): Promise<number>;
  quit(): Promise<unknown>;
};

type QueueCountType =
  | "waiting"
  | "active"
  | "failed"
  | "completed"
  | "delayed"
  | "paused"
  | "prioritized"
  | "waiting-children";

type QueueLike = {
  add(
    name: string,
    data: unknown,
    options?: { jobId?: string }
  ): Promise<{ id?: string | number | null }>;
  getJobCounts(...types: QueueCountType[]): Promise<Record<string, number>>;
  close(): Promise<void>;
};

type S3Like = {
  send(command: unknown): Promise<unknown>;
  destroy?: () => void;
};

type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit
) => Promise<Response>;

export interface EnterpriseIntegrationDependencies {
  fetchImpl?: FetchLike;
  redisFactory?: (url: string) => RedisLike;
  queueFactory?: (name: string, url: string, prefix: string) => QueueLike;
  s3Factory?: (config: EnterpriseIntegrationConfig["s3"]) => S3Like;
  now?: () => number;
}

const CATALOG: readonly IntegrationDescriptor[] = [
  {
    id: "valkey",
    product: "Valkey",
    upstream: "https://github.com/valkey-io/valkey",
    license: "BSD-3-Clause",
    role: "distributed cache and ephemeral coordination",
    capabilities: ["cache get/set/delete", "TTL", "health ping"],
  },
  {
    id: "bullmq",
    product: "BullMQ",
    upstream: "https://github.com/taskforcesh/bullmq",
    license: "MIT",
    role: "durable Redis/Valkey-backed background job queue",
    capabilities: ["enqueue", "idempotency key", "queue depth health"],
  },
  {
    id: "s3",
    product: "SeaweedFS / S3-compatible storage",
    upstream: "https://github.com/seaweedfs/seaweedfs",
    license: "Apache-2.0",
    role: "object storage through the S3 protocol",
    capabilities: ["bucket health", "put object"],
  },
  {
    id: "opensearch",
    product: "OpenSearch",
    upstream: "https://github.com/opensearch-project/OpenSearch",
    license: "Apache-2.0",
    role: "full-text and structured search",
    capabilities: ["cluster health", "index document", "search"],
  },
  {
    id: "qdrant",
    product: "Qdrant",
    upstream: "https://github.com/qdrant/qdrant",
    license: "Apache-2.0",
    role: "vector search for AI retrieval",
    capabilities: ["readiness", "vector upsert", "nearest-neighbor query"],
  },
  {
    id: "clickhouse",
    product: "ClickHouse",
    upstream: "https://github.com/ClickHouse/ClickHouse",
    license: "Apache-2.0",
    role: "analytics and event-query engine",
    capabilities: ["readiness query", "read-only SQL analytics"],
  },
  {
    id: "prometheus",
    product: "Prometheus exposition",
    upstream: "https://github.com/prometheus/prometheus",
    license: "Apache-2.0",
    role: "metrics export",
    capabilities: ["counter/gauge recording", "Prometheus text exposition"],
  },
  {
    id: "opentelemetry",
    product: "OpenTelemetry",
    upstream: "https://github.com/open-telemetry/opentelemetry-js",
    license: "Apache-2.0",
    role: "vendor-neutral trace export",
    capabilities: ["OTLP/HTTP JSON trace export", "health probe span"],
  },
  {
    id: "fluentbit",
    product: "Fluent Bit",
    upstream: "https://github.com/fluent/fluent-bit",
    license: "Apache-2.0",
    role: "structured log pipeline",
    capabilities: ["HTTP structured log push", "health probe event"],
  },
  {
    id: "flagsmith",
    product: "Flagsmith",
    upstream: "https://github.com/Flagsmith/flagsmith",
    license: "BSD-3-Clause",
    role: "feature flag control plane",
    capabilities: ["environment flag fetch", "flag evaluation"],
  },
  {
    id: "keycloak",
    product: "Keycloak",
    upstream: "https://github.com/keycloak/keycloak",
    license: "Apache-2.0",
    role: "OIDC identity federation bridge",
    capabilities: ["OIDC discovery", "issuer/JWKS metadata"],
  },
  {
    id: "kong",
    product: "Kong Gateway",
    upstream: "https://github.com/Kong/kong",
    license: "Apache-2.0",
    role: "API gateway inventory and health",
    capabilities: ["gateway status", "service inventory"],
  },
];

const normalize = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const requireHttpUrl = (value: string, name: string): string => {
  const parsed = new URL(value);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${name} must use http or https`);
  }
  return value.replace(/\/+$/, "");
};

const pathUrl = (base: string, path: string): string => {
  const safeBase = requireHttpUrl(base, "integration URL");
  return new URL(path.replace(/^\/+/, ""), `${safeBase}/`).toString();
};

const assertSimpleName = (value: string, label: string): string => {
  if (!/^[A-Za-z0-9._-]{1,128}$/.test(value)) {
    throw new Error(`${label} contains unsupported characters`);
  }
  return value;
};

const assertObjectKey = (value: string): string => {
  if (
    value.length < 1 ||
    value.length > 512 ||
    !/^[A-Za-z0-9!_.*'()\/-]+$/.test(value) ||
    value.includes("..")
  ) {
    throw new Error("object key is invalid");
  }
  return value;
};

const basicAuthorization = (
  username: string | undefined,
  password: string | undefined
): string | undefined => {
  if (!username) return undefined;
  return `Basic ${Buffer.from(`${username}:${password ?? ""}`).toString("base64")}`;
};

const withTimeout = async <T>(
  timeoutMs: number,
  action: (signal: AbortSignal) => Promise<T>
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await action(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

const readTextResponse = async (
  response: Response,
  maxBytes = 2_000_000
): Promise<string> => {
  const text = await response.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    throw new Error("integration response exceeded size limit");
  }
  return text;
};

const fetchJson = async (
  fetchImpl: FetchLike,
  url: string,
  init: RequestInit = {},
  timeoutMs = 5_000
): Promise<unknown> =>
  withTimeout(timeoutMs, async signal => {
    const response = await fetchImpl(url, { ...init, signal });
    const text = await readTextResponse(response);
    if (!response.ok) {
      throw new Error(
        `integration request failed (${response.status}): ${text.slice(0, 300)}`
      );
    }
    if (!text.trim()) return null;
    return JSON.parse(text) as unknown;
  });

const fetchText = async (
  fetchImpl: FetchLike,
  url: string,
  init: RequestInit = {},
  timeoutMs = 5_000
): Promise<string> =>
  withTimeout(timeoutMs, async signal => {
    const response = await fetchImpl(url, { ...init, signal });
    const text = await readTextResponse(response);
    if (!response.ok) {
      throw new Error(
        `integration request failed (${response.status}): ${text.slice(0, 300)}`
      );
    }
    return text;
  });

const objectRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("integration returned an unexpected payload");
  }
  return value as Record<string, unknown>;
};

const defaultRedisFactory = (url: string): RedisLike => {
  const client = new IORedis(url, {
    connectTimeout: 3_000,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  return {
    ping: () => client.ping(),
    get: key => client.get(key),
    set: async (key, value, mode, ttlSeconds) => {
      if (mode === "EX" && typeof ttlSeconds === "number") {
        await client.set(key, value, "EX", ttlSeconds);
        return;
      }
      await client.set(key, value);
    },
    del: key => client.del(key),
    quit: () => client.quit(),
  };
};

const bullConnectionFromUrl = (rawUrl: string) => {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "redis:" && parsed.protocol !== "rediss:") {
    throw new Error("Redis URL must use redis or rediss");
  }

  const databaseText = parsed.pathname.replace(/^\//, "");
  const database = databaseText ? Number.parseInt(databaseText, 10) : 0;
  if (!Number.isSafeInteger(database) || database < 0) {
    throw new Error("Redis URL contains an invalid database index");
  }

  return {
    host: parsed.hostname,
    port: parsed.port ? Number.parseInt(parsed.port, 10) : 6379,
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    db: database,
    maxRetriesPerRequest: null,
    ...(parsed.protocol === "rediss:" ? { tls: {} } : {}),
  };
};

const defaultQueueFactory = (
  name: string,
  url: string,
  prefix: string
): QueueLike => {
  // Pass connection options instead of an ioredis instance. BullMQ can carry
  // a different transitive ioredis patch version, so sharing a concrete Redis
  // class instance creates an unnecessary TypeScript/runtime coupling.
  const queue = new Queue(name, {
    connection: bullConnectionFromUrl(url),
    prefix,
  });
  return {
    add: (jobName, data, options) => queue.add(jobName, data, options),
    getJobCounts: (...types) => queue.getJobCounts(...types),
    close: () => queue.close(),
  };
};

const defaultS3Factory = (
  config: EnterpriseIntegrationConfig["s3"]
): S3Like => {
  const credentials =
    config.accessKeyId && config.secretAccessKey
      ? {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        }
      : undefined;

  return new S3Client({
    region: config.region ?? "us-east-1",
    endpoint: config.endpoint,
    forcePathStyle: Boolean(config.endpoint),
    credentials,
  });
};

export const enterpriseIntegrationConfigFromEnv = (
  env: NodeJS.ProcessEnv = process.env
): EnterpriseIntegrationConfig => ({
  redisUrl: normalize(env.SKY_REDIS_URL) ?? normalize(env.REDIS_URL),
  queuePrefix: normalize(env.SKY_QUEUE_PREFIX) ?? "skycoin4444",
  s3: {
    endpoint: normalize(env.SKY_S3_ENDPOINT),
    region: normalize(env.SKY_S3_REGION),
    bucket: normalize(env.SKY_S3_BUCKET),
    accessKeyId: normalize(env.SKY_S3_ACCESS_KEY_ID),
    secretAccessKey: normalize(env.SKY_S3_SECRET_ACCESS_KEY),
  },
  openSearch: {
    url: normalize(env.SKY_OPENSEARCH_URL),
    apiKey: normalize(env.SKY_OPENSEARCH_API_KEY),
    username: normalize(env.SKY_OPENSEARCH_USERNAME),
    password: normalize(env.SKY_OPENSEARCH_PASSWORD),
  },
  qdrant: {
    url: normalize(env.SKY_QDRANT_URL),
    apiKey: normalize(env.SKY_QDRANT_API_KEY),
    collection: normalize(env.SKY_QDRANT_COLLECTION),
  },
  clickHouse: {
    url: normalize(env.SKY_CLICKHOUSE_URL),
    username: normalize(env.SKY_CLICKHOUSE_USERNAME),
    password: normalize(env.SKY_CLICKHOUSE_PASSWORD),
    database: normalize(env.SKY_CLICKHOUSE_DATABASE),
  },
  otelHttpEndpoint: normalize(env.SKY_OTEL_HTTP_ENDPOINT),
  fluentBitHttpEndpoint: normalize(env.SKY_FLUENTBIT_HTTP_ENDPOINT),
  flagsmith: {
    url: normalize(env.SKY_FLAGSMITH_URL),
    environmentKey: normalize(env.SKY_FLAGSMITH_ENVIRONMENT_KEY),
  },
  keycloak: {
    issuer: normalize(env.SKY_KEYCLOAK_ISSUER),
    audience: normalize(env.SKY_KEYCLOAK_AUDIENCE),
  },
  kong: {
    adminUrl: normalize(env.SKY_KONG_ADMIN_URL),
    adminToken: normalize(env.SKY_KONG_ADMIN_TOKEN),
  },
});

type MetricKind = "counter" | "gauge";

type MetricSample = {
  name: string;
  kind: MetricKind;
  value: number;
  labels: Record<string, string>;
  help?: string;
};

const metricKey = (
  name: string,
  labels: Record<string, string>
): string =>
  `${name}|${Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join(",")}`;

const escapeMetricLabel = (value: string): string =>
  value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

const renderLabels = (labels: Record<string, string>): string => {
  const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return "";
  return `{${entries
    .map(([key, value]) => `${key}="${escapeMetricLabel(value)}"`)
    .join(",")}}`;
};

export class EnterpriseIntegrationHub {
  private readonly fetchImpl: FetchLike;
  private readonly redisFactory: (url: string) => RedisLike;
  private readonly queueFactory: (
    name: string,
    url: string,
    prefix: string
  ) => QueueLike;
  private readonly s3Factory: (
    config: EnterpriseIntegrationConfig["s3"]
  ) => S3Like;
  private readonly now: () => number;
  private readonly metrics = new Map<string, MetricSample>();

  constructor(
    readonly config: EnterpriseIntegrationConfig =
      enterpriseIntegrationConfigFromEnv(),
    dependencies: EnterpriseIntegrationDependencies = {}
  ) {
    this.fetchImpl = dependencies.fetchImpl ?? fetch;
    this.redisFactory = dependencies.redisFactory ?? defaultRedisFactory;
    this.queueFactory = dependencies.queueFactory ?? defaultQueueFactory;
    this.s3Factory = dependencies.s3Factory ?? defaultS3Factory;
    this.now = dependencies.now ?? Date.now;
  }

  catalog(): Array<
    IntegrationDescriptor & {
      configured: boolean;
    }
  > {
    return CATALOG.map(item => ({
      ...item,
      configured: this.isConfigured(item.id),
    }));
  }

  isConfigured(id: IntegrationId): boolean {
    switch (id) {
      case "valkey":
      case "bullmq":
        return Boolean(this.config.redisUrl);
      case "s3":
        return Boolean(this.config.s3.bucket && this.config.s3.region);
      case "opensearch":
        return Boolean(this.config.openSearch.url);
      case "qdrant":
        return Boolean(
          this.config.qdrant.url && this.config.qdrant.collection
        );
      case "clickhouse":
        return Boolean(this.config.clickHouse.url);
      case "prometheus":
        return true;
      case "opentelemetry":
        return Boolean(this.config.otelHttpEndpoint);
      case "fluentbit":
        return Boolean(this.config.fluentBitHttpEndpoint);
      case "flagsmith":
        return Boolean(
          this.config.flagsmith.url && this.config.flagsmith.environmentKey
        );
      case "keycloak":
        return Boolean(this.config.keycloak.issuer);
      case "kong":
        return Boolean(this.config.kong.adminUrl);
    }
  }

  private notConfigured(id: IntegrationId): IntegrationHealth {
    return {
      id,
      status: "not_configured",
      latencyMs: 0,
      detail: "required environment configuration is missing",
    };
  }

  private async measured(
    id: IntegrationId,
    action: () => Promise<string>
  ): Promise<IntegrationHealth> {
    if (!this.isConfigured(id)) return this.notConfigured(id);
    const started = this.now();
    try {
      const detail = await action();
      return {
        id,
        status: "ready",
        latencyMs: Math.max(0, this.now() - started),
        detail,
      };
    } catch (error) {
      return {
        id,
        status: "degraded",
        latencyMs: Math.max(0, this.now() - started),
        detail: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async health(id: IntegrationId): Promise<IntegrationHealth> {
    switch (id) {
      case "valkey":
        return this.measured(id, async () => {
          const redis = this.redisFactory(this.requireRedisUrl());
          try {
            const pong = await redis.ping();
            return `ping=${String(pong)}`;
          } finally {
            await redis.quit();
          }
        });

      case "bullmq":
        return this.measured(id, async () => {
          const queue = this.queueFactory(
            "integration-health",
            this.requireRedisUrl(),
            this.config.queuePrefix
          );
          try {
            const counts = await queue.getJobCounts(
              "waiting",
              "active",
              "failed",
              "completed"
            );
            return `queue counts ${JSON.stringify(counts)}`;
          } finally {
            await queue.close();
          }
        });

      case "s3":
        return this.measured(id, async () => {
          const bucket = this.requireS3Bucket();
          const client = this.s3Factory(this.config.s3);
          try {
            await client.send(new HeadBucketCommand({ Bucket: bucket }));
            return `bucket=${bucket}`;
          } finally {
            client.destroy?.();
          }
        });

      case "opensearch":
        return this.measured(id, async () => {
          const payload = objectRecord(
            await fetchJson(
              this.fetchImpl,
              pathUrl(this.requireOpenSearchUrl(), "_cluster/health"),
              { headers: this.openSearchHeaders() }
            )
          );
          return `cluster=${String(payload.cluster_name ?? "unknown")} status=${String(
            payload.status ?? "unknown"
          )}`;
        });

      case "qdrant":
        return this.measured(id, async () => {
          await fetchText(
            this.fetchImpl,
            pathUrl(this.requireQdrantUrl(), "readyz"),
            { headers: this.qdrantHeaders() }
          );
          return `collection=${this.requireQdrantCollection()}`;
        });

      case "clickhouse":
        return this.measured(id, async () => {
          const value = await this.clickHouseSelect("SELECT 1");
          return `query=${value.trim()}`;
        });

      case "prometheus":
        return {
          id,
          status: "ready",
          latencyMs: 0,
          detail: `in-process metrics registry samples=${this.metrics.size}`,
        };

      case "opentelemetry":
        return this.measured(id, async () => {
          await this.exportSpan("skycoin4444.integration.health", 1, {
            integration: "opentelemetry",
          });
          return "OTLP/HTTP export accepted";
        });

      case "fluentbit":
        return this.measured(id, async () => {
          await this.pushLog("debug", "skycoin4444 integration health probe", {
            integration: "fluentbit",
          });
          return "HTTP log event accepted";
        });

      case "flagsmith":
        return this.measured(id, async () => {
          const flags = await this.getFlagsmithFlags();
          return `flags=${flags.length}`;
        });

      case "keycloak":
        return this.measured(id, async () => {
          const discovery = await this.getKeycloakDiscovery();
          return `issuer=${String(discovery.issuer ?? "unknown")}`;
        });

      case "kong":
        return this.measured(id, async () => {
          const payload = await fetchJson(
            this.fetchImpl,
            pathUrl(this.requireKongUrl(), "status"),
            { headers: this.kongHeaders() }
          );
          return `status keys=${Object.keys(objectRecord(payload)).length}`;
        });
    }
  }

  async healthAll(): Promise<IntegrationHealth[]> {
    return Promise.all(CATALOG.map(item => this.health(item.id)));
  }

  private requireRedisUrl(): string {
    if (!this.config.redisUrl) throw new Error("SKY_REDIS_URL or REDIS_URL is not configured");
    return this.config.redisUrl;
  }

  async cacheGet(key: string): Promise<string | null> {
    const redis = this.redisFactory(this.requireRedisUrl());
    try {
      return await redis.get(assertSimpleName(key, "cache key"));
    } finally {
      await redis.quit();
    }
  }

  async cacheSet(
    key: string,
    value: string,
    ttlSeconds = 300
  ): Promise<void> {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 86_400) {
      throw new Error("ttlSeconds must be an integer between 1 and 86400");
    }
    if (Buffer.byteLength(value, "utf8") > 1_000_000) {
      throw new Error("cache value exceeds 1 MB");
    }

    const redis = this.redisFactory(this.requireRedisUrl());
    try {
      await redis.set(
        assertSimpleName(key, "cache key"),
        value,
        "EX",
        ttlSeconds
      );
    } finally {
      await redis.quit();
    }
  }

  async cacheDelete(key: string): Promise<boolean> {
    const redis = this.redisFactory(this.requireRedisUrl());
    try {
      return (await redis.del(assertSimpleName(key, "cache key"))) > 0;
    } finally {
      await redis.quit();
    }
  }

  async enqueue(
    queueName: string,
    jobName: string,
    data: unknown,
    idempotencyKey?: string
  ): Promise<{ id: string | null }> {
    const queue = this.queueFactory(
      assertSimpleName(queueName, "queue name"),
      this.requireRedisUrl(),
      this.config.queuePrefix
    );
    try {
      const jobId = idempotencyKey
        ? createHash("sha256").update(idempotencyKey).digest("hex")
        : undefined;
      const job = await queue.add(
        assertSimpleName(jobName, "job name"),
        data,
        jobId ? { jobId } : undefined
      );
      return { id: job.id == null ? null : String(job.id) };
    } finally {
      await queue.close();
    }
  }

  private requireS3Bucket(): string {
    if (!this.config.s3.bucket || !this.config.s3.region) {
      throw new Error("SKY_S3_BUCKET and SKY_S3_REGION are required");
    }
    return this.config.s3.bucket;
  }

  async putObject(
    key: string,
    body: string,
    contentType = "application/octet-stream"
  ): Promise<{ bucket: string; key: string; bytes: number }> {
    const bytes = Buffer.byteLength(body, "utf8");
    if (bytes > 5_000_000) {
      throw new Error("object body exceeds the 5 MB integration limit");
    }
    if (!/^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+$/.test(contentType)) {
      throw new Error("content type is invalid");
    }

    const bucket = this.requireS3Bucket();
    const safeKey = assertObjectKey(key);
    const client = this.s3Factory(this.config.s3);
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: safeKey,
          Body: body,
          ContentType: contentType,
        })
      );
      return { bucket, key: safeKey, bytes };
    } finally {
      client.destroy?.();
    }
  }

  private requireOpenSearchUrl(): string {
    if (!this.config.openSearch.url) {
      throw new Error("SKY_OPENSEARCH_URL is not configured");
    }
    return this.config.openSearch.url;
  }

  private openSearchHeaders(): HeadersInit {
    const authorization = this.config.openSearch.apiKey
      ? `ApiKey ${this.config.openSearch.apiKey}`
      : basicAuthorization(
          this.config.openSearch.username,
          this.config.openSearch.password
        );

    return {
      "content-type": "application/json",
      ...(authorization ? { authorization } : {}),
    };
  }

  async indexSearchDocument(
    index: string,
    id: string,
    document: Record<string, unknown>
  ): Promise<unknown> {
    const safeIndex = assertSimpleName(index, "index");
    const safeId = assertSimpleName(id, "document id");
    return fetchJson(
      this.fetchImpl,
      pathUrl(
        this.requireOpenSearchUrl(),
        `${encodeURIComponent(safeIndex)}/_doc/${encodeURIComponent(safeId)}`
      ),
      {
        method: "PUT",
        headers: this.openSearchHeaders(),
        body: JSON.stringify(document),
      }
    );
  }

  async search(
    index: string,
    query: Record<string, unknown>,
    size = 20
  ): Promise<unknown> {
    if (!Number.isInteger(size) || size < 1 || size > 100) {
      throw new Error("search size must be an integer between 1 and 100");
    }
    const safeIndex = assertSimpleName(index, "index");
    return fetchJson(
      this.fetchImpl,
      pathUrl(
        this.requireOpenSearchUrl(),
        `${encodeURIComponent(safeIndex)}/_search`
      ),
      {
        method: "POST",
        headers: this.openSearchHeaders(),
        body: JSON.stringify({ ...query, size }),
      }
    );
  }

  private requireQdrantUrl(): string {
    if (!this.config.qdrant.url) {
      throw new Error("SKY_QDRANT_URL is not configured");
    }
    return this.config.qdrant.url;
  }

  private requireQdrantCollection(): string {
    if (!this.config.qdrant.collection) {
      throw new Error("SKY_QDRANT_COLLECTION is not configured");
    }
    return assertSimpleName(this.config.qdrant.collection, "Qdrant collection");
  }

  private qdrantHeaders(): HeadersInit {
    return {
      "content-type": "application/json",
      ...(this.config.qdrant.apiKey
        ? { "api-key": this.config.qdrant.apiKey }
        : {}),
    };
  }

  async upsertVectors(
    points: Array<{
      id: string | number;
      vector: number[];
      payload?: Record<string, unknown>;
    }>
  ): Promise<unknown> {
    if (points.length < 1 || points.length > 256) {
      throw new Error("vector upsert requires 1 to 256 points");
    }
    for (const point of points) {
      if (
        !Array.isArray(point.vector) ||
        point.vector.length < 1 ||
        point.vector.length > 8_192 ||
        point.vector.some(value => !Number.isFinite(value))
      ) {
        throw new Error("vector contains invalid values or dimensions");
      }
    }

    return fetchJson(
      this.fetchImpl,
      pathUrl(
        this.requireQdrantUrl(),
        `collections/${encodeURIComponent(
          this.requireQdrantCollection()
        )}/points?wait=true`
      ),
      {
        method: "PUT",
        headers: this.qdrantHeaders(),
        body: JSON.stringify({ points }),
      }
    );
  }

  async queryVectors(vector: number[], limit = 10): Promise<unknown> {
    if (
      vector.length < 1 ||
      vector.length > 8_192 ||
      vector.some(value => !Number.isFinite(value))
    ) {
      throw new Error("query vector contains invalid values or dimensions");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error("vector query limit must be between 1 and 100");
    }

    return fetchJson(
      this.fetchImpl,
      pathUrl(
        this.requireQdrantUrl(),
        `collections/${encodeURIComponent(
          this.requireQdrantCollection()
        )}/points/query`
      ),
      {
        method: "POST",
        headers: this.qdrantHeaders(),
        body: JSON.stringify({ query: vector, limit, with_payload: true }),
      }
    );
  }

  private requireClickHouseUrl(): string {
    if (!this.config.clickHouse.url) {
      throw new Error("SKY_CLICKHOUSE_URL is not configured");
    }
    return this.config.clickHouse.url;
  }

  async clickHouseSelect(query: string): Promise<string> {
    const normalizedQuery = query.trim();
    if (!/^SELECT\b/i.test(normalizedQuery) || /;\s*\S/.test(normalizedQuery)) {
      throw new Error("ClickHouse integration permits one read-only SELECT query");
    }
    if (normalizedQuery.length > 20_000) {
      throw new Error("ClickHouse query is too large");
    }

    const authorization = basicAuthorization(
      this.config.clickHouse.username,
      this.config.clickHouse.password
    );
    const database = this.config.clickHouse.database
      ? `?database=${encodeURIComponent(this.config.clickHouse.database)}`
      : "";

    return fetchText(
      this.fetchImpl,
      `${requireHttpUrl(this.requireClickHouseUrl(), "ClickHouse URL")}/${database}`,
      {
        method: "POST",
        headers: {
          "content-type": "text/plain; charset=utf-8",
          ...(authorization ? { authorization } : {}),
        },
        body: normalizedQuery,
      }
    );
  }

  recordMetric(
    name: string,
    value: number,
    options: {
      kind?: MetricKind;
      labels?: Record<string, string>;
      help?: string;
      mode?: "set" | "add";
    } = {}
  ): void {
    if (!/^[a-zA-Z_:][a-zA-Z0-9_:]*$/.test(name)) {
      throw new Error("metric name is invalid");
    }
    if (!Number.isFinite(value)) {
      throw new Error("metric value must be finite");
    }

    const labels = options.labels ?? {};
    for (const [key, labelValue] of Object.entries(labels)) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new Error("metric label name is invalid");
      }
      if (labelValue.length > 256) {
        throw new Error("metric label value is too long");
      }
    }

    const key = metricKey(name, labels);
    const previous = this.metrics.get(key);
    const mode = options.mode ?? "set";
    const nextValue =
      mode === "add" && previous ? previous.value + value : value;

    this.metrics.set(key, {
      name,
      kind: options.kind ?? previous?.kind ?? "gauge",
      value: nextValue,
      labels: { ...labels },
      help: options.help ?? previous?.help,
    });
  }

  renderPrometheus(): string {
    const groups = new Map<string, MetricSample[]>();
    for (const sample of this.metrics.values()) {
      const list = groups.get(sample.name) ?? [];
      list.push(sample);
      groups.set(sample.name, list);
    }

    const lines: string[] = [];
    for (const name of Array.from(groups.keys()).sort()) {
      const samples = groups.get(name) ?? [];
      const first = samples[0];
      if (first?.help) {
        lines.push(`# HELP ${name} ${first.help.replace(/\n/g, " ")}`);
      }
      lines.push(`# TYPE ${name} ${first?.kind ?? "gauge"}`);
      for (const sample of samples) {
        lines.push(
          `${sample.name}${renderLabels(sample.labels)} ${sample.value}`
        );
      }
    }

    return `${lines.join("\n")}\n`;
  }

  private requireOtelEndpoint(): string {
    if (!this.config.otelHttpEndpoint) {
      throw new Error("SKY_OTEL_HTTP_ENDPOINT is not configured");
    }
    return requireHttpUrl(
      this.config.otelHttpEndpoint,
      "SKY_OTEL_HTTP_ENDPOINT"
    );
  }

  async exportSpan(
    name: string,
    durationMs: number,
    attributes: Record<string, string | number | boolean> = {}
  ): Promise<void> {
    if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 600_000) {
      throw new Error("span duration must be between 0 and 600000 ms");
    }
    if (name.length < 1 || name.length > 256) {
      throw new Error("span name is invalid");
    }

    const endNs = BigInt(this.now()) * 1_000_000n;
    const startNs = endNs - BigInt(Math.round(durationMs * 1_000_000));
    const attrValues = Object.entries(attributes).map(([key, value]) => ({
      key,
      value:
        typeof value === "string"
          ? { stringValue: value }
          : typeof value === "number"
            ? { doubleValue: value }
            : { boolValue: value },
    }));

    await fetchJson(
      this.fetchImpl,
      this.requireOtelEndpoint(),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resourceSpans: [
            {
              resource: {
                attributes: [
                  {
                    key: "service.name",
                    value: { stringValue: "skycoin4444" },
                  },
                ],
              },
              scopeSpans: [
                {
                  scope: { name: "skycoin4444.enterprise-integrations" },
                  spans: [
                    {
                      traceId: randomBytes(16).toString("base64"),
                      spanId: randomBytes(8).toString("base64"),
                      name,
                      kind: 1,
                      startTimeUnixNano: startNs.toString(),
                      endTimeUnixNano: endNs.toString(),
                      attributes: attrValues,
                      status: { code: 1 },
                    },
                  ],
                },
              ],
            },
          ],
        }),
      },
      5_000
    );
  }

  private requireFluentBitEndpoint(): string {
    if (!this.config.fluentBitHttpEndpoint) {
      throw new Error("SKY_FLUENTBIT_HTTP_ENDPOINT is not configured");
    }
    return requireHttpUrl(
      this.config.fluentBitHttpEndpoint,
      "SKY_FLUENTBIT_HTTP_ENDPOINT"
    );
  }

  async pushLog(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    context: Record<string, unknown> = {}
  ): Promise<void> {
    if (message.length < 1 || message.length > 8_192) {
      throw new Error("log message is invalid");
    }
    await fetchJson(
      this.fetchImpl,
      this.requireFluentBitEndpoint(),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date(this.now()).toISOString(),
          service: "skycoin4444",
          level,
          message,
          context,
        }),
      },
      5_000
    );
  }

  private requireFlagsmith(): { url: string; environmentKey: string } {
    if (!this.config.flagsmith.url || !this.config.flagsmith.environmentKey) {
      throw new Error(
        "SKY_FLAGSMITH_URL and SKY_FLAGSMITH_ENVIRONMENT_KEY are required"
      );
    }
    return {
      url: this.config.flagsmith.url,
      environmentKey: this.config.flagsmith.environmentKey,
    };
  }

  async getFlagsmithFlags(): Promise<Array<Record<string, unknown>>> {
    const config = this.requireFlagsmith();
    const payload = await fetchJson(
      this.fetchImpl,
      pathUrl(config.url, "api/v1/flags/"),
      {
        headers: {
          "x-environment-key": config.environmentKey,
        },
      }
    );
    if (!Array.isArray(payload)) {
      throw new Error("Flagsmith returned a non-array flag payload");
    }
    return payload.filter(
      item => item && typeof item === "object" && !Array.isArray(item)
    ) as Array<Record<string, unknown>>;
  }

  async evaluateFlag(name: string): Promise<{
    found: boolean;
    enabled: boolean;
    value: unknown;
  }> {
    const safeName = assertSimpleName(name, "feature flag");
    const flags = await this.getFlagsmithFlags();
    const match = flags.find(flag => {
      const feature = flag.feature;
      return (
        feature &&
        typeof feature === "object" &&
        !Array.isArray(feature) &&
        (feature as Record<string, unknown>).name === safeName
      );
    });

    return {
      found: Boolean(match),
      enabled: Boolean(match?.enabled),
      value: match?.feature_state_value ?? null,
    };
  }

  private requireKeycloakIssuer(): string {
    if (!this.config.keycloak.issuer) {
      throw new Error("SKY_KEYCLOAK_ISSUER is not configured");
    }
    return requireHttpUrl(
      this.config.keycloak.issuer,
      "SKY_KEYCLOAK_ISSUER"
    );
  }

  async getKeycloakDiscovery(): Promise<Record<string, unknown>> {
    const issuer = this.requireKeycloakIssuer();
    const payload = objectRecord(
      await fetchJson(
        this.fetchImpl,
        pathUrl(issuer, ".well-known/openid-configuration")
      )
    );
    if (typeof payload.issuer !== "string" || typeof payload.jwks_uri !== "string") {
      throw new Error("OIDC discovery payload is missing issuer or jwks_uri");
    }
    return payload;
  }

  private requireKongUrl(): string {
    if (!this.config.kong.adminUrl) {
      throw new Error("SKY_KONG_ADMIN_URL is not configured");
    }
    return this.config.kong.adminUrl;
  }

  private kongHeaders(): HeadersInit {
    return this.config.kong.adminToken
      ? { "kong-admin-token": this.config.kong.adminToken }
      : {};
  }

  async listKongServices(limit = 100): Promise<unknown> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 1_000) {
      throw new Error("Kong service limit must be between 1 and 1000");
    }
    return fetchJson(
      this.fetchImpl,
      pathUrl(this.requireKongUrl(), `services?size=${limit}`),
      { headers: this.kongHeaders() }
    );
  }
}

let singleton: EnterpriseIntegrationHub | null = null;

export const getEnterpriseIntegrationHub = (): EnterpriseIntegrationHub => {
  if (!singleton) singleton = new EnterpriseIntegrationHub();
  return singleton;
};

export const resetEnterpriseIntegrationHubForTests = (): void => {
  singleton = null;
};

export const enterpriseIntegrationCatalog = CATALOG;
