import { Pool } from "pg";

declare global {
  var pgPool: Pool | undefined;
}

export function isPgError(
  e: unknown,
): e is { code: string; constraint?: string } {
  return typeof e === "object" && e !== null && "code" in e;
}

export const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: true, ca: process.env.SUPABASE_CA_CERT }
        : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") global.pgPool = pool;
