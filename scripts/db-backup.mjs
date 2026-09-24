import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import path from "node:path";

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

async function runDump(config, outputPath) {
  const args = [
    "--host", config.host,
    "--port", config.port,
    "--user", config.user,
    "--single-transaction",
    "--quick",
    "--routines",
    "--triggers",
    "--events",
    "--hex-blob",
    "--default-character-set=utf8mb4",
    config.database,
  ];

  const child = spawn("mysqldump", args, {
    env: { ...process.env, MYSQL_PWD: config.password },
    stdio: ["ignore", "pipe", "inherit"],
  });
  const out = createWriteStream(outputPath, { flags: "wx" });

  const exit = new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`mysqldump exited with code ${code}`));
    });
  });

  await Promise.all([pipeline(child.stdout, out), exit]);
}

const config = databaseConfig();
const backupDir = path.resolve(process.env.BACKUP_DIR || "backups");
await mkdir(backupDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const finalPath = path.join(backupDir, `${config.database}-${stamp}.sql`);
const tempPath = `${finalPath}.partial`;

await runDump(config, tempPath);
await rename(tempPath, finalPath);

const bytes = await readFile(finalPath);
const digest = createHash("sha256").update(bytes).digest("hex");
await writeFile(`${finalPath}.sha256`, `${digest}  ${path.basename(finalPath)}\n`, "utf8");

console.log(finalPath);
