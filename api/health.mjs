import { pool } from '../server/db.mjs';

export default async function handler(_req, res) {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(503).json({ ok: false });
  }
}
