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
  if (!setCookie) {
    throw new Error("Beta access did not return a Set-Cookie header");
  }

  const cookieHeader = cookieHeaderFromSetCookie(setCookie);
  await writeFile(
    stateFile,
    JSON.stringify({
      id: String(result.user.id),
      email: result.user.email,
      name: result.user.name,
      cookieHeader,
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
    throw new Error(
      `Anonymous auth.me must return null: ${JSON.stringify(anonymousUser)}`
    );
  }

  const authenticated = createClient(state.cookieHeader);
  const authUser = await authenticated.auth.me.query();
  if (
    authUser?.id !== state.id ||
    authUser?.email !== state.email
  ) {
    throw new Error(
      `Authenticated identity mismatch: ${JSON.stringify(authUser)}`
    );
  }

  const protectedUser = await authenticated.user.me.query();
  if (
    protectedUser?.id !== state.id ||
    protectedUser?.email !== state.email
  ) {
    throw new Error(
      `Protected user identity mismatch: ${JSON.stringify(protectedUser)}`
    );
  }

  const [cookieName, token = ""] = state.cookieHeader.split("=", 2);
  const tamperedToken =
    token.length > 2
      ? `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`
      : `${token}tampered`;
  const tampered = createClient(`${cookieName}=${tamperedToken}`);

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
      throw new Error(
        `Persisted database identity mismatch: ${JSON.stringify(user)}`
      );
    }
    if (!user.lastSignedIn) {
      throw new Error(
        "Authenticated request did not update persisted last_signed_in"
      );
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
  throw new Error(
    "Usage: node scripts/runtime-session-persistence.mjs <seed|verify>"
  );
}
