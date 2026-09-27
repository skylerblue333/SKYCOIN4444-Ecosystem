# Engineering quality contract: 10/10

A **10/10 area** is not a visual label. It is a release-quality evidence packet for a customer workflow.

## Required gates

| Gate | Evidence required |
| --- | --- |
| 1. Customer goal | A clear, accessible workflow with a useful empty state and next action |
| 2. Real action | A working server mutation/query or a clearly labeled read-only surface |
| 3. Persistence | Durable database or owned provider storage; no process-memory-only state |
| 4. Identity | Authentication, authorization, ownership checks, and safe unauthenticated behavior |
| 5. Failure handling | Loading, timeout, retry, validation, provider failure, and recovery states |
| 6. Tests | Unit/integration coverage for the core action and negative paths |
| 7. Security | Input validation, rate limits, audit trail, secret handling, and abuse controls |
| 8. Operations | Structured logs, health/readiness, metrics, alert owner, and rollback path |
| 9. Recovery | Backup/restore or provider recovery drill appropriate to the data risk |
| 10. Deployment | Reproducible build, staging smoke test, deployment target, and release evidence |

## Score guidance

- **1/10:** blocked dependency or unsafe to expose
- **2/10:** route/domain exists; customer action is not complete
- **3/10:** UI workflow exists but backend or persistence is incomplete
- **4/10:** engineering beta surface with partial implementation
- **5/10:** core action works in controlled testing with validation
- **6/10:** verified workflow with automated tests and failure states
- **7/10:** durable persistence, authorization, audit trail, and monitoring are present
- **8/10:** staging deployment and recovery drill are evidenced
- **9/10:** production-like reliability, security review, and rollback evidence are complete
- **10/10:** all required gates pass for the defined scope, with an owner and dated evidence packet

## Rules

1. Never increase a score because a page looks polished.
2. Never call a mock, placeholder, process-memory facade, or unconfigured provider live.
3. Financial, custody, identity, governance, and external-publication flows require additional authorization and independent review.
4. The automated quality gate blocks regressions; it does not certify production readiness.
5. Scores should increase only when the next gate is completed and its evidence is linked in the area record or release packet.
