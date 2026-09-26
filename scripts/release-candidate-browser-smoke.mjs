import { execFileSync, spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
const routeReportFile = process.env.RC_ROUTE_REPORT_FILE || "rc-route-smoke.json";
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


async function readRegisteredRoutes() {
  const source = await readFile("client/src/data/routeCatalog.ts", "utf8");
  const routes = [...source.matchAll(/"route":\s*"([^"]+)"/g)].map(match => match[1]);
  return [...new Set(routes)];
}

async function scanRegisteredRoutes(cdp) {
  const routes = await readRegisteredRoutes();
  const failures = [];
  const results = [];

  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];

    await cdp.call("Runtime.evaluate", {
      expression: `(() => {
        window.history.pushState({}, "", ${JSON.stringify(route)});
        window.dispatchEvent(new PopStateEvent("popstate"));
        return window.location.pathname;
      })()`,
      returnByValue: true,
    });

    const deadline = Date.now() + 2500;
    let state = null;
    let blankSince = null;

    while (Date.now() < deadline) {
      const evaluated = await cdp.call("Runtime.evaluate", {
        expression: `(() => {
          const main = document.querySelector("#main-content");
          const bodyText = document.body?.innerText || "";
          const mainText = main?.innerText || "";
          return {
            path: window.location.pathname,
            hasMain: Boolean(main),
            mainTextLength: mainText.trim().length,
            errorBoundary: bodyText.includes("An unexpected error occurred."),
            loading: mainText.includes("Preparing your workspace…"),
            bodySample: bodyText.slice(0, 500),
            mainSample: mainText.slice(0, 300),
          };
        })()`,
        returnByValue: true,
      });
      state = evaluated?.result?.value || null;

      if (
        state &&
        state.path === route &&
        !state.loading &&
        (state.errorBoundary || (state.hasMain && state.mainTextLength > 0))
      ) {
        break;
      }

      if (
        state &&
        state.path === route &&
        state.hasMain &&
        !state.loading &&
        state.mainTextLength === 0
      ) {
        blankSince ??= Date.now();
        if (Date.now() - blankSince >= 350) break;
      } else {
        blankSince = null;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const failed =
      !state ||
      state.path !== route ||
      state.errorBoundary ||
      !state.hasMain ||
      state.mainTextLength === 0 ||
      state.loading;

    const result = {
      route,
      ok: !failed,
      path: state?.path || null,
      hasMain: state?.hasMain ?? false,
      mainTextLength: state?.mainTextLength ?? 0,
      errorBoundary: state?.errorBoundary ?? false,
      loading: state?.loading ?? false,
      mainSample: state?.mainSample || "",
      bodySample: state?.bodySample || "",
    };
    results.push(result);

    if (failed) {
      failures.push(result);

      // A React error boundary remains latched after a render failure.
      // Reset to a fresh app instance so one bad route does not hide later failures.
      await cdp.call("Page.navigate", { url: `${baseUrl}/` });
      try {
        await waitForExpression(
          cdp,
          `document.readyState === "complete" && document.querySelector("#main-content") && !document.body.innerText.includes("An unexpected error occurred.")`,
          10_000
        );
      } catch {}
    }

    if ((index + 1) % 100 === 0 || index === routes.length - 1) {
      console.log(
        `Route smoke progress: ${index + 1}/${routes.length}; failures=${failures.length}`
      );
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    total: routes.length,
    passed: results.length - failures.length,
    failed: failures.length,
    failures,
  };
  await writeFile(routeReportFile, JSON.stringify(report, null, 2) + "\n");

  return report;
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

  const routeSmoke = await scanRegisteredRoutes(cdp);
  if (routeSmoke.failed > 0) {
    console.error(
      `Registered-route smoke found ${routeSmoke.failed}/${routeSmoke.total} failing screens`
    );
    for (const failure of routeSmoke.failures.slice(0, 100)) {
      console.error(
        `BROKEN_ROUTE ${failure.route} errorBoundary=${failure.errorBoundary} hasMain=${failure.hasMain} text=${JSON.stringify(failure.mainSample)}`
      );
    }
    throw new Error(
      `Registered-route browser smoke failed: ${routeSmoke.failed}/${routeSmoke.total} routes`
    );
  }

  await cdp.call("Page.navigate", { url: `${baseUrl}/` });
  await waitForExpression(
    cdp,
    `document.readyState === "complete" && window.location.pathname === "/" && document.querySelector("#main-content")`
  );

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
    registeredRoutesChecked: routeSmoke.total,
    registeredRoutesPassed: routeSmoke.passed,
    registeredRoutesFailed: routeSmoke.failed,
    routeReport: routeReportFile,
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
