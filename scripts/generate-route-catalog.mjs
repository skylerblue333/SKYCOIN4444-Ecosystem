import fs from 'node:fs';

const repo = process.cwd();
const app = fs.readFileSync(`${repo}/client/src/App.tsx`, 'utf8');
const seen = new Set();
const entries = [];
const categoryRules = [
  ['AI', /ai|agent|brain|hope|persona|prompt|model|intelligen|automation|copilot/i],
  ['Community', /chat|social|community|friend|dating|comment|message|profile|creator|stream|video|story|feed|follow/i],
  ['Money & Web3', /wallet|token|coin|crypto|block|chain|staking|swap|trade|market|yield|defi|ico|payment|billing|finance|cash|budget|bank|reward|earn/i],
  ['Build & Admin', /admin|api|code|developer|webhook|workflow|project|team|workspace|analytics|audit|security|compliance|monitor|log|backup|database/i],
  ['Learn & Play', /school|course|lesson|learn|game|arcade|tournament|quiz|simulator|challenge|achievement|badge|spin/i],
  ['Tools & Utilities', /calendar|calculator|editor|upload|search|settings|about|help|support|map|travel|booking|store|shop|order/i],
];
function title(route) {
  const raw = route.replace(/^\//, '').replace(/[-_]+/g, ' ').trim();
  if (!raw) return 'Home';
  return raw.replace(/\b\w/g, c => c.toUpperCase());
}
function category(route) {
  return categoryRules.find(([, re]) => re.test(route))?.[0] ?? 'Explore';
}
function intent(cat) {
  return {
    'AI': 'Ask, create, automate, or explore intelligence tools',
    'Community': 'Connect, publish, watch, or collaborate with people',
    'Money & Web3': 'Review balances, markets, assets, or economic tools',
    'Build & Admin': 'Configure, measure, secure, or operate the platform',
    'Learn & Play': 'Learn a skill, complete a challenge, or play a game',
    'Tools & Utilities': 'Use a focused utility to complete a task',
    'Explore': 'Discover another capability in the ecosystem',
  }[cat];
}
for (const match of app.matchAll(/<Route\s+path="([^"]+)"\s+component=\{([A-Za-z0-9_]+)\}/g)) {
  const [, route, component] = match;
  if (route === '*' || seen.has(route)) continue;
  seen.add(route);
  const cat = category(route);
  entries.push({ id: route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home', route, label: title(route), category: cat, intent: intent(cat), component });
}
entries.sort((a, b) => a.label.localeCompare(b.label) || a.route.localeCompare(b.route));
const output = `/**\n * Generated from App.tsx. Run pnpm catalog:routes after adding routes.\n * This catalog powers customer discovery without pretending every route is production-ready.\n */\nexport type RouteCapability = {\n  id: string;\n  route: string;\n  label: string;\n  category: string;\n  intent: string;\n  component: string;\n};\n\nexport const ROUTE_CAPABILITIES: RouteCapability[] = ${JSON.stringify(entries, null, 2)};\n`;
fs.writeFileSync(`${repo}/client/src/data/routeCatalog.ts`, output);
console.log(`generated ${entries.length} route capabilities`);
