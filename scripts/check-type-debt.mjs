import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const baselinePath =
  process.env.TYPE_DEBT_BASELINE_FILE || "ci/type-debt-baseline.txt";
const reportPath =
  process.env.TYPE_DEBT_REPORT_FILE || "typecheck.log";

const baseline = Number.parseInt(readFileSync(baselinePath, "utf8").trim(), 10);
if (!Number.isFinite(baseline)) {
  console.error(`Invalid TypeScript debt baseline in ${baselinePath}`);
  process.exitCode = 2;
} else {
  const result = spawnSync("pnpm", ["check"], {
    encoding: "utf8",
    env: process.env,
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.error) {
    console.error("Unable to run TypeScript check:", result.error);
    process.exitCode = 2;
  } else {
    const output = `${result.stdout || ""}${result.stderr || ""}`;
    writeFileSync(reportPath, output, "utf8");

    const matches = output.match(/error TS\d+:/g) || [];
    const errors = matches.length;

    console.log(
      `TypeScript debt: ${errors} errors (baseline: ${baseline}); full report: ${reportPath}`
    );

    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(
        process.env.GITHUB_OUTPUT,
        `errors=${errors}\nbaseline=${baseline}\nreport=${reportPath}\n`
      );
    }

    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        [
          "### TypeScript stabilization debt",
          `Current compiler error count: **${errors}**`,
          `Checked-in no-regression baseline: **${baseline}**`,
          `Full compiler report artifact: **${reportPath}**`,
          errors === 0
            ? "TypeScript debt is fully resolved."
            : "Beta stabilization may continue only while this count does not increase.",
          "",
        ].join("\n")
      );
    }

    if (errors > baseline) {
      console.error(
        `TypeScript debt regressed by ${errors - baseline} errors.`
      );
      process.exitCode = 1;
    } else if (errors === 0 && result.status !== 0) {
      console.error(
        `TypeScript debt measurement failed before compiler diagnostics were produced (exit ${result.status ?? "unknown"}).`
      );
      if (output.trim()) console.error(output.trim());
      process.exitCode = 2;
    } else {
      if (errors < baseline) {
        console.log(
          `TypeScript debt improved by ${baseline - errors} errors. Update the baseline downward after review.`
        );
      }
      process.exitCode = 0;
    }
  }
}
