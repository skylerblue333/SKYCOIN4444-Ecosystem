import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const output = process.env.RC_EVIDENCE_FILE || "release-candidate-evidence.json";
const sha = process.env.GITHUB_SHA || process.env.RC_SHA;
if (!sha) throw new Error("GITHUB_SHA or RC_SHA is required");

const requiredFiles = [
  "dist/index.js",
  "rc-browser-smoke.json",
  "rc-browser-smoke.png",
  "rc-input/typecheck/typecheck.log",
  "rc-input/wave6/wave6-load-report.json",
  "rc-input/runtime/runtime-smoke.log",
  "RELEASE_CANDIDATE.md",
  "RELEASE_NOTES_v1.0.0-beta.1.md",
  "ci/type-debt-baseline.txt",
];

for (const file of requiredFiles) {
  await access(file);
}

async function sha256(file) {
  const bytes = await readFile(file);
  return createHash("sha256").update(bytes).digest("hex");
}

const browser = JSON.parse(await readFile("rc-browser-smoke.json", "utf8"));
const load = JSON.parse(
  await readFile("rc-input/wave6/wave6-load-report.json", "utf8")
);
const typeDebtBaseline = Number(
  (await readFile("ci/type-debt-baseline.txt", "utf8")).trim()
);

if (!browser.freshProfile || !browser.sessionSurvivedReload) {
  throw new Error("Clean-browser RC evidence is incomplete");
}
if ((load?.http || []).some(check => check.failed !== 0)) {
  throw new Error("Wave 6 load evidence contains HTTP failures");
}
if (load?.websocket?.totalRoundTrips !== 30) {
  throw new Error("Expected 30 Wave 6 WebSocket round trips");
}
if (load?.duplicateMutation?.persistedRows !== 1) {
  throw new Error("Duplicate-sensitive persisted-row invariant is not 1");
}

const wave7HostedProven = process.env.RC_WAVE7_HOSTED_PROVEN === "true";

const files = {};
for (const file of requiredFiles) {
  files[file] = {
    sha256: await sha256(file),
  };
}

const manifest = {
  schemaVersion: 1,
  candidate: "v1.0.0-beta.1-rc1",
  exactSha: sha,
  githubRunId: process.env.GITHUB_RUN_ID || null,
  githubRunNumber: process.env.GITHUB_RUN_NUMBER || null,
  generatedAt: new Date().toISOString(),
  source: {
    repository: process.env.GITHUB_REPOSITORY || "skylerblue333/SKYCOIN4444-Ecosystem",
    ref: process.env.GITHUB_REF || null,
  },
  gates: {
    dependencyAudit: "passed-via-needs",
    typeDebtNoRegression: "passed-via-needs",
    tests: "passed-via-needs",
    productionBuild: "passed-via-needs",
    runtimeSmokeAndResilience: "passed-via-needs",
    dockerImage: "passed-via-needs",
    cleanBrowserFreshAccount: "passed",
    wave6LoadEvidence: "verified",
    wave7HostedDeploymentRollback: wave7HostedProven ? "verified" : "pending",
  },
  typeDebtBaseline,
  browser: {
    freshProfile: browser.freshProfile,
    sessionSurvivedReload: browser.sessionSurvivedReload,
    finalPath: browser.finalPath,
  },
  resilience: {
    duplicatePersistedRows: load.duplicateMutation.persistedRows,
    websocketRoundTrips: load.websocket.totalRoundTrips,
    websocketP95Ms: load.websocket.p95Ms,
  },
  promotion: {
    readyForHostedSoak: wave7HostedProven,
    blocker: wave7HostedProven
      ? null
      : "Wave 7 hosted deployment/restart/rollback evidence is not yet recorded.",
  },
  files,
};

await writeFile(output, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `Release-candidate evidence created for ${sha}; hosted-soak-ready=${manifest.promotion.readyForHostedSoak}`
);
