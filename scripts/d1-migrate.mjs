import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const accountId = process.env.CF_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;
const databaseId = process.env.D1_DATABASE_ID;
const apiToken = process.env.CF_API_TOKEN ?? process.env.R2_API_TOKEN;

if (!accountId || !databaseId || !apiToken) {
  console.error(
    "Missing Cloudflare D1 config. Need CF_ACCOUNT_ID, D1_DATABASE_ID and CF_API_TOKEN in .env.local.",
  );
  process.exit(1);
}

const schemaPath = join(__dirname, "..", "db", "schema.sql");
const raw = readFileSync(schemaPath, "utf8");

const statements = raw
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

let ok = 0;
for (const sql of statements) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    console.error("FAILED:", sql.slice(0, 80));
    console.error(json.errors ?? json);
    process.exit(1);
  }
  ok += 1;
}

console.log(`D1 migration complete: ${ok} statements applied.`);
