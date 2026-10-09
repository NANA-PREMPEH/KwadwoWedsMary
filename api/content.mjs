import { pool } from '../server/db.mjs';
import { verifyAdminSession } from '../server/adminAuth.mjs';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT content_value FROM site_content WHERE content_key = $1', ['wedding-details']);
      return res.status(200).json({ details: rows[0]?.content_value ?? null });
    }

    if (req.method !== 'PUT') {
      res.setHeader('Allow', 'GET, PUT');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    if (!verifyAdminSession(req)) {
      return res.status(401).json({ error: 'Admin authentication is required.' });
    }

    if (!req.body?.details || typeof req.body.details !== 'object') {
      return res.status(400).json({ error: 'Wedding details are required.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO site_content (content_key, content_value)
       VALUES ('wedding-details', $1::jsonb)
       ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value, updated_at = NOW()
       RETURNING content_value, updated_at`,
      [JSON.stringify(req.body.details)]
    );
    return res.status(200).json({ details: rows[0].content_value, updatedAt: rows[0].updated_at });
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({ error: 'The content update could not be completed.' });
  }
}
