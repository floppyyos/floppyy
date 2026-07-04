import type postgres from "postgres";
import { getSql } from "@/lib/server/postgres";

const COUNTER_NAME = "visitors";

function base(): number {
  const value = Number(process.env.VISITOR_COUNT_BASE);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

let schemaReady: Promise<void> | null = null;

function ensureSchema(client: postgres.Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await client`
        CREATE TABLE IF NOT EXISTS site_counters (
          name TEXT PRIMARY KEY,
          value BIGINT NOT NULL DEFAULT 0
        )
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

let memoryCount = 0;

export async function incrementVisitors(): Promise<number> {
  const client = getSql();
  if (!client) {
    memoryCount += 1;
    return memoryCount + base();
  }
  await ensureSchema(client);
  const [row] = await client<{ value: string }[]>`
    INSERT INTO site_counters (name, value)
    VALUES (${COUNTER_NAME}, 1)
    ON CONFLICT (name) DO UPDATE SET value = site_counters.value + 1
    RETURNING value
  `;
  return Number(row?.value ?? 0) + base();
}

export async function getVisitors(): Promise<number> {
  const client = getSql();
  if (!client) return memoryCount + base();
  await ensureSchema(client);
  const [row] = await client<{ value: string }[]>`
    SELECT value FROM site_counters WHERE name = ${COUNTER_NAME}
  `;
  return Number(row?.value ?? 0) + base();
}
