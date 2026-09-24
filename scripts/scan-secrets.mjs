import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const tracked = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const skipPrefixes = ["build-output/", "dist/", "node_modules/"];
const skipFiles = new Set(["pnpm-lock.yaml", "scripts/scan-secrets.mjs"]);
const binaryExtensions =
  /\.(?:png|jpe?g|gif|webp|ico|pdf|zip|gz|tgz|woff2?|ttf|eot|mp4|mp3|wav)$/i;

const patterns = [
  {
    name: "AWS access key",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: "GitHub token",
    regex: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g,
  },
  {
    name: "Stripe live secret",
    regex: /\bsk_live_[A-Za-z0-9]{16,}\b/g,
  },
  {
    name: "OpenAI-style secret",
    regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/g,
  },
  {
    name: "SendGrid secret",
    regex: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g,
  },
  {
    name: "Private key material",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
];

const placeholderMarkers = [
  "placeholder",
  "example",
  "mockkeyfortestingonly",
  "replace_with",
  "your_",
  "changeme",
];

function isPlaceholder(line) {
  const lower = line.toLowerCase();
  return placeholderMarkers.some(marker => lower.includes(marker));
}

function redact(value) {
  if (value.length <= 12) return "[redacted]";
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

const findings = [];

for (const path of tracked) {
  if (
    skipFiles.has(path) ||
    skipPrefixes.some(prefix => path.startsWith(prefix)) ||
    binaryExtensions.test(path)
  ) {
    continue;
  }

  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    continue;
  }

  if (text.includes("\0")) continue;

  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (isPlaceholder(line)) return;

    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      for (const match of line.matchAll(pattern.regex)) {
        findings.push({
          path,
          line: index + 1,
          type: pattern.name,
          sample: redact(match[0]),
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Potential committed secrets detected:");
  for (const finding of findings) {
    console.error(
      `- ${finding.path}:${finding.line} [${finding.type}] ${finding.sample}`
    );
  }
  process.exit(1);
}

console.log(
  `Secret scan passed: ${tracked.length} tracked files checked with high-confidence patterns.`
);
