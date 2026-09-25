import { readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { createTRPCClient, httpLink } from "@trpc/client";
import mysql from "mysql2/promise";
import superjson from "superjson";
import WebSocket from "ws";

const baseUrl = process.env.RUNTIME_BASE_URL || "http://127.0.0.1:3000";
const wsUrl = baseUrl.replace(/^http/, "ws") + "/ws/resilience";
const stateFile =
  process.env.RUNTIME_SESSION_STATE_FILE || ".runtime-session-state.json";
const reportFile = process.env.WAVE6_REPORT_FILE || "wave6-load-report.json";

const state = JSON.parse(await readFile(stateFile, "utf8"));
if (!state?.id || !state?.cookieHeader) {
  throw new Error("Runtime session state is missing id/cookieHeader");
}

function createClient(cookieHeader = null) {
  return createTRPCClient({
    links: [
      httpLink({
        url: `${baseUrl}/api/trpc`,
        transformer: superjson,
        async fetch(input, init) {
          const headers = new Headers(init?.headers);
          if (cookieHeader) headers.set("cookie", cookieHeader);
          return fetch(input, { ...(init ?? {}), headers });
        },
      }),
    ],
  });
}

function percentile(values, fraction) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  http: [],
  duplicateMutation: null,
  websocket: null,
};

async function runPool(label, total, concurrency, task, maxP95Ms = 4000) {
  let next = 0;
  const latencies = [];
  const errors = [];

  async function worker() {
    while (true) {
      const current = next++;
      if (current >= total) return;
      const started = performance.now();
      try {
        await task(current);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      } finally {
        latencies.push(performance.now() - started);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const p50 = percentile(latencies, 0.5);
  const p95 = percentile(latencies, 0.95);
  const result = {
    label,
    total,
    concurrency,
    succeeded: total - errors.length,
    failed: errors.length,
    p50Ms: Number(p50.toFixed(1)),
    p95Ms: Number(p95.toFixed(1)),
    maxP95Ms,
    sampleErrors: errors.slice(0, 5),
  };
  report.http.push(result);
  console.log(
    `${label}: ${result.succeeded}/${total} succeeded; p95=${result.p95Ms}ms`
  );

  if (errors.length) {
    throw new Error(`${label} had ${errors.length} failures: ${errors[0]}`);
  }
  if (p95 > maxP95Ms) {
    throw new Error(`${label} p95 ${p95.toFixed(1)}ms exceeded ${maxP95Ms}ms`);
  }
}

function waitForMessage(ws, predicate, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("WebSocket message timeout"));
    }, timeoutMs);

    const onMessage = raw => {
      try {
        const parsed = JSON.parse(raw.toString());
        if (!predicate(parsed)) return;
        cleanup();
        resolve(parsed);
      } catch {
        // Ignore unrelated malformed data in this transport-only test.
      }
    };
    const onError = error => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error("WebSocket closed before expected message"));
    };
    const cleanup = () => {
      clearTimeout(timer);
      ws.off("message", onMessage);
      ws.off("error", onError);
      ws.off("close", onClose);
    };

    ws.on("message", onMessage);
    ws.on("error", onError);
    ws.on("close", onClose);
  });
}

async function websocketRoundTrip(id) {
  const started = performance.now();
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.terminate();
      reject(new Error("WebSocket open timeout"));
    }, 4000);
    ws.once("open", () => {
      clearTimeout(timer);
      resolve();
    });
    ws.once("error", error => {
      clearTimeout(timer);
      reject(error);
    });
  });

  await waitForMessage(ws, msg => msg?.type === "ready");
  const pingId = `wave6-${id}`;
  ws.send(JSON.stringify({ type: "ping", id: pingId }));
  await waitForMessage(
    ws,
    msg => msg?.type === "pong" && msg?.id === pingId
  );

  await new Promise(resolve => {
    ws.once("close", resolve);
    ws.close(1000, "wave6 reconnect test");
  });

  return performance.now() - started;
}

async function main() {
  const publicClient = createClient();
  const authClient = createClient(state.cookieHeader);

  await runPool(
    "healthz",
    160,
    24,
    async () => {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.status !== 200) throw new Error(`healthz ${response.status}`);
      await response.arrayBuffer();
    },
    1500
  );

  await runPool(
    "readiness",
    80,
    12,
    async () => {
      const response = await fetch(`${baseUrl}/api/beta/readiness`);
      if (response.status !== 200) throw new Error(`readiness ${response.status}`);
      const body = await response.json();
      if (body.status !== "ready") throw new Error("readiness was not ready");
    },
    2500
  );

  await runPool(
    "feed-list",
    120,
    16,
    async () => {
      await publicClient.post.list.query({ limit: 10, offset: 0 });
    },
    3500
  );

  await runPool(
    "authenticated-identity",
    100,
    12,
    async () => {
      const user = await authClient.auth.me.query();
      if (String(user?.id) !== state.id) throw new Error("auth identity mismatch");
    },
    3500
  );

  await runPool(
    "protected-user",
    100,
    12,
    async () => {
      const user = await authClient.user.me.query();
      if (String(user?.id) !== state.id) throw new Error("protected identity mismatch");
    },
    3500
  );

  await runPool(
    "direct-message-history",
    100,
    12,
    async () => {
      await authClient.message.list.query({ userId: state.id });
    },
    3500
  );

  const post = await authClient.post.create.mutate({
    content: `Wave 6 duplicate-like invariant ${Date.now()}`,
  });
  if (!post?.id) throw new Error("Unable to create Wave 6 invariant post");

  try {
    await runPool(
      "duplicate-like-concurrency",
      32,
      16,
      async () => {
        const result = await authClient.post.like.mutate({ postId: String(post.id) });
        if (!result?.success) throw new Error("like mutation did not succeed");
      },
      4000
    );

    const db = await mysql.createConnection(process.env.DATABASE_URL);
    try {
      const [rows] = await db.execute(
        "SELECT COUNT(*) AS count FROM likes WHERE post_id = ? AND user_id = ?",
        [String(post.id), state.id]
      );
      const count = Number(rows?.[0]?.count ?? 0);
      report.duplicateMutation = {
        operation: "post.like",
        concurrentAttempts: 32,
        persistedRows: count,
      };
      if (count !== 1) {
        throw new Error(
          `Duplicate-like invariant failed: expected 1 persisted row, found ${count}`
        );
      }
    } finally {
      await db.end();
    }
  } finally {
    await authClient.post.delete.mutate({ postId: String(post.id) });
  }

  const reconnectLatencies = [];
  for (let attempt = 0; attempt < 6; attempt++) {
    reconnectLatencies.push(await websocketRoundTrip(`reconnect-${attempt}`));
  }

  const burst = await Promise.all(
    Array.from({ length: 24 }, (_, index) =>
      websocketRoundTrip(`burst-${index}`)
    )
  );
  const allWs = [...reconnectLatencies, ...burst];
  report.websocket = {
    endpoint: "/ws/resilience",
    sequentialReconnects: reconnectLatencies.length,
    concurrentConnections: burst.length,
    totalRoundTrips: allWs.length,
    p95Ms: Number(percentile(allWs, 0.95).toFixed(1)),
  };
  if (report.websocket.p95Ms > 4000) {
    throw new Error(
      `WebSocket round-trip p95 ${report.websocket.p95Ms}ms exceeded 4000ms`
    );
  }

  await writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
  console.log(`Wave 6 resilience report written to ${reportFile}`);
}

try {
  await main();
} catch (error) {
  report.failure = error instanceof Error ? error.message : String(error);
  await writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
  throw error;
}
