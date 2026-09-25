import { readFile, writeFile } from "node:fs/promises";
import { createTRPCClient, httpLink, TRPCClientError } from "@trpc/client";
import superjson from "superjson";

const mode = process.argv.slice(2).find(arg => arg !== "--") || "public";
const baseUrl = required("STAGING_BASE_URL").replace(/\/$/, "");
const expectedRelease = process.env.STAGING_EXPECTED_RELEASE || "";
const stateFile =
  process.env.STAGING_SESSION_STATE_FILE || ".staging-session-state.json";

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
    throw new Error("Hosted beta access did not set app_session_id");
  }
  return pair;
}

async function fetchJson(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { accept: "application/json" },
  });
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${path} returned non-JSON response (${response.status})`);
  }
  return { response, body };
}

function verifyRelease(label, release) {
  if (expectedRelease && release !== expectedRelease) {
    throw new Error(
      `${label} release mismatch: ${release ?? "null"} !== ${expectedRelease}`
    );
  }
}

async function publicChecks() {
  const health = await fetchJson("/healthz");
  if (health.response.status !== 200 || health.body?.status !== "alive") {
    throw new Error(`healthz failed: ${JSON.stringify(health.body)}`);
  }
  verifyRelease("healthz", health.body?.release);

  const readiness = await fetchJson("/readyz");
  if (readiness.response.status !== 200 || readiness.body?.status !== "ready") {
    throw new Error(`readyz failed: ${JSON.stringify(readiness.body)}`);
  }
  if (readiness.body?.services?.database?.ready !== true) {
    throw new Error("Hosted database readiness was not proven");
  }
  if (readiness.body?.services?.authentication?.ready !== true) {
    throw new Error("Hosted authentication readiness was not proven");
  }
  verifyRelease("readyz", readiness.body?.release);

  console.log(
    `Hosted public gate passed for release ${health.body?.release ?? "unknown"}`
  );
}

async function verifyAuthenticatedState(state) {
  const authenticated = createClient(state.cookieHeader);

  const authUser = await authenticated.auth.me.query();
  if (
    String(authUser?.id ?? "") !== state.id ||
    authUser?.email !== state.email
  ) {
    throw new Error("Hosted auth.me identity mismatch");
  }

  const protectedUser = await authenticated.user.me.query();
  if (
    String(protectedUser?.id ?? "") !== state.id ||
    protectedUser?.email !== state.email
  ) {
    throw new Error("Hosted protected user identity mismatch");
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
    throw new Error("Hosted non-admin session crossed the admin boundary");
  }

  const [cookieName, token = ""] = state.cookieHeader.split("=", 2);
  const jwtParts = token.split(".");
  if (jwtParts.length !== 3 || jwtParts[2].length === 0) {
    throw new Error("Hosted session cookie is not a three-part JWT");
  }
  jwtParts[2] =
    (jwtParts[2][0] === "a" ? "b" : "a") + jwtParts[2].slice(1);

  const tampered = createClient(`${cookieName}=${jwtParts.join(".")}`);
  let tamperRejected = false;
  try {
    await tampered.user.me.query();
  } catch (error) {
    tamperRejected =
      error instanceof TRPCClientError &&
      (error.data?.code === "UNAUTHORIZED" || error.data?.httpStatus === 401);
  }
  if (!tamperRejected) {
    throw new Error("Hosted tampered session was not rejected");
  }
}

async function seed() {
  await publicChecks();

  const accessKey = required("STAGING_BETA_ACCESS_KEY");
  const email = required("STAGING_EMAIL");
  let setCookie = null;
  const client = createClient(null, value => {
    setCookie = value;
  });

  const result = await client.auth.betaAccess.mutate({ email, accessKey });
  if (!result?.success || result?.authentication !== "beta_access_session") {
    throw new Error("Hosted beta-access procedure did not create a session");
  }
  if (!result.user?.id || result.user?.email !== email) {
    throw new Error("Hosted beta-access returned an unexpected identity");
  }
  if (!setCookie) throw new Error("Hosted beta-access returned no session cookie");

  const state = {
    id: String(result.user.id),
    email: result.user.email,
    cookieHeader: cookieHeaderFromSetCookie(setCookie),
    release: expectedRelease || null,
    createdAt: new Date().toISOString(),
  };

  await verifyAuthenticatedState(state);
  await writeFile(stateFile, JSON.stringify(state, null, 2) + "\n", {
    mode: 0o600,
  });
  console.log(`Hosted session seeded for user ${state.id}`);
}

async function verify() {
  await publicChecks();
  const state = JSON.parse(await readFile(stateFile, "utf8"));
  await verifyAuthenticatedState(state);
  console.log(`Hosted session survived for user ${state.id}`);
}

async function logout() {
  const state = JSON.parse(await readFile(stateFile, "utf8"));
  let setCookie = null;
  const authenticated = createClient(state.cookieHeader, value => {
    setCookie = value;
  });

  const result = await authenticated.auth.logout.mutate();
  if (!result?.success) throw new Error("Hosted logout did not report success");
  if (!setCookie?.includes("app_session_id=")) {
    throw new Error("Hosted logout did not clear app_session_id");
  }

  const normalized = setCookie.toLowerCase();
  if (
    !normalized.includes("max-age=0") &&
    !normalized.includes("max-age=-1") &&
    !normalized.includes("expires=")
  ) {
    throw new Error("Hosted logout cookie did not include expiry");
  }

  console.log("Hosted logout cleared app_session_id");
}

if (mode === "public") {
  await publicChecks();
} else if (mode === "seed") {
  await seed();
} else if (mode === "verify") {
  await verify();
} else if (mode === "logout") {
  await logout();
} else {
  throw new Error(
    "Usage: pnpm staging:verify -- <public|seed|verify|logout>"
  );
}
