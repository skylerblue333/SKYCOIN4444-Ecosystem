# Enterprise Open-Source Integration Wave

This wave adds twelve optional enterprise integration products to the canonical
SKYCOIN4444 backend. The objective is to replace fragile one-off infrastructure
code with well-known open-source systems and stable protocols without copying
entire third-party applications into this repository.

## Delivered products

| SKYCOIN4444 capability | Open-source system | License | Delivered integration |
| --- | --- | --- | --- |
| Distributed cache | Valkey | BSD-3-Clause | get/set/delete, TTL, PING health |
| Background jobs | BullMQ | MIT | enqueue, deterministic idempotency ID, queue counts |
| Object storage | SeaweedFS S3 gateway / S3 protocol | Apache-2.0 | bucket HEAD, bounded text-object PUT |
| Search | OpenSearch | Apache-2.0 | cluster health, document index, search |
| AI vector retrieval | Qdrant | Apache-2.0 | readiness, vector upsert, vector query |
| Analytics | ClickHouse | Apache-2.0 | readiness and bounded read-only SELECT |
| Metrics | Prometheus exposition | Apache-2.0 | in-process counter/gauge registry and text export |
| Tracing | OpenTelemetry | Apache-2.0 | OTLP/HTTP JSON span export |
| Log pipeline | Fluent Bit | Apache-2.0 | structured HTTP log push |
| Feature flags | Flagsmith | BSD-3-Clause | environment flag fetch/evaluation |
| Identity federation | Keycloak | Apache-2.0 | OIDC discovery metadata |
| API gateway | Kong Gateway | Apache-2.0 | gateway status and service inventory |

Upstream source is used as a protocol/package dependency reference. No server
source tree from these products is vendored into SKYCOIN4444.

## API boundary

The integration hub is mounted at the tRPC namespace:

`integrations.*`

All procedures are protected by `adminProcedure`. The hub does not expose an
anonymous proxy, user-controlled provider URL, arbitrary external fetch, or
provider secret readback.

Supported procedures include:

- `integrations.catalog`
- `integrations.health`
- `integrations.healthAll`
- `integrations.cacheGet/cacheSet/cacheDelete`
- `integrations.queueEnqueue`
- `integrations.storagePutText`
- `integrations.searchIndex/searchQuery`
- `integrations.vectorUpsert/vectorQuery`
- `integrations.analyticsSelect`
- `integrations.metricRecord/prometheus`
- `integrations.traceExport`
- `integrations.logPush`
- `integrations.featureFlag`
- `integrations.oidcDiscovery`
- `integrations.gatewayServices`

## Fail-closed behavior

Every external integration is disabled until its required environment
configuration exists. Missing configuration reports `not_configured`; provider
errors report `degraded`. Neither state is converted into fake success.

The following validation boundaries are enforced in application code:

- cache TTL: 1 second to 24 hours;
- cache values: maximum 1 MB;
- object body: maximum 5 MB;
- object keys reject traversal-like `..` sequences;
- queue/index/job identifiers use a restricted character set;
- queue idempotency keys become deterministic SHA-256 job IDs;
- search result limits are bounded;
- vector dimensions and point batches are bounded and finite;
- ClickHouse accepts only one read-only `SELECT` statement;
- metric names/labels follow Prometheus-compatible syntax;
- trace duration and log payload sizes are bounded;
- HTTP provider responses are size-limited and time-limited;
- provider base URLs come only from server environment configuration.

## Configuration

See `.env.example` for every optional integration setting. Secrets remain
external configuration. The catalog exposes only whether a product is
configured; it never returns secret values.

## Runtime/deployment boundary

This PR adds application integration contracts and tests. It does **not** claim
that Valkey, OpenSearch, Qdrant, ClickHouse, an OpenTelemetry Collector, Fluent
Bit, Flagsmith, Keycloak, Kong, or an S3-compatible server has been provisioned
in production.

A provider becomes operational only after an operator supplies a reachable
instance and credentials where needed, then obtains successful integration
health evidence.

## Why adapters instead of copied repositories

Copying tens or hundreds of thousands of third-party LOC directly into the
application would increase maintenance, security-review scope, license
obligations, and upgrade cost. A narrow adapter preserves the value of mature
projects while keeping ownership boundaries explicit.

The value target for this wave is therefore:

1. real integration operations;
2. compatible upstream licensing/protocol boundaries;
3. deterministic validation;
4. admin authorization;
5. failure transparency;
6. focused regression tests;
7. no fabricated production capability.

## Follow-on candidates

Additional OSS systems should use the same pattern and only land when they solve
a measured gap. Candidates include NATS/JetStream for an event bus, Temporal for
durable workflows, Apache Iceberg for analytics tables, and an OpenTelemetry
Collector deployment profile. Those are not claimed as delivered by this wave.
