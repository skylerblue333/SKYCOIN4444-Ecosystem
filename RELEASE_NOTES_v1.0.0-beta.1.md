# SKYCOIN4444 v1.0.0-beta.1 — Candidate Release Notes

**Status:** Release candidate preparation; not yet promoted to public beta  
**Candidate:** `v1.0.0-beta.1-rc1`  
**Evidence source:** GitHub CI artifacts and Issue #2 launch tracker

This file replaces the older July release note draft that contained unverified user counts, revenue, throughput, uptime, mining-income, coverage, and feature-completeness claims. Those figures are not release evidence and are not part of this candidate.

## What is verified in the candidate path

The stabilization sequence has established reproducible CI around dependency auditing, the TypeScript no-regression ceiling, the full automated test suite, production build, Docker image construction, runtime/session persistence, fail-closed provider behavior, representative load, reconnect behavior, and duplicate-sensitive database invariants.

The beta-access path uses a server-validated invite key and persisted identity. Runtime evidence proves a signed session can survive a process restart in the production artifact. Wave 8 adds a fresh-profile Chrome smoke that exercises the actual beta sign-in form with a clean account and verifies the session survives a browser reload.

Social persistence and direct-message history have MySQL-backed coverage. Notification operations are user-scoped and bounded. Admin beta screens use server-authorized contracts rather than simulated moderation success.

AI provider streaming uses real provider deltas when configured. Missing/unimplemented persistence or providers fail closed instead of reporting fabricated success.

The wallet, game, payment, staking, compliance, and creator-economy surfaces must be interpreted according to their verified backend contracts. A visible screen is not evidence that custody, settlement, wagering, payouts, or a production financial integration is enabled.

Live-stream session metadata can persist and live discovery can expose a persisted playable HLS URL. The project does not claim that hosted ingest/transcoding, durable stream chat, viewer telemetry, or creator payouts are production-ready.

## Release blockers and limitations

- Hosted Wave 7 deployment/restart/rollback evidence is still required before this candidate can advance to soak.
- A dedicated staging MySQL/TiDB database must be used for hosted backup/restore proof; production data must not be used for the drill.
- TypeScript debt is still nonzero and remains governed by the checked-in no-regression ceiling.
- HopeAI chat-history/personality-memory persistence is not configured in the canonical schema and fails closed.
- WebSocket resilience evidence is transport-level and does not imply durable real-time chat delivery.
- Financial/custody/wagering/payout flows remain sandboxed, read-only, disabled, or fail-closed unless their specific accounting authority is proven.
- Hosted external-provider behavior is only claimed for providers explicitly configured and tested in staging.
- Wave 9 requires an actual 24–48 hour soak on one frozen exact SHA.

## Release discipline

During the release-candidate window, only release-blocking fixes should enter the RC. New feature families remain outside the candidate.

The authoritative readiness evidence is the exact-SHA CI record plus the generated `release-candidate-evidence` artifact and the launch tracker in Issue #2.
