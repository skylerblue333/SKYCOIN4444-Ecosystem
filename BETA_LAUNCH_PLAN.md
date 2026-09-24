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

## Immediate blockers observed on September 23, 2026

- The latest `main` GitHub Actions runs are failing.
- One workflow uses npm caching/install commands while the repository is pinned to pnpm.
- The larger CI workflow contains unsupported workflow keys and references scripts that are not present in `package.json`.
- The deployment workflow contains AWS resource names that are not established as the real SKYCOIN4444 deployment target.
- Repository documentation correctly labels the current state as an engineering beta; older production-oriented documentation should not be used as readiness evidence.

## Stabilization progress — September 23, 2026

- CI now uses pnpm consistently and no longer treats copied AWS identifiers as a verified deployment target.
- Full TypeScript debt is reported without hiding test/build execution; the initial baseline is 1,251 compiler errors across legacy/experimental and active modules.
- The canonical User type is now exported from the Drizzle schema for auth/context consumers.
- The unused direct `sharp` dependency was removed.
- Audit-generated dependency overrides were re-resolved into the lockfile. GitHub's verification run reported **No known vulnerabilities found** before committing the generated package/lockfile changes back to this branch.
- The next evidence gate is a fresh user-triggered CI run from the clean dependency commit so tests and production build results can be classified.

## Release rule

Do not add large new feature families during this stabilization window. New work enters the beta only when it directly closes one of the launch gates above.
