const accountId = process.env.CF_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID ?? "";
const databaseId = process.env.D1_DATABASE_ID ?? "";
const apiToken = process.env.CF_API_TOKEN ?? process.env.R2_API_TOKEN ?? "";

export function d1Configured(): boolean {
  return Boolean(accountId && databaseId && apiToken);
}

export interface D1QueryResult<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1Response<T = Record<string, unknown>> {
  success: boolean;
  errors?: { code: number; message: string }[];
  result: D1QueryResult<T>[];
}

function endpoint(): string {
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
}

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<D1QueryResult<T>> {
  if (!d1Configured()) {
    throw new Error(
      "Cloudflare D1 is not configured. Set CF_ACCOUNT_ID, CF_API_TOKEN and D1_DATABASE_ID in .env.local.",
    );
  }

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });

  const json = (await res.json()) as D1Response<T>;

  if (!res.ok || !json.success) {
    const message =
      json.errors?.map((e) => e.message).join("; ") ||
      `D1 request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json.result?.[0] ?? { results: [], success: true };
}

export async function d1All<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await d1Query<T>(sql, params);
  return result.results ?? [];
}

export async function d1First<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await d1All<T>(sql, params);
  return rows[0] ?? null;
}

export async function d1Run(sql: string, params: unknown[] = []) {
  return d1Query(sql, params);
}

export async function d1Batch(statements: { sql: string; params?: unknown[] }[]) {
  if (!d1Configured()) {
    throw new Error(
      "Cloudflare D1 is not configured. Set CF_ACCOUNT_ID, CF_API_TOKEN and D1_DATABASE_ID in .env.local.",
    );
  }

  if (statements.length === 0) return [];
  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      batch: statements.map((statement) => ({
        sql: statement.sql,
        params: statement.params ?? [],
      })),
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as D1Response;
  if (!res.ok || !json.success || json.result?.some((result) => !result.success)) {
    const message = json.errors?.map((error) => error.message).join("; ") ||
      `D1 batch failed with status ${res.status}`;
    throw new Error(message);
  }
  return json.result ?? [];
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
