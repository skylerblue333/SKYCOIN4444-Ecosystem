import { readFile, writeFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { SignJWT } from "jose";

const mode = process.argv[2];
const stateFile = process.env.RUNTIME_SESSION_STATE_FILE || ".runtime-session-state.json";
const baseUrl = process.env.RUNTIME_BASE_URL || "http://127.0.0.1:3000";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function unwrapTrpc(payload) {
  const data = payload?.result?.data;
  if (data && typeof data === "object" && "json" in data) return data.json;
  return data;
}

async function trpcQuery(path, token) {
  const response = await fetch(`${baseUrl}/api/trpc/${path}`, {
    headers: token ? { cookie: `app_session_id=${token}` } : {},
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`${path} returned non-JSON response (${response.status}): ${text.slice(0, 300)}`);
  }
  return { response, body, data: unwrapTrpc(body) };
}

async function seed() {
  const databaseUrl = required("DATABASE_URL");
  const jwtSecret = required("JWT_SECRET");
  const appId = required("VITE_APP_ID");
  const release = process.env.SKYCOIN_RELEASE_SHA || process.env.GITHUB_SHA || "local";
  const suffix = release.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16) || "local";
  const id = `ci-session-user-${suffix}`;
  const openId = `ci-session-openid-${suffix}`;
  const email = `ci-session-${suffix}@example.invalid`;
  const name = "CI Session Persistence User";

  const db = await mysql.createConnection(databaseUrl);
  try {
    await db.execute(
      `INSERT INTO users (id, open_id, email, name, login_method, role, last_signed_in)
       VALUES (?, ?, ?, ?, ?, 'user', NOW())
       ON DUPLICATE KEY UPDATE
         email = VALUES(email),
         name = VALUES(name),
         login_method = VALUES(login_method),
         role = 'user'`,
      [id, openId, email, name, "ci-runtime-session"]
    );
  } finally {
    await db.end();
  }

  const token = await new SignJWT({ openId, appId, name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(new TextEncoder().encode(jwtSecret));

  await writeFile(
    stateFile,
    JSON.stringify({ id, openId, email, name, token }),
    { mode: 0o600 }
  );
  console.log(`Seeded persisted runtime auth user ${id}`);
}

async function verify() {
  const databaseUrl = required("DATABASE_URL");
  const state = JSON.parse(await readFile(stateFile, "utf8"));

  const anonymous = await trpcQuery("auth.me");
  if (!anonymous.response.ok || anonymous.data !== null) {
    throw new Error(
      `Anonymous auth.me must return null: status=${anonymous.response.status} body=${JSON.stringify(anonymous.body)}`
    );
  }

  const authenticated = await trpcQuery("auth.me", state.token);
  if (!authenticated.response.ok) {
    throw new Error(
      `Authenticated auth.me failed: ${authenticated.response.status} ${JSON.stringify(authenticated.body)}`
    );
  }
  if (
    authenticated.data?.id !== state.id ||
    authenticated.data?.openId !== state.openId ||
    authenticated.data?.email !== state.email
  ) {
    throw new Error(
      `Authenticated identity mismatch: ${JSON.stringify(authenticated.data)}`
    );
  }

  const protectedUser = await trpcQuery("user.me", state.token);
  if (!protectedUser.response.ok) {
    throw new Error(
      `Protected user.me failed: ${protectedUser.response.status} ${JSON.stringify(protectedUser.body)}`
    );
  }
  if (
    protectedUser.data?.id !== state.id ||
    protectedUser.data?.openId !== state.openId
  ) {
    throw new Error(
      `Protected user identity mismatch: ${JSON.stringify(protectedUser.data)}`
    );
  }

  const tampered = `${state.token.slice(0, -1)}${state.token.endsWith("a") ? "b" : "a"}`;
  const rejected = await trpcQuery("user.me", tampered);
  if (rejected.response.status < 400) {
    throw new Error(
      `Tampered session unexpectedly authenticated: ${rejected.response.status} ${JSON.stringify(rejected.body)}`
    );
  }

  const db = await mysql.createConnection(databaseUrl);
  try {
    const [rows] = await db.execute(
      "SELECT id, open_id AS openId, email, last_signed_in AS lastSignedIn FROM users WHERE id = ? LIMIT 1",
      [state.id]
    );
    const user = rows[0];
    if (!user || user.id !== state.id || user.openId !== state.openId || user.email !== state.email) {
      throw new Error(`Persisted database identity mismatch: ${JSON.stringify(user)}`);
    }
    if (!user.lastSignedIn) {
      throw new Error("Authenticated request did not update persisted last_signed_in");
    }
  } finally {
    await db.end();
  }

  console.log(`Runtime session verified for persisted user ${state.id}`);
}

if (mode === "seed") {
  await seed();
} else if (mode === "verify") {
  await verify();
} else {
  throw new Error("Usage: node scripts/runtime-session-persistence.mjs <seed|verify>");
}
