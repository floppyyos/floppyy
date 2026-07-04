import postgres from "postgres";

let sql: postgres.Sql | null = null;

export function getSql(): postgres.Sql | null {
  if (!process.env.DATABASE_URL) return null;
  sql ??= postgres(process.env.DATABASE_URL, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return sql;
}

export function isPersistent(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
