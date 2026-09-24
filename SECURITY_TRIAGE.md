# Dependency Security Triage

**Updated:** 2026-09-24

This is a maintainer record for dependency remediation. It is not a security certification. Run the audit again after every lockfile or dependency change.

## Verified local findings

The current locked graph reports no high-severity findings through `pnpm audit --audit-level high`, but it still reports **21 low/moderate advisories**. GitHub’s remote dependency scan has reported a larger set, including critical/high findings; the two inventories are not currently reconciled.

| Package path | Resolved version | Issue | Planned action |
| --- | ---: | --- | --- |
| `monaco-editor → dompurify` | `3.2.7` | Multiple XSS/sanitization bypass advisories | Upgrade `monaco-editor` when a compatible patched dependency is available; otherwise isolate the editor, prohibit untrusted HTML, and add a direct compatibility test before forcing a transitive replacement. |
| `@solana/web3.js → jayson → uuid` | `8.3.2` | Missing buffer bounds checks in selected UUID APIs | Upgrade the parent chain or verify API compatibility before forcing `uuid >= 11.1.1`; add tests for every UUID code path used by the application. |
| `@solana/web3.js → jayson → stream-json` | `1.9.1` | Nested-input algorithmic denial of service | Upgrade the parent chain or move JSON parsing behind bounded input size/depth controls; target `stream-json >= 3.5.0` only after compatibility testing. |
| `drizzle-kit → @esbuild-kit/core-utils → esbuild` | `0.18.20` | Development-server request/CORS issue | Upgrade or replace the legacy loader path; never expose a development server to untrusted networks. Target `esbuild >= 0.25.0` only after verifying migration and database tooling behavior. |

## Required reconciliation

1. Export GitHub’s Dependabot/SBOM data with a token that has repository security-read permission.
2. Compare the GitHub dependency graph with `pnpm-lock.yaml` at the exact commit SHA.
3. Classify each alert as direct, transitive, dev-only, production-reachable, or false positive.
4. Open a focused change for one parent chain at a time.
5. Run frozen install, audit, typecheck, tests, build, and a smoke test after each change.
6. Record accepted residual risk with an owner and expiry; never suppress an alert without a written reason.

## Immediate mitigations

Until the parent packages are upgraded:

- Do not expose Vite, esbuild, database tooling, or other development servers to public networks.
- Do not pass attacker-controlled HTML or template configuration into DOMPurify or Monaco editor features.
- Bound JSON request size and nesting depth before any `stream-json` processing.
- Treat all wallet, UUID, RPC, and transaction inputs as untrusted and validate them before use.
- Keep signing, custody, rewards, and token-transfer flows disabled in production-like environments until their threat model and tests are reviewed.

## Release rule

The ecosystem remains **engineering beta** until GitHub’s critical/high findings are reconciled and remediated or explicitly accepted by an identified maintainer. A clean local audit alone is not sufficient evidence when the authoritative GitHub security inventory disagrees.
