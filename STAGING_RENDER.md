# SKYCOIN4444 Wave 7 — Render staging and rollback

This runbook defines the evidence required before the canonical beta can advance past Wave 7. Staging must use a dedicated non-production database and credentials.

## Canonical target

The root `render.yaml` defines a web service named `skycoin4444-ecosystem-staging` in Render's Ohio region.

Automatic deploys are disabled. Promotion is intentional: deploy only an exact commit whose GitHub Beta CI is green.

Required staging configuration:

- `DATABASE_URL`: dedicated staging MySQL/TiDB connection string. Do not point staging at production.
- `BETA_ACCESS_KEY`: strong staging-only access key.
- `BETA_ALLOWED_EMAILS`: explicit staging tester allowlist.
- `JWT_SECRET`: generated/staging-only and stable across normal redeploys.
- `HEALTH_ADMIN_TOKEN` and `POOL_ENCRYPTION_KEY`: staging-only generated values.

Stripe, OpenAI, SendGrid, object storage, and other provider credentials remain absent until each provider is explicitly tested. Missing providers must fail closed rather than fabricate success.

## Pre-deploy gate

Record the exact commit SHA and require all six Beta CI jobs to pass on that SHA:

1. Dependency Audit.
2. Type Debt Report.
3. Tests.
4. Production Build.
5. Runtime Smoke & Resilience.
6. Docker Image Build.

## Hosted verification

Use `pnpm staging:verify -- <mode>` from a trusted workstation or CI runner. Never commit the generated session-state file.

Set:

- `STAGING_BASE_URL` to the Render HTTPS origin.
- `STAGING_EXPECTED_RELEASE` to the exact deployed commit.
- For session modes, set `STAGING_BETA_ACCESS_KEY` and `STAGING_EMAIL`.

Verification sequence:

1. `pnpm staging:verify -- public`
2. `pnpm staging:verify -- seed`
3. Restart or redeploy the same release.
4. `pnpm staging:verify -- verify`
5. `pnpm staging:verify -- logout`

The gate requires:

- `GET /healthz` returns 200.
- `GET /readyz` returns 200 and proves database + authentication readiness.
- The reported release equals the expected Render commit.
- A real beta-access session resolves the same user through `auth.me` and protected `user.me`.
- The non-admin session is rejected at the admin boundary.
- A tampered session is rejected.
- The same signed session survives a process restart/redeploy.
- Logout expires `app_session_id`.
- Missing external providers do not take down liveness/readiness.

## Staging backup and restore

The application is MySQL-compatible; Render Postgres is not a substitute for `DATABASE_URL`.

Before any destructive staging recovery test:

1. Use a dedicated staging database only.
2. Run `pnpm db:backup` from a trusted environment with `mysqldump` installed.
3. Retain both the SQL file and its `.sha256` checksum outside the Render service filesystem.
4. Insert a uniquely named recovery sentinel.
5. Take a fresh backup and record its checksum.
6. Delete the sentinel.
7. Set `ALLOW_DB_RESTORE=YES` and `REQUIRE_BACKUP_CHECKSUM=1`, then run `pnpm db:restore -- <backup.sql>`.
8. Prove the sentinel was restored.
9. Re-run `public` and `verify` hosted checks.

Render service filesystems are ephemeral; database backups must not be treated as durable when stored only inside the web service.

## Rollback proof

Keep auto-deploy disabled while testing rollback.

1. Record deploy A: the previous known-good deploy ID and commit.
2. Deploy candidate B and run all hosted verification checks.
3. Trigger a rollback to deploy A using Render's rollback control for the prior deploy.
4. Wait for deploy A to become live.
5. Run `public` with `STAGING_EXPECTED_RELEASE` set to deploy A's commit.
6. Run `verify` using the previously created session state when session compatibility is expected.
7. Record deploy IDs, commit SHAs, timestamps, health/readiness results, and any logs/metrics reviewed in Issue #2.

Wave 7 is not complete from configuration alone. It requires real hosted deployment, staging database recovery evidence, and a successful rollback to the recorded prior deploy.
