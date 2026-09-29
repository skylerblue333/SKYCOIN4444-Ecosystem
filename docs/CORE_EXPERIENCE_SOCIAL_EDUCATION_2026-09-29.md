# Social + Education Core Experience Upgrade — 2026-09-29

## Scope

This change set strengthens the existing primary social and learning paths without creating
new product families or duplicating active HopeAI/SkyHope and gaming branches.

### Social

- `/socialmedia` now uses the canonical persisted `post` and `user` tRPC contracts.
- Post creation, feed loading, comments, likes/unlikes, owned-post deletion, user stats, and
  hashtag trends are backed by the current database helpers.
- The previous UI's calls to a non-mounted `trpc.social` namespace were removed.
- Simulated creator/follower/trending totals and silent HopeAI behavioral-inference claims
  are not presented as live state.
- Persistence regression coverage verifies posts, comments, comment counts, idempotent likes,
  and unlike behavior.

### Education

- Existing links to `/school/course/:id` and `/school/lesson/:id` now resolve.
- `/learn` aliases the current SkySchool curriculum entry point.
- Lesson completion and lesson notes are persisted in browser local storage so they survive
  refresh on the same browser.
- The learning dashboard derives its metrics from that browser-local progress instead of
  hard-coded enrollments, XP, and certificates.
- Placeholder downloads, simulated discussion posts, and unbacked "XP earned", token reward,
  or on-chain certificate claims were removed or relabeled as preview metadata.

## Integration boundaries

HopeAI/SkyHope/charity work is intentionally left to the active
`upgrade/hope-charity-core-paths-2026-09-29` branch. Gaming quality work is intentionally
left to `upgrade/gaming-quality-2026-09-29`. This branch does not compete with those owners.

The existing `server/skyschool-gaming-router.ts` is not mounted by this change. It references
`sky_school_*` tables that are not currently established by the canonical Drizzle schema /
migration path inspected for this upgrade. Browser-local learning progress is therefore a
truthful interim boundary rather than a claim of account-synced persistence.

## Limitations

- Learning progress in this change is device/browser-local, not account-synced.
- No token, wallet, payment, blockchain, certificate, or credential issuance is performed.
- Social posting requires the existing authenticated beta session for mutations.
- The social feed shows stored user IDs because this change does not invent an author-profile
  join that is not present in the current post query.
- Communities and messaging remain separate existing surfaces.
- HopeAI provider connectivity, charity settlement/donation processing, and real-money gaming
  are outside this branch and require their own verified integration evidence.

## Verification target

A merge is valid only after the exact PR head passes the repository's applicable tests,
production build, runtime/release gates, and the merged default branch contains the changes.
