# SKYCOIN4444 v1.0.0-beta.1-rc1 — Release Candidate Gate

**Status:** candidate preparation, not promoted  
**Wave:** 8 — release candidate  
**Candidate policy:** no noncritical feature-family additions while this candidate is being validated.

## Freeze policy

The release candidate is cut from a single exact commit after its full CI run is green. Once the RC branch is created, only changes that fix a release blocker may be carried into it: data loss, authentication/authorization, security, recovery, deployment/rollback, observability, provider-failure safety, load/resilience, or a defect in a declared beta core flow.

UI expansion, new product families, speculative integrations, monetization expansion, and other noncritical work stay on post-beta branches.

## Required Wave 8 evidence

The CI pipeline creates a `release-candidate-evidence` artifact only after all existing gates succeed. The final RC evidence job also:

- starts the built production artifact against a clean MySQL database;
- launches Chrome with a fresh temporary browser profile;
- renders the real `/signin` beta-access UI;
- submits a fresh beta account through the browser;
- proves the browser receives `app_session_id`;
- proves that session resolves the same persisted identity;
- reloads the browser and proves the session survives;
- verifies the retained Wave 6 load/reconnect and duplicate-write evidence;
- records hashes of the evidence inputs and exact Git SHA.

The browser profile and session token are not retained. The screenshot/report contain no session-cookie value.

## Current known limitations

This candidate must describe capabilities conservatively:

- Wave 7 hosted Render deployment, hosted restart/redeploy persistence, staging database restore, and real rollback are still required before the RC can be promoted to soak.
- TypeScript debt remains nonzero and is controlled by a no-regression ceiling rather than a clean-typecheck claim.
- HopeAI chat-history/personality-memory persistence is intentionally fail-closed until a canonical persistence schema exists.
- The Wave 6 WebSocket endpoint proves transport reconnect behavior; it is not a claim that chat delivery is WebSocket-backed.
- Wallet/crypto and games are restricted to verified read-only, sandbox, demo, or fail-closed behavior where financial authority/accounting is not proven.
- Live-stream metadata and playable HLS URLs can persist, but hosted ingest/transcoding and durable live chat are not claimed.
- Monetary live-stream tipping/creator settlement is disabled until a verified accounting/settlement contract exists.
- Provider-specific hosted AI/email/storage/payment reliability still requires staging evidence for any provider enabled in the beta environment.
- Wave 9 requires a real 24–48 hour soak; that elapsed-time gate cannot be replaced by CI.

## Promotion rule

Do not label this build a beta release merely because the RC artifact exists. Wave 8 closes only when one exact candidate SHA has green CI, clean-browser evidence, required artifacts, accurate limitations, and the prerequisite hosted Wave 7 evidence. After that exact SHA is frozen, it advances to Wave 9 soak.
