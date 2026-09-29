# Core Experience Integration — 2026-09-29

This upgrade provides shared core-path infrastructure and a current-main Gaming integration while yielding direct HopeAI, SkyHope, Social, and SkySchool page ownership to active PR #73.

## Priority paths

The shared core experience registry intentionally keeps these paths first:

1. HopeAI — `/hopeai`
2. SkyHope / Charity — `/charity`
3. Social — `/socialmedia`
4. Games — `/gaming`
5. Learn — `/skyschool`
6. Messages — `/messages`
7. Live — `/live`

The reusable rail keeps AI, impact, community, play, learning, messaging, and live experiences discoverable without duplicating the direct page work being completed in PR #73.

## Current integration ownership

- PR #73 owns direct edits to HopeAI, Charity/SkyHope, SocialMedia, SkySchool, and global Navigation.
- This PR owns the shared core-experience registry/rail, current-main Gaming landing-page integration, route corrections, regression contract, and this integration documentation.
- Game-specific GameLobby/GameCrash work remains with PR #65.

## Truth boundaries

All registry entries are labeled as engineering-beta capabilities. This integration does **not** claim live token settlement, prize funding, donation settlement, identity verification, external AI-provider availability, compliance certification, or production readiness.

Gaming reward, prize, and token language must not imply funded pools, cash value, custody, or blockchain settlement unless configured services and release evidence prove those capabilities.

## Regression contract

`tests/core-experience-navigation.test.ts` locks the HopeAI/SkyHope priority ordering, required primary paths, unique routes, and engineering-beta stage label.
