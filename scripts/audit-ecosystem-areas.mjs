import fs from "node:fs";

const root = process.cwd();
const registryPath = `${root}/client/src/data/ecosystemAreas.ts`;
const routeCatalogPath = `${root}/client/src/data/routeCatalog.ts`;
const registry = fs.readFileSync(registryPath, "utf8");
const routeCatalog = fs.readFileSync(routeCatalogPath, "utf8");
const areas = [...registry.matchAll(/\{ id: "([^"]+)", label: "([^"]+)", description: "([^"]+)", status: "([^"]+)"/g)]
  .map(([, id, label, description, status]) => ({ id, label, description, status }));
if (areas.length !== 66) throw new Error(`Expected 66 areas, found ${areas.length}`);
const routeCount = (routeCatalog.match(/"route":/g) ?? []).length;
const counts = areas.reduce((acc, area) => { acc[area.status] = (acc[area.status] ?? 0) + 1; return acc; }, {});
const lines = [
  "# Ecosystem 66-Area Readiness",
  "",
  `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
  `**Tracked areas:** ${areas.length}`,
  `**Registered route capabilities:** ${routeCount}`,
  "",
  "> This is a conservative product-readiness inventory. A route, component, mock, or test file does not by itself prove a complete customer workflow, persistent data, production settlement, security review, or external provider integration.",
  "",
  "## Summary",
  "",
  "| Status | Areas | Meaning |",
  "| --- | ---: | --- |",
  `| Verified | ${counts.verified ?? 0} | Tested customer workflow with implementation evidence |`,
  `| Engineering beta | ${counts.beta ?? 0} | Implemented or partially implemented; verify dependencies before public launch |`,
  `| Planned work | ${counts.planned ?? 0} | Domain exists, but core customer actions still need backend or integration work |`,
  `| Blocked dependency | ${counts.blocked ?? 0} | Do not present as live until the required dependency is configured |`,
  "",
  "## Area matrix",
  "",
  "| # | Area | Readiness | Customer surface |",
  "| ---: | --- | --- | --- |",
  ...areas.map((area, index) => `| ${index + 1} | ${area.label} | ${area.status} | ${area.description} |`),
  "",
  "## Upgrade rule for every area",
  "",
  "1. **Discover:** expose the customer goal, not only an internal feature name.",
  "2. **Act:** provide a real mutation or clearly labeled read-only/preview action.",
  "3. **Persist:** use the database or owned provider; do not imply persistence from local state.",
  "4. **Recover:** include loading, empty, error, retry, permission, and provider-failure states.",
  "5. **Measure:** record the action and show relevant status, audit, or activity evidence.",
  "6. **Release:** move from planned/beta to verified only after tests, security review, and deployment evidence exist.",
  "",
  "## Current high-priority blockers",
  "",
  "- Live video needs a configured persistent HLS/WebRTC/RTMP ingest service for cross-user playback.",
  "- Payments, custody, settlement, and token-transfer paths require provider configuration, threat modeling, and independent review.",
  "- The repository still has a large dependency-alert inventory on GitHub and remains engineering beta.",
  "- In-memory feature facades must not be described as durable multi-instance production services.",
  "",
];
fs.writeFileSync(`${root}/docs/ECOSYSTEM_66_READINESS.md`, lines.join("\n"));
console.log(`Audited ${areas.length} areas and ${routeCount} route capabilities.`);
console.log(counts);
