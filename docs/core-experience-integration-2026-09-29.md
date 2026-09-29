# Core Experience Integration — 2026-09-29

This upgrade connects the current primary SKYCOIN4444 beta experiences without creating competing implementations for active HopeAI/SkyHope or game-lobby work.

## Priority paths

The shared core experience rail intentionally keeps these paths first:

1. HopeAI — `/hopeai`
2. SkyHope / Charity — `/charity`
3. Social — `/socialmedia`
4. Games — `/gaming`
5. Learn — `/skyschool`
6. Messages — `/messages`
7. Live — `/live`

The rail is designed for the primary product pages so users can move between AI, impact, community, play, and learning without opening the full route directory.

## Truth boundaries

All entries are labeled as engineering-beta capabilities. This integration does **not** claim live token settlement, prize funding, donation settlement, identity verification, external AI-provider availability, compliance certification, or production readiness.

Static discovery prompts and curriculum metadata must not be presented as live user counts, verified trend metrics, funded rewards, or completed settlement history unless a configured backend provides that evidence.

## Regression contract

`tests/core-experience-navigation.test.ts` locks the priority ordering, required primary paths, unique routes, and engineering-beta stage label.
