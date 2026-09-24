import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

function databaseConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is required");

  const url = new URL(raw);
  if (!["mysql:", "mysql2:"].includes(url.protocol)) {
    throw new Error(`Unsupported DATABASE_URL protocol: ${url.protocol}`);
  }

  const database = url.pathname.replace(/^\//, "");
  if (!database) throw new Error("DATABASE_URL must include a database name");

  return {
    host: url.hostname || "127.0.0.1",
    port: url.port || "3306",
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
  };
}

async function verifyChecksum(filePath) {
  const checksumPath = `${filePath}.sha256`;
  try {
    await access(checksumPath);
  } catch {
    if (process.env.REQUIRE_BACKUP_CHECKSUM === "1") {
      throw new Error(`Checksum required but missing: ${checksumPath}`);
    }
    return;
  }

  const expected = (await readFile(checksumPath, "utf8")).trim().split(/\s+/)[0];
  const bytes = await readFile(filePath);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== expected) throw new Error("Backup checksum verification failed");
}

function restore(config, filePath) {
  return new Promise((resolve, reject) => {
    const args = [
      "--host", config.host,
      "--port", config.port,
      "--user", config.user,
      "--default-character-set=utf8mb4",
      config.database,
    ];
    const child = spawn("mysql", args, {
      env: { ...process.env, MYSQL_PWD: config.password },
      stdio: ["pipe", "inherit", "inherit"],
    });

    createReadStream(filePath).pipe(child.stdin);
    child.on("error", reject);
    child.on("close", code => {
      if (code !== 0) return reject(new Error(`mysql restore exited with code ${code}`));
      resolve();
    });
  });
}

if (process.env.ALLOW_DB_RESTORE !== "YES") {
  throw new Error("Refusing restore: set ALLOW_DB_RESTORE=YES explicitly");
}

const filePath = path.resolve(process.argv[2] || "");
if (!process.argv[2]) throw new Error("Usage: pnpm db:restore -- <backup.sql>");
await access(filePath);
await verifyChecksum(filePath);
await restore(databaseConfig(), filePath);
console.log(`Restored ${path.basename(filePath)}`);
