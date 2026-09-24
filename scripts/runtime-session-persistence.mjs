import { readFile, writeFile } from "node:fs/promises";
import { createTRPCClient, httpLink, TRPCClientError } from "@trpc/client";
import mysql from "mysql2/promise";
import superjson from "superjson";

const mode = process.argv[2];
const stateFile =
  process.env.RUNTIME_SESSION_STATE_FILE || ".runtime-session-state.json";
const baseUrl = process.env.RUNTIME_BASE_URL || "http://127.0.0.1:3000";
const sessionEmail =
  process.env.RUNTIME_SESSION_EMAIL || "ci-session@example.invalid";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function createClient(cookieHeader = null, captureSetCookie = null) {
  return createTRPCClient({
    links: [
      httpLink({
        url: `${baseUrl}/api/trpc`,
        transformer: superjson,
        async fetch(input, init) {
          const headers = new Headers(init?.headers);
          if (cookieHeader) headers.set("cookie", cookieHeader);
          const response = await fetch(input, { ...(init ?? {}), headers });
          const setCookie = response.headers.get("set-cookie");
          if (setCookie && captureSetCookie) captureSetCookie(setCookie);
          return response;
        },
      }),
    ],
  });
}

function cookieHeaderFromSetCookie(setCookie) {
  const pair = setCookie.split(";", 1)[0]?.trim();
  if (!pair?.startsWith("app_session_id=")) {
    throw new Error(`Beta access response did not set app_session_id: ${setCookie}`);
  }
  return pair;
}

async function seed() {
  required("DATABASE_URL");
  const accessKey = required("BETA_ACCESS_KEY");
  let setCookie = null;
  const client = createClient(null, value => {
    setCookie = value;
  });

  const result = await client.auth.betaAccess.mutate({
    email: sessionEmail,
    accessKey,
  });

  if (!result?.success || result?.authentication !== "beta_access_session") {
    throw new Error(`Beta access did not create a session: ${JSON.stringify(result)}`);
  }
  if (!result.user?.id || result.user?.email !== sessionEmail) {
    throw new Error(`Beta access returned unexpected identity: ${JSON.stringify(result)}`);
  }
  if (!setCookie) throw new Error("Beta access did not return a Set-Cookie header");

  const cookieHeader = cookieHeaderFromSetCookie(setCookie);
  const baselineLastSignedIn = new Date("2000-01-01T00:00:00.000Z");

  const databaseUrl = required("DATABASE_URL");
  const db = await mysql.createConnection(databaseUrl);
  try {
    const [updateResult] = await db.execute(
      "UPDATE users SET last_signed_in = ? WHERE id = ?",
      [baselineLastSignedIn, String(result.user.id)]
    );
    if (!updateResult?.affectedRows) {
      throw new Error("Unable to establish last_signed_in verification baseline");
    }
  } finally {
    await db.end();
  }

  await writeFile(
    stateFile,
    JSON.stringify({
      id: String(result.user.id),
      email: result.user.email,
      name: result.user.name,
      cookieHeader,
      baselineLastSignedIn: baselineLastSignedIn.toISOString(),
    }),
    { mode: 0o600 }
  );

  console.log(`Created real beta-access runtime session for ${result.user.id}`);
}

async function verify() {
  const databaseUrl = required("DATABASE_URL");
  const state = JSON.parse(await readFile(stateFile, "utf8"));

  const anonymous = createClient();
  const anonymousUser = await anonymous.auth.me.query();
  if (anonymousUser !== null) {
    throw new Error(`Anonymous auth.me must return null: ${JSON.stringify(anonymousUser)}`);
  }

  const authenticated = createClient(state.cookieHeader);
  const authUser = await authenticated.auth.me.query();
  if (authUser?.id !== state.id || authUser?.email !== state.email) {
    throw new Error(`Authenticated identity mismatch: ${JSON.stringify(authUser)}`);
  }

  const protectedUser = await authenticated.user.me.query();
  if (protectedUser?.id !== state.id || protectedUser?.email !== state.email) {
    throw new Error(`Protected user identity mismatch: ${JSON.stringify(protectedUser)}`);
  }

  let adminRejected = false;
  try {
    await authenticated.admin.stats.query();
  } catch (error) {
    adminRejected =
      error instanceof TRPCClientError &&
      (error.data?.code === "FORBIDDEN" || error.data?.httpStatus === 403);
  }
  if (!adminRejected) {
    throw new Error("Non-admin beta user unexpectedly crossed the admin authorization boundary");
  }

  const [cookieName, token = ""] = state.cookieHeader.split("=", 2);
  const jwtParts = token.split(".");
  if (jwtParts.length !== 3 || jwtParts[2].length === 0) {
    throw new Error("Runtime session cookie is not a three-part JWT");
  }
  jwtParts[2] =
    (jwtParts[2][0] === "a" ? "b" : "a") + jwtParts[2].slice(1);
  const tampered = createClient(`${cookieName}=${jwtParts.join(".")}`);

  let rejected = false;
  try {
    await tampered.user.me.query();
  } catch (error) {
    rejected =
      error instanceof TRPCClientError &&
      (error.data?.code === "UNAUTHORIZED" || error.data?.httpStatus === 401);
  }
  if (!rejected) {
    throw new Error("Tampered session was not rejected by a protected route");
  }

  const db = await mysql.createConnection(databaseUrl);
  try {
    const [rows] = await db.execute(
      "SELECT id, open_id AS openId, email, last_signed_in AS lastSignedIn FROM users WHERE id = ? LIMIT 1",
      [state.id]
    );
    const user = rows[0];
    if (
      !user ||
      String(user.id) !== state.id ||
      user.openId !== state.id ||
      user.email !== state.email
    ) {
      throw new Error(`Persisted database identity mismatch: ${JSON.stringify(user)}`);
    }
    if (!user.lastSignedIn) {
      throw new Error("Authenticated request did not update persisted last_signed_in");
    }

    const baselineLastSignedIn = new Date(state.baselineLastSignedIn);
    const persistedLastSignedIn = new Date(user.lastSignedIn);
    if (
      !Number.isFinite(baselineLastSignedIn.getTime()) ||
      !Number.isFinite(persistedLastSignedIn.getTime()) ||
      persistedLastSignedIn.getTime() <= baselineLastSignedIn.getTime()
    ) {
      throw new Error(
        `Authenticated request did not advance persisted last_signed_in: baseline=${state.baselineLastSignedIn} current=${user.lastSignedIn}`
      );
    }
  } finally {
    await db.end();
  }

  console.log(`Runtime session verified for persisted user ${state.id}`);
}

async function logout() {
  const state = JSON.parse(await readFile(stateFile, "utf8"));
  let setCookie = null;
  const authenticated = createClient(state.cookieHeader, value => {
    setCookie = value;
  });
  const result = await authenticated.auth.logout.mutate();
  if (!result?.success) throw new Error("Logout procedure did not report success");
  if (!setCookie || !setCookie.includes("app_session_id=")) {
    throw new Error(`Logout did not clear the session cookie: ${setCookie}`);
  }
  const normalized = setCookie.toLowerCase();
  if (
    !normalized.includes("max-age=0") &&
    !normalized.includes("max-age=-1") &&
    !normalized.includes("expires=")
  ) {
    throw new Error(`Logout cookie did not contain an expiry directive: ${setCookie}`);
  }
  console.log("Logout response cleared app_session_id");
}

if (mode === "seed") {
  await seed();
} else if (mode === "verify") {
  await verify();
} else if (mode === "logout") {
  await logout();
} else {
  throw new Error(
    "Usage: node scripts/runtime-session-persistence.mjs <seed|verify|logout>"
  );
}
