import { pool } from '../server/db.mjs';
import { verifyAdminSession } from '../server/adminAuth.mjs';

const asArray = (value) => Array.isArray(value) ? value : [];

const toRsvp = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone || undefined,
  attending: row.attending,
  partySize: row.party_size,
  guestNames: row.guest_names,
  dietaryRestrictions: row.dietary_restrictions,
  dietaryNotes: row.dietary_notes || undefined,
  songRequest: row.song_request || undefined,
  message: row.message || undefined,
  adminNotes: row.admin_notes || undefined,
  submittedAt: row.submitted_at,
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM rsvps ORDER BY submitted_at DESC');
      return res.status(200).json(rows.map(toRsvp));
    }

    if (req.method === 'PATCH') {
      if (!verifyAdminSession(req)) return res.status(401).json({ error: 'Admin authentication is required.' });
      const { id, attending, partySize, adminNotes } = req.body || {};
      if (!id || !['accepted', 'declined', 'pending'].includes(attending)) return res.status(400).json({ error: 'Valid RSVP changes are required.' });
      const { rows } = await pool.query('UPDATE rsvps SET attending = $2, party_size = $3, admin_notes = $4 WHERE id = $1 RETURNING *', [id, attending, Math.max(0, Number(partySize) || 0), adminNotes || null]);
      return rows[0] ? res.status(200).json(toRsvp(rows[0])) : res.status(404).json({ error: 'RSVP not found.' });
    }

    if (req.method === 'DELETE') {
      if (!verifyAdminSession(req)) return res.status(401).json({ error: 'Admin authentication is required.' });
      const { id } = req.body || {};
      await pool.query('DELETE FROM rsvps WHERE id = $1', [id]);
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    const rsvp = req.body;
    if (!rsvp?.id || !rsvp.fullName?.trim() || !/^\S+@\S+\.\S+$/.test(rsvp.email || '') || !['accepted', 'declined'].includes(rsvp.attending)) {
      return res.status(400).json({ error: 'Please provide valid RSVP details.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO rsvps (id, full_name, email, phone, attending, party_size, guest_names, dietary_restrictions, dietary_notes, song_request, message, admin_notes, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO UPDATE SET
         full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone,
         attending = EXCLUDED.attending, party_size = EXCLUDED.party_size, guest_names = EXCLUDED.guest_names,
         dietary_restrictions = EXCLUDED.dietary_restrictions, dietary_notes = EXCLUDED.dietary_notes,
         song_request = EXCLUDED.song_request, message = EXCLUDED.message
       RETURNING *`,
      [rsvp.id, rsvp.fullName.trim(), rsvp.email.trim().toLowerCase(), rsvp.phone || null, rsvp.attending,
        Math.max(0, Number(rsvp.partySize) || 0), JSON.stringify(asArray(rsvp.guestNames)),
        JSON.stringify(asArray(rsvp.dietaryRestrictions)), rsvp.dietaryNotes || null, rsvp.songRequest || null,
        rsvp.message || null, rsvp.adminNotes || null, rsvp.submittedAt || new Date().toISOString()]
    );
    return res.status(201).json(toRsvp(rows[0]));
  } catch (error) {
    console.error('RSVP API error:', error);
    return res.status(500).json({ error: 'The database request could not be completed.' });
  }
}
