# SKYCOIN4444 Render staging verification

This runbook defines the safe beta-staging path for the canonical `skylerblue333/SKYCOIN4444-Ecosystem` repository.

## Provisioning

Use the root `render.yaml` Blueprint. It creates a new service named `skycoin4444-ecosystem-staging` and intentionally leaves automatic deploys disabled.

Before the first deploy, provide these secrets in Render:

- `DATABASE_URL`: dedicated staging MySQL/TiDB connection string.
- `BETA_ACCESS_KEY`: at least 48 bytes.
- `BETA_ALLOWED_EMAILS`: staging beta tester allowlist.

Render generates `JWT_SECRET`, `HEALTH_ADMIN_TOKEN`, and `POOL_ENCRYPTION_KEY` for the new service. Do not copy production credentials into staging.

External provider credentials such as Stripe, OpenAI, SendGrid, and object storage should remain absent until their fail-closed behavior has been verified. Add them only when that provider is explicitly being validated.

## Pre-deploy gate

Deploy only a commit that has green GitHub checks for:

1. Full tests.
2. Type-debt no-regression.
3. Dependency audit.
4. Production build.
5. Docker image build.
6. Runtime smoke and resilience.

## Hosted verification

After deployment:

1. `GET /healthz` returns 200 and its `release` equals the intended Render commit.
2. `GET /readyz` returns 200 and reports database + beta-access authentication ready.
3. Create a beta-access session with an allowlisted staging email.
4. Confirm `auth.me` and protected `user.me` return the same persisted identity.
5. Confirm a non-admin session is rejected by an admin-only procedure.
6. Confirm a tampered session is rejected.
7. Restart/redeploy the service and verify the same signed session still resolves the same persisted identity.
8. Confirm logout expires `app_session_id`.
9. Confirm missing/unconfigured external providers fail closed without taking down `/healthz`.
10. Inspect Render logs and metrics for request errors, restart loops, memory pressure, and abnormal latency.

## Rollback

Keep the previous known-good Render deploy available. If readiness, authentication, persistence, or provider-failure checks regress, stop promotion and roll back to the prior known-good deploy before investigating.

Do not treat the hosted gate as complete until the exact deployed commit and all checks above are recorded in Issue #2.
