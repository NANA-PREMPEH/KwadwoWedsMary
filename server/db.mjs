import 'dotenv/config';
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Neon/Vercel injects POSTGRES_URL automatically. DATABASE_URL remains supported for other providers.
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or POSTGRES_URL is required. Add it to .env before starting the API.');
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  // Keep serverless connection usage small; each Vercel Function instance has its own pool.
  max: 2,
  idleTimeoutMillis: 10_000,
});

export async function migrate() {
  const schema = await readFile(path.resolve(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  await pool.query(schema);
  await pool.end();
}
