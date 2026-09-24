# SKYCOIN4444 Beta Launch Plan

**Baseline date:** September 23, 2026  
**Target beta window if scope is frozen:** October 21–28, 2026  
**Planning range:** about 4–5 weeks, with 3 weeks possible only if the core flows are already healthy and 6–8 weeks possible if integration or data-loss defects surface.

This document is a launch gate checklist, not a feature-count roadmap. A screen, route, test file, or documentation claim does not count as complete until the behavior is exercised in a deployed environment.

## Definition of beta-ready

A beta candidate is ready when all of the following are demonstrated:

- CI is valid and green on the release commit.
- A clean install, type check, test run, and production build succeed from the repository.
- Login and session persistence survive refresh, restart, and multi-instance deployment.
- Database migrations are reproducible and a backup can be restored into a clean environment.
- The selected core flows work end-to-end using persistent data.
- External-provider failures degrade safely instead of corrupting state or taking down the app.
- Secrets are stored outside source control and secret-like findings have been reviewed.
- Health checks, structured logs, error tracking, basic metrics, and alerting are active.
- Load and resilience tests have been run against staging.
- A rollback procedure has been tested.
- The beta scope and known limitations are documented accurately.

## Scope freeze for the first dependable beta

The first dependable beta should prioritize these connected flows:

1. Identity: sign-up/login, logout, password/session behavior, authorization, profile persistence.
2. Social: profile, feed/post, comments/reactions, follow/community basics.
3. Chat: one-to-one messaging, group messaging, delivery/history, reconnect behavior.
4. HopeAI: prompt/response, streaming, provider failure handling, usage/error boundaries.
5. Wallet/crypto: read-only balances and clearly labeled test/sandbox transaction flows until financial authority, accounting, custody, and legal requirements are verified.
6. Games: Crash, Plinko, High-Low, Blackjack, and Roulette as clearly labeled test/demo experiences until any real-money or token wagering requirements are independently addressed.
7. Administration: moderation, user/report handling, operational health visibility.

Everything else can remain accessible as experimental only if it cannot compromise these core paths.

## Week 1 — establish engineering truth

- Fix GitHub Actions syntax/package-manager drift.
- Use the repository's actual scripts: `pnpm check`, `pnpm test`, and `pnpm build`.
- Remove or gate copied/unverified deployment configuration.
- Review secret-like findings and rotate any real credentials that were ever committed.
- Identify one canonical beta repository and one release branch strategy.
- Inventory environment variables and external providers.
- Run the complete suite and record every reproducible failure.
- Define the staging database and migration procedure.

**Exit gate:** a reproducible local/CI baseline with every failure classified.

## Week 2 — persistent core flows

- Prove authentication/session persistence.
- Prove database persistence across server restarts and deploys.
- Exercise social, chat, and HopeAI end-to-end.
- Add integration tests around the most important cross-module paths.
- Add deterministic error handling and user-facing failure states.
- Remove mocked success responses from beta-critical paths.

**Exit gate:** identity + social + chat + HopeAI pass a written staging smoke test.

## Week 3 — wallet/games and operational safety

- Restrict wallet/crypto flows to verified capabilities and test/sandbox behavior where appropriate.
- Rebuild/validate Crash, Plinko, High-Low, Blackjack, and Roulette around one shared game/session/accounting model.
- Add idempotency where repeated requests can duplicate actions.
- Add backup/restore scripts and perform a restore drill.
- Add structured logs, error tracking, latency/error metrics, and alerts.
- Test provider outages for AI, email, storage, payments, and other configured integrations.

**Exit gate:** no known data-loss path in core beta flows; restore and failure drills have evidence.

## Week 4 — staging hardening

- Load-test login, feed, chat, AI, and the busiest API routes.
- Test reconnect/retry behavior for WebSockets and external APIs.
- Verify rate limiting, authorization boundaries, upload limits, and security headers.
- Run dependency/security scans and triage high-severity findings.
- Verify the real deployment target and rollback procedure.
- Perform staging smoke tests from a clean browser/account.

**Exit gate:** release candidate can run under representative beta load with monitoring and rollback.

## Final 3–5 days — controlled beta release

- Freeze noncritical features.
- Deploy the exact release commit.
- Run a 24–48 hour staging/limited-user soak.
- Fix only release-blocking defects.
- Publish accurate beta notes and known limitations.
- Tag the release after all gates pass.

## Current verified checkpoint — September 24, 2026

- Stabilization PR #1 is merged to `main` at merge commit `e6639b01f92a6974c0b371e3e4493a5ff135481e`.
- The merged stabilization evidence includes green full-suite tests, production build, Docker image validation, dependency audit, runtime smoke/resilience, and a destructive MySQL backup/restore drill.
- The launch tracker records **2,161/2,161 tests** passing on the exact pre-merge head and TypeScript debt reduced from **1,572 to 1,539** errors. A clean typecheck remains a release gate.
- Runtime smoke proves MySQL readiness/release identity, concurrent liveness traffic, and fail-closed behavior when Stripe webhook configuration is missing.
- Persistent-user reads and deterministic persisted IDs replaced earlier mock-user behavior; fake password-login success was removed.
- PR #27 (`stabilize/gamefi-contracts-2026-09-24`) is a stabilization-only follow-up correcting GameFi persistence contracts; it is intentionally not treated as verified until its exact head receives CI evidence.
- No GitHub Actions workflow run was present yet for PR #27 head `a128772b050e75c454d0da56742ea6972e247891` when this checkpoint was recorded.

## Highest-priority unresolved release gates

1. Prove hosted signup/login/logout/session persistence across refresh/restart and verify authorization boundaries.
2. Finish the clean TypeScript gate rather than relying indefinitely on a no-regression debt baseline.
3. Exercise social feed, chat history/reconnect, and HopeAI streaming/provider failure against persistent staging data.
4. Enable deployed structured logs/error tracking/metrics/alerts and verify alert delivery.
5. Load/resilience test the core APIs, verify the real deployment target, and prove rollback before the soak period.

## Release rule

Do not add large new feature families during this stabilization window. New work enters the beta only when it directly closes one of the launch gates above.
