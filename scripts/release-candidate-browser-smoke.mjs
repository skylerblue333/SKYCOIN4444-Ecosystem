import { execFileSync, spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createTRPCClient, httpLink } from "@trpc/client";
import superjson from "superjson";
import WebSocket from "ws";

const baseUrl = (process.env.RC_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const email = process.env.RC_EMAIL || "rc-clean-account@example.invalid";
const accessKey = required("RC_BETA_ACCESS_KEY");
const reportFile = process.env.RC_BROWSER_REPORT_FILE || "rc-browser-smoke.json";
const screenshotFile = process.env.RC_BROWSER_SCREENSHOT_FILE || "rc-browser-smoke.png";
const debugPort = Number(process.env.RC_CHROME_DEBUG_PORT || "9222");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  return execFileSync(
    "bash",
    ["-lc", "command -v google-chrome || command -v chromium-browser || command -v chromium"],
    { encoding: "utf8" }
  ).trim();
}

async function waitForHttp(url, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function createCdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();

  ws.on("message", raw => {
    const message = JSON.parse(raw.toString());
    if (!message.id) return;
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(JSON.stringify(message.error)));
    else waiter.resolve(message.result);
  });

  const opened = new Promise((resolve, reject) => {
    ws.once("open", resolve);
    ws.once("error", reject);
  });

  return {
    opened,
    async call(method, params = {}) {
      await opened;
      const id = nextId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      ws.close();
    },
  };
}

async function waitForExpression(cdp, expression, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await cdp.call("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result?.result?.value) return result.result.value;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for browser expression: ${expression}`);
}

async function waitForChromeExit(child, timeoutMs = 5000) {
  if (child.exitCode !== null) return;

  let exited = false;
  const exitPromise = new Promise(resolve => {
    child.once("exit", () => {
      exited = true;
      resolve();
    });
  });

  child.kill("SIGTERM");
  await Promise.race([
    exitPromise,
    new Promise(resolve => setTimeout(resolve, timeoutMs)),
  ]);

  if (!exited && child.exitCode === null) {
    child.kill("SIGKILL");
    await Promise.race([
      exitPromise,
      new Promise(resolve => setTimeout(resolve, 2000)),
    ]);
  }
}

async function removeBrowserProfile(directory) {
  let lastError;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await rm(directory, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
      return;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
  throw lastError;
}

function trpcClient(cookieHeader) {
  return createTRPCClient({
    links: [
      httpLink({
        url: `${baseUrl}/api/trpc`,
        transformer: superjson,
        async fetch(input, init) {
          const headers = new Headers(init?.headers);
          headers.set("cookie", cookieHeader);
          return fetch(input, { ...(init ?? {}), headers });
        },
      }),
    ],
  });
}

const profileDir = await mkdtemp(join(tmpdir(), "skycoin-rc-browser-"));
const chromePath = findChrome();
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

let cdp;
try {
  await waitForHttp(`http://127.0.0.1:${debugPort}/json/version`);
  const targetResponse = await fetch(
    `http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" }
  );
  if (!targetResponse.ok) {
    throw new Error(`Unable to create Chrome target: ${targetResponse.status}`);
  }
  const target = await targetResponse.json();
  cdp = createCdpClient(target.webSocketDebuggerUrl);

  await cdp.call("Page.enable");
  await cdp.call("Runtime.enable");
  await cdp.call("Network.enable");

  await cdp.call("Page.navigate", { url: `${baseUrl}/signin` });
  await waitForExpression(
    cdp,
    `document.readyState === "complete" && document.body.innerText.includes("Beta Access")`
  );

  const cleanCookies = await cdp.call("Network.getAllCookies");
  if ((cleanCookies.cookies || []).some(cookie => cookie.name === "app_session_id")) {
    throw new Error("Fresh browser profile unexpectedly contained app_session_id");
  }

  const formResult = await cdp.call("Runtime.evaluate", {
    expression: `(() => {
      const setValue = (name, value) => {
        const input = document.querySelector('input[name="' + name + '"]');
        if (!input) throw new Error('Missing input ' + name);
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setValue('email', ${JSON.stringify(email)});
      setValue('accessKey', ${JSON.stringify(accessKey)});
      const form = document.querySelector('form');
      if (!form) throw new Error('Missing beta access form');
      form.requestSubmit();
      return true;
    })()`,
    returnByValue: true,
  });
  if (formResult?.exceptionDetails) {
    throw new Error("Unable to submit beta access form");
  }

  await waitForExpression(cdp, `window.location.pathname === "/"`, 20_000);
  await waitForExpression(cdp, `document.readyState === "complete"`);

  const cookiesAfterLogin = await cdp.call("Network.getAllCookies");
  const sessionCookie = (cookiesAfterLogin.cookies || []).find(
    cookie => cookie.name === "app_session_id"
  );
  if (!sessionCookie?.value) {
    throw new Error("Browser beta access did not persist app_session_id");
  }

  const cookieHeader = `app_session_id=${sessionCookie.value}`;
  const user = await trpcClient(cookieHeader).auth.me.query();
  if (!user?.id || user.email !== email) {
    throw new Error("Browser-created session did not resolve the clean beta identity");
  }

  await cdp.call("Page.reload", { ignoreCache: true });
  await waitForExpression(
    cdp,
    `document.readyState === "complete" && window.location.pathname === "/"`
  );

  const cookiesAfterReload = await cdp.call("Network.getAllCookies");
  if (!(cookiesAfterReload.cookies || []).some(cookie => cookie.name === "app_session_id")) {
    throw new Error("Browser session cookie did not survive reload");
  }

  const screenshot = await cdp.call("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(screenshotFile, Buffer.from(screenshot.data, "base64"));

  const pageState = await cdp.call("Runtime.evaluate", {
    expression: `({
      path: window.location.pathname,
      title: document.title,
      textSample: document.body.innerText.slice(0, 240)
    })`,
    returnByValue: true,
  });

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    freshProfile: true,
    signinPageRendered: true,
    cleanAccountEmail: email,
    userId: String(user.id),
    sessionCookieSet: true,
    sessionSurvivedReload: true,
    finalPath: pageState?.result?.value?.path || null,
    pageTitle: pageState?.result?.value?.title || null,
    screenshot: screenshotFile,
  };
  await writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
  console.log(
    `RC browser smoke passed for fresh account ${email} (user ${String(user.id)})`
  );
} finally {
  try {
    cdp?.close();
  } catch {}
  await waitForChromeExit(chrome);
  await removeBrowserProfile(profileDir);
}
