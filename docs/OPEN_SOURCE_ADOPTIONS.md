# Open-source adoption ledger

This file records deliberate use of maintained open-source components to replace
fragile or misleading in-house paths. It is not a claim that every platform
feature is production-ready.

## 2026-09-25 — Real LLM streaming

**Replaced:** the `/api/ai/code-stream` path previously waited for a complete
LLM response and then simulated streaming by slicing the final text into fixed
chunks with artificial delays.

**Adopted component:** `openai` / `openai-node` (already present in
`package.json`).

- Upstream: https://github.com/openai/openai-node
- License: Apache-2.0
- Integration style: package API only; no upstream source files copied into this
  repository.
- Runtime contract: OpenAI-compatible `/v1/chat/completions` streaming against
  the configured Forge base URL.
- Disconnect behavior: client disconnect/abort is propagated upstream with an
  `AbortSignal`.
- Test boundary: CI uses an injected async streaming client and does not require
  a live provider credential.

### Limitations

This change proves the application no longer fabricates chunks. It does not
prove that every configured external provider supports streaming, nor does it
claim provider uptime, model availability, billing, or external service
certification. Hosted provider-failure and reconnect tests remain release gates.

## Adoption rules

1. Prefer a mature maintained library over a home-grown security, persistence,
   queueing, streaming, or observability primitive when the license is
   compatible and the dependency materially reduces risk.
2. Do not wholesale-copy another product or UI into SKYCOIN4444.
3. Record upstream repository and license.
4. Add focused tests for the integration boundary.
5. Keep capability claims limited to what CI and hosted verification actually
   prove.


## 2026-09-25 — Enterprise integration hub (12 products)

Added optional adapters for Valkey, BullMQ, SeaweedFS/S3, OpenSearch, Qdrant,
ClickHouse, Prometheus, OpenTelemetry, Fluent Bit, Flagsmith, Keycloak, and
Kong. These integrations use package APIs or documented network protocols;
third-party server source code is not copied into SKYCOIN4444.

All operations are admin-only, environment-configured, bounded, and fail closed.
Missing providers report `not_configured`, provider failures report
`degraded`, and production provisioning is not claimed.

Detailed contracts, licenses, limits, and environment variables are documented
in `docs/ENTERPRISE_OPEN_SOURCE_WAVE.md`.
