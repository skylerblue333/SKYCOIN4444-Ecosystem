# Production Readiness Checklist

**Status: not production-ready; engineering beta.**

This checklist is a release gate for the SKYCOIN4444 ecosystem. Passing a workflow is evidence that the checked commands passed at a particular commit; it is not a security certification, financial guarantee, regulatory approval, or proof of production deployment.

## Required gates before any public production claim

### Security

- [ ] GitHub Dependabot alerts are reviewed and all critical/high findings are fixed, explicitly accepted with an owner and expiry, or removed by eliminating the affected feature.
- [ ] `pnpm audit --audit-level high` passes against the locked dependency graph.
- [ ] Secret-pattern checks pass and repository history has been reviewed for accidentally committed credentials.
- [ ] A threat model covers authentication, authorization, sessions, uploads, Web3 credentials, payments, admin paths, and external integrations.
- [ ] Vulnerability reporting, incident response, key rotation, and recovery contacts are documented in `SECURITY.md`.

### Reliability and operations

- [ ] CI passes typecheck, package checks, tests, build, and release smoke tests from a clean checkout.
- [ ] Database backup and restore have been exercised against a disposable environment, with measured recovery point and recovery time objectives.
- [ ] Migrations are reviewed, reversible where possible, and tested against a representative schema.
- [ ] Liveness, readiness, graceful shutdown, logging redaction, rate limits, and resource limits are verified in the target deployment environment.
- [ ] Monitoring, alert ownership, rollback steps, and an incident runbook exist before enabling public traffic.

### Product and data

- [ ] The canonical product scope is documented; experimental, archived, mock, and generated surfaces are labeled or removed from the release path.
- [ ] User data retention, deletion, export, consent, and access controls are documented and tested.
- [ ] Third-party services have owners, failure behavior, privacy review, and credential rotation procedures.
- [ ] Every public feature claim maps to a tested implementation or is explicitly labeled planned/experimental.

### Web3 and economic boundaries

- [ ] No repository or product page promises returns, predicts price, coordinates buying, or uses urgency/scarcity to influence markets.
- [ ] The project does not claim affiliation with Official Trump ($TRUMP) or any other entity without written authorization.
- [ ] Wallet, signing, transaction, rewards, and accounting flows are disabled by default until threat modeling, negative tests, permission review, and independent technical review are complete.
- [ ] Token or economic behavior has a transparent specification covering supply, accounting, authority, pause/recovery behavior, user risks, and jurisdiction-specific review.
- [ ] Test networks and synthetic funds are used until the above evidence is complete.

## Release evidence packet

Every release candidate should attach:

1. the exact commit SHA and dependency lockfile;
2. CI links for all required checks;
3. dependency and secret-scan results;
4. database backup/restore drill results;
5. a change summary and rollback plan;
6. a list of known limitations with owners and review dates;
7. confirmation that public claims match verified behavior.

## Current blockers

As of the latest GitHub push, the repository has reported dependency exposure requiring triage. The last reported inventory contained **3 critical, 61 high, 100 moderate, and 13 low vulnerabilities**. Treat this as a blocker until refreshed and resolved through GitHub Security or an equivalent audited report.

The repository is therefore suitable for continued engineering-beta work and controlled local testing, not an unsupported production or investment-promotion claim.
