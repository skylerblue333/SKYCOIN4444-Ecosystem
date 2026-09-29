# Social + Education Beta Contract

This document records the verified behavior introduced by the 2026-09-29
Social and SkySchool upgrade.

## Social

The primary Social page now uses the canonical `post.*` and `user.*`
tRPC contracts instead of a nonexistent `social.*` namespace.

Verified persisted actions:

- create a post;
- list recent posts;
- list posts from accounts the signed-in user follows;
- add a like using the canonical idempotent like record;
- add and read comments;
- follow another user;
- derive follower/following/post counts from persisted relationships;
- derive trending hashtags from persisted recent post content.

The page no longer fills empty states with fabricated creator accounts,
follower totals, or hard-coded trending popularity. Unsupported repost,
bookmark, private-post, media-upload, and AI-draft success controls were removed
from the primary feed rather than presented as completed features.

## Education

SkySchool now exposes a deterministic curriculum service through
`education.*`.

The first verified curriculum set contains four courses:

1. Blockchain Foundations
2. Practical AI & HopeAI Literacy
3. Building a Dependable Software Beta
4. Community & Charity Product Safety

Each course includes:

- learning outcomes;
- three substantive lessons;
- lesson objectives and explanatory content;
- a five-question knowledge check;
- server-side deterministic grading;
- answer explanations revealed only after grading.

Public course payloads intentionally omit answer keys and grading explanations
until submission.

## Learning progress boundary

Lesson completion and the most recent quiz result are saved to browser
`localStorage` only.

This is useful device-local progress, but it is **not** claimed as:

- durable account-synced learning history;
- an accredited credential;
- a verified certificate;
- a token/reward entitlement;
- cross-device persistence.

The UI labels those limits directly. A future server-side learning record
should be introduced only with a canonical schema, ownership rules, migration
plan, and persistence tests.

## Cross-ecosystem navigation

The upgraded Social and SkySchool surfaces include direct paths to:

- HopeAI;
- SkyHope / Charity;
- Social;
- Gaming;
- Learning.

Global navigation itself is owned by a separate active branch/PR and is not
duplicated here.

## Tests

`server/education-core.test.ts` verifies:

- deterministic unique course IDs;
- minimum curriculum/quiz depth;
- no answer-key leakage in public course payloads;
- deterministic 100% grading for known-correct answers;
- explanations after grading;
- clean handling of missing answers and unknown courses.

Repository-wide CI remains the merge gate for TypeScript debt, tests,
production build, Docker, runtime resilience, and release-candidate evidence.
