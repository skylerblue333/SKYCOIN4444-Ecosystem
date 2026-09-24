import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const baselinePath = process.env.TYPE_DEBT_BASELINE_FILE || "ci/type-debt-baseline.txt";
const baseline = Number.parseInt(readFileSync(baselinePath, "utf8").trim(), 10);
if (!Number.isFinite(baseline)) {
  console.error(`Invalid TypeScript debt baseline in ${baselinePath}`);
  process.exit(2);
}

const result = spawnSync("pnpm", ["check"], {
  encoding: "utf8",
  env: process.env,
  maxBuffer: 64 * 1024 * 1024,
});

const output = `${result.stdout || ""}${result.stderr || ""}`;
process.stdout.write(output);

const matches = output.match(/error TS\d+:/g) || [];
const errors = matches.length;

console.log(`\nTypeScript debt: ${errors} errors (baseline: ${baseline})`);

if (process.env.GITHUB_OUTPUT) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_OUTPUT, `errors=${errors}\nbaseline=${baseline}\n`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      "### TypeScript stabilization debt",
      `Current compiler error count: **${errors}**`,
      `Checked-in no-regression baseline: **${baseline}**`,
      errors === 0
        ? "TypeScript debt is fully resolved."
        : "Beta stabilization may continue only while this count does not increase.",
      "",
    ].join("\n")
  );
}

if (errors > baseline) {
  console.error(`TypeScript debt regressed by ${errors - baseline} errors.`);
  process.exit(1);
}

if (errors < baseline) {
  console.log(`TypeScript debt improved by ${baseline - errors} errors. Update the baseline downward after review.`);
}

process.exit(0);
