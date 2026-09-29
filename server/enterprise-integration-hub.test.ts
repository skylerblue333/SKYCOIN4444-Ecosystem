import { describe, expect, it, vi } from "vitest";
import {
  EnterpriseIntegrationHub,
  type EnterpriseIntegrationConfig,
  type EnterpriseIntegrationDependencies,
} from "./enterprise-integration-hub";

const fullConfig = (): EnterpriseIntegrationConfig => ({
  redisUrl: "redis://example.test:6379",
  queuePrefix: "sky-test",
  s3: {
    endpoint: "https://s3.example.test",
    region: "us-east-1",
    bucket: "sky-test",
    accessKeyId: "test-access",
    secretAccessKey: "test-secret",
  },
  openSearch: {
    url: "https://search.example.test",
    apiKey: "test-key",
  },
  qdrant: {
    url: "https://qdrant.example.test",
    apiKey: "test-key",
    collection: "sky_vectors",
  },
  clickHouse: {
    url: "https://clickhouse.example.test",
    username: "default",
    password: "test",
    database: "sky",
  },
  otelHttpEndpoint: "https://otel.example.test/v1/traces",
  fluentBitHttpEndpoint: "https://logs.example.test/skycoin",
  flagsmith: {
    url: "https://flags.example.test",
    environmentKey: "env-key",
  },
  keycloak: {
    issuer: "https://identity.example.test/realms/sky",
    audience: "skycoin4444",
  },
  kong: {
    adminUrl: "https://gateway.example.test",
    adminToken: "admin-token",
  },
});

const emptyConfig = (): EnterpriseIntegrationConfig => ({
  queuePrefix: "sky-test",
  s3: {},
  openSearch: {},
  qdrant: {},
  clickHouse: {},
  flagsmith: {},
  keycloak: {},
  kong: {},
});

describe("EnterpriseIntegrationHub", () => {
  it("registers twelve explicit open-source products without pretending they are configured", () => {
    const hub = new EnterpriseIntegrationHub(emptyConfig());
    const catalog = hub.catalog();

    expect(catalog).toHaveLength(12);
    expect(catalog.find(item => item.id === "prometheus")?.configured).toBe(
      true
    );
    expect(
      catalog.filter(item => item.id !== "prometheus").every(item => !item.configured)
    ).toBe(true);
    expect(catalog.map(item => item.product)).toContain("OpenSearch");
    expect(catalog.map(item => item.product)).toContain("Keycloak");
  });

  it("returns not_configured rather than fake success for missing providers", async () => {
    const hub = new EnterpriseIntegrationHub(emptyConfig());

    expect(await hub.health("qdrant")).toMatchObject({
      id: "qdrant",
      status: "not_configured",
    });
    expect(await hub.health("prometheus")).toMatchObject({
      id: "prometheus",
      status: "ready",
    });
  });

  it("records Prometheus metrics with deterministic label ordering", () => {
    const hub = new EnterpriseIntegrationHub(emptyConfig());
    hub.recordMetric("sky_requests_total", 1, {
      kind: "counter",
      mode: "add",
      labels: { route: "/healthz", method: "GET" },
      help: "Requests",
    });
    hub.recordMetric("sky_requests_total", 2, {
      kind: "counter",
      mode: "add",
      labels: { method: "GET", route: "/healthz" },
    });

    const rendered = hub.renderPrometheus();
    expect(rendered).toContain("# TYPE sky_requests_total counter");
    expect(rendered).toContain(
      'sky_requests_total{method="GET",route="/healthz"} 3'
    );
  });

  it("uses the Valkey-compatible cache with TTL and closes the connection", async () => {
    const calls: unknown[][] = [];
    const quit = vi.fn(async () => "OK");
    const dependencies: EnterpriseIntegrationDependencies = {
      redisFactory: () => ({
        ping: async () => "PONG",
        get: async key => (key === "profile" ? "cached" : null),
        set: async (...args) => {
          calls.push(args);
          return "OK";
        },
        del: async () => 1,
        quit,
      }),
    };
    const hub = new EnterpriseIntegrationHub(fullConfig(), dependencies);

    expect(await hub.cacheGet("profile")).toBe("cached");
    await hub.cacheSet("profile", "value", 60);
    expect(await hub.cacheDelete("profile")).toBe(true);

    expect(calls).toEqual([["profile", "value", "EX", 60]]);
    expect(quit).toHaveBeenCalledTimes(3);
  });

  it("creates deterministic BullMQ job IDs from idempotency keys", async () => {
    let receivedJobId: string | undefined;
    const close = vi.fn(async () => undefined);
    const hub = new EnterpriseIntegrationHub(fullConfig(), {
      queueFactory: () => ({
        add: async (_name, _data, options) => {
          receivedJobId = options?.jobId;
          return { id: "job-1" };
        },
        getJobCounts: async () => ({ waiting: 0 }),
        close,
      }),
    });

    const first = await hub.enqueue(
      "emails",
      "send",
      { userId: "u1" },
      "same-operation"
    );
    const firstIdempotency = receivedJobId;
    await hub.enqueue("emails", "send", { userId: "u1" }, "same-operation");

    expect(first.id).toBe("job-1");
    expect(receivedJobId).toBe(firstIdempotency);
    expect(receivedJobId).toMatch(/^[a-f0-9]{64}$/);
    expect(close).toHaveBeenCalledTimes(2);
  });

  it("writes bounded text objects through the S3-compatible storage adapter", async () => {
    let commandName = "";
    let input: Record<string, unknown> = {};
    const destroy = vi.fn();
    const hub = new EnterpriseIntegrationHub(fullConfig(), {
      s3Factory: () => ({
        send: async command => {
          const value = command as {
            constructor?: { name?: string };
            input?: Record<string, unknown>;
          };
          commandName = value.constructor?.name ?? "";
          input = value.input ?? {};
          return {};
        },
        destroy,
      }),
    });

    const result = await hub.putObject(
      "exports/report.txt",
      "hello",
      "text/plain"
    );

    expect(commandName).toBe("PutObjectCommand");
    expect(input).toMatchObject({
      Bucket: "sky-test",
      Key: "exports/report.txt",
      ContentType: "text/plain",
    });
    expect(result.bytes).toBe(5);
    expect(destroy).toHaveBeenCalledOnce();
  });

  it("builds authenticated OpenSearch and Qdrant requests without user-controlled base URLs", async () => {
    const requests: Array<{ url: string; method: string; body: unknown }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      requests.push({
        url: String(input),
        method: init?.method ?? "GET",
        body: init?.body ? JSON.parse(String(init.body)) : null,
      });
      return new Response(JSON.stringify({ result: "ok", hits: {} }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const hub = new EnterpriseIntegrationHub(fullConfig(), { fetchImpl });
    await hub.indexSearchDocument("posts", "post-1", { text: "hello" });
    await hub.search("posts", { query: { match: { text: "hello" } } }, 25);
    await hub.upsertVectors([
      { id: "doc-1", vector: [0.1, 0.2], payload: { type: "post" } },
    ]);
    await hub.queryVectors([0.1, 0.2], 5);

    expect(requests[0]).toMatchObject({
      url: "https://search.example.test/posts/_doc/post-1",
      method: "PUT",
    });
    expect(requests[1]?.body).toMatchObject({ size: 25 });
    expect(requests[2]?.url).toContain(
      "/collections/sky_vectors/points?wait=true"
    );
    expect(requests[3]?.url).toContain(
      "/collections/sky_vectors/points/query"
    );
  });

  it("allows read-only ClickHouse SELECTs and rejects mutations", async () => {
    const fetchImpl: typeof fetch = async (_input, init) =>
      new Response(String(init?.body) === "SELECT 1" ? "1\n" : "ok\n", {
        status: 200,
      });
    const hub = new EnterpriseIntegrationHub(fullConfig(), { fetchImpl });

    expect(await hub.clickHouseSelect("SELECT 1")).toBe("1\n");
    await expect(hub.clickHouseSelect("DROP TABLE users")).rejects.toThrow(
      /read-only SELECT/
    );
    await expect(
      hub.clickHouseSelect("SELECT 1; DROP TABLE users")
    ).rejects.toThrow(/read-only SELECT/);
  });

  it("exports an OTLP HTTP JSON span with valid base64 identifier sizes", async () => {
    let payload: any;
    const fetchImpl: typeof fetch = async (_input, init) => {
      payload = JSON.parse(String(init?.body));
      return new Response("{}", { status: 200 });
    };
    const hub = new EnterpriseIntegrationHub(fullConfig(), {
      fetchImpl,
      now: () => 1_700_000_000_000,
    });

    await hub.exportSpan("sky.test", 12, { route: "/test", ok: true });

    const span =
      payload.resourceSpans[0].scopeSpans[0].spans[0];
    expect(Buffer.from(span.traceId, "base64")).toHaveLength(16);
    expect(Buffer.from(span.spanId, "base64")).toHaveLength(8);
    expect(span.name).toBe("sky.test");
    expect(span.attributes).toHaveLength(2);
  });

  it("pushes structured events to the Fluent Bit HTTP input", async () => {
    let payload: Record<string, unknown> = {};
    const fetchImpl: typeof fetch = async (_input, init) => {
      payload = JSON.parse(String(init?.body));
      return new Response("{}", { status: 200 });
    };
    const hub = new EnterpriseIntegrationHub(fullConfig(), {
      fetchImpl,
      now: () => Date.parse("2026-09-25T10:00:00Z"),
    });

    await hub.pushLog("info", "integration online", { component: "hub" });

    expect(payload).toMatchObject({
      service: "skycoin4444",
      level: "info",
      message: "integration online",
      context: { component: "hub" },
    });
  });

  it("evaluates Flagsmith environment flags without inventing missing values", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(
        JSON.stringify([
          {
            feature: { name: "new-dashboard" },
            enabled: true,
            feature_state_value: "beta",
          },
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    const hub = new EnterpriseIntegrationHub(fullConfig(), { fetchImpl });

    expect(await hub.evaluateFlag("new-dashboard")).toEqual({
      found: true,
      enabled: true,
      value: "beta",
    });
    expect(await hub.evaluateFlag("does-not-exist")).toEqual({
      found: false,
      enabled: false,
      value: null,
    });
  });

  it("validates Keycloak OIDC discovery and Kong service inventory", async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async input => {
      const url = String(input);
      calls.push(url);
      if (url.includes("openid-configuration")) {
        return new Response(
          JSON.stringify({
            issuer: "https://identity.example.test/realms/sky",
            jwks_uri:
              "https://identity.example.test/realms/sky/protocol/openid-connect/certs",
          }),
          { status: 200 }
        );
      }
      return new Response(
        JSON.stringify({ data: [{ id: "svc-1", name: "sky-api" }] }),
        { status: 200 }
      );
    };
    const hub = new EnterpriseIntegrationHub(fullConfig(), { fetchImpl });

    const discovery = await hub.getKeycloakDiscovery();
    const services = await hub.listKongServices(50);

    expect(discovery.issuer).toContain("/realms/sky");
    expect(services).toEqual({
      data: [{ id: "svc-1", name: "sky-api" }],
    });
    expect(calls[1]).toBe("https://gateway.example.test/services?size=50");
  });

  it("reports real health failures as degraded instead of ready", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response("provider down", { status: 503 });
    const hub = new EnterpriseIntegrationHub(fullConfig(), { fetchImpl });

    const health = await hub.health("opensearch");
    expect(health.status).toBe("degraded");
    expect(health.detail).toContain("503");
  });
});
