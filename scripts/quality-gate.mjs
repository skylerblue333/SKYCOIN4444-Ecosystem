import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseline = JSON.parse(fs.readFileSync(path.join(root, "quality-baseline.json"), "utf8"));
const registry = fs.readFileSync(path.join(root, "client/src/data/ecosystemAreas.ts"), "utf8");
const app = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const catalog = fs.readFileSync(path.join(root, "client/src/data/routeCatalog.ts"), "utf8");
const pagesDir = path.join(root, "client/src/pages");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}
function countFilesContaining(files, pattern) {
  return files.filter(file => pattern.test(fs.readFileSync(file, "utf8"))).length;
}

const pageFiles = walk(pagesDir).filter(file => /\.(tsx|ts)$/.test(file));
const placeholderPattern = /feature coming soon|No data available\. Start by creating|coming soon/i;
const mockPattern = /mock data|Mock data|return \[\]/;
const placeholderPages = countFilesContaining(pageFiles, placeholderPattern);
const mockMarkers = countFilesContaining([...walk(path.join(root, "client/src")), ...walk(path.join(root, "server"))].filter(file => /\.(tsx?|mjs)$/.test(file)), mockPattern);
const areaRecords = [...registry.matchAll(/\{ id: "([^"]+)", label: "([^"]+)", description: "([^"]+)", status: "(verified|beta|planned|blocked)", statusDescription: "([^"]+)", lifecycle: "engineering-beta", maturityScore: (\d+), targetScore: 10, nextGate: "([^"]+)" \}/g)];
const routeCount = (catalog.match(/"route":/g) ?? []).length;
const routeCountFromApp = (app.match(/<Route /g) ?? []).length;
const checks = [
  { name: "area registry has exactly 66 complete engineering-beta records", pass: areaRecords.length === 66 },
  { name: "area IDs are unique", pass: new Set(areaRecords.map(match => match[1])).size === 66 },
  { name: "maturity scores are within 1–10", pass: areaRecords.every(match => Number(match[6]) >= 1 && Number(match[6]) <= 10) },
  { name: "route catalog is populated", pass: routeCount >= 900 },
  { name: "route catalog and app route counts are close", pass: Math.abs(routeCount - routeCountFromApp) <= 400 },
  { name: "all placeholder markers are removed", pass: placeholderPages === 0 },
  { name: "mock markers do not regress", pass: mockMarkers <= baseline.mockMarkers },
];
const failed = checks.filter(check => !check.pass);
const report = {
  generatedAt: new Date().toISOString(),
  status: failed.length ? "failed" : "passed",
  counts: { areas: areaRecords.length, routeCatalog: routeCount, appRoutes: routeCountFromApp, placeholderPages, mockMarkers },
  baseline,
  checks,
};
fs.writeFileSync(path.join(root, "quality-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (failed.length) process.exitCode = 1;
