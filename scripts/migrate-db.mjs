import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for db:migrate");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
});

try {
  await sql`
    CREATE TABLE IF NOT EXISTS guestbook_messages (
      id BIGSERIAL PRIMARY KEY,
      nick TEXT NOT NULL,
      body TEXT NOT NULL,
      avatar TEXT NOT NULL DEFAULT 'face-smile',
      color SMALLINT NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'online',
      ip_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE guestbook_messages
    ADD COLUMN IF NOT EXISTS avatar TEXT NOT NULL DEFAULT 'face-smile'
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS guestbook_messages_id_desc_idx
    ON guestbook_messages (id DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_counters (
      name TEXT PRIMARY KEY,
      value BIGINT NOT NULL DEFAULT 0
    )
  `;

  console.log("Floppyy database migration complete.");
} finally {
  await sql.end({ timeout: 5 });
}
