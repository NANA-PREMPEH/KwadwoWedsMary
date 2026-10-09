import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.mjs';
import loginHandler from '../api/auth/login.mjs';
import sessionHandler from '../api/auth/session.mjs';
import logoutHandler from '../api/auth/logout.mjs';
import contentHandler from '../api/content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json({ limit: '8mb' }));

// These same handlers are deployed as Vercel Functions. Register them here for local development.
app.all('/api/auth/login', loginHandler);
app.all('/api/auth/session', sessionHandler);
app.all('/api/auth/logout', logoutHandler);
app.all('/api/content', contentHandler);

const asArray = (value) => Array.isArray(value) ? value : [];
const isPhotoCategory = (value) => ['ceremony', 'cocktail', 'dinner', 'party', 'candid'].includes(value);
const isPhotoFilter = (value) => ['none', 'black-and-white', 'sepia'].includes(value);

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
  submittedAt: row.submitted_at,
});

const toPhoto = (row) => ({
  id: row.id,
  url: row.url,
  caption: row.caption,
  uploaderName: row.uploader_name,
  category: row.category,
  filter: row.photo_filter,
  likes: row.likes,
  timestamp: new Date(row.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.get('/api/rsvps', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM rsvps ORDER BY submitted_at DESC');
    res.json(rows.map(toRsvp));
  } catch (error) { next(error); }
});

app.post('/api/rsvps', async (req, res, next) => {
  const rsvp = req.body;
  if (!rsvp?.id || !rsvp.fullName?.trim() || !/^\S+@\S+\.\S+$/.test(rsvp.email || '') || !['accepted', 'declined'].includes(rsvp.attending)) {
    return res.status(400).json({ error: 'Please provide valid RSVP details.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO rsvps (id, full_name, email, phone, attending, party_size, guest_names, dietary_restrictions, dietary_notes, song_request, message, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone,
         attending = EXCLUDED.attending, party_size = EXCLUDED.party_size, guest_names = EXCLUDED.guest_names,
         dietary_restrictions = EXCLUDED.dietary_restrictions, dietary_notes = EXCLUDED.dietary_notes,
         song_request = EXCLUDED.song_request, message = EXCLUDED.message
       RETURNING *`,
      [rsvp.id, rsvp.fullName.trim(), rsvp.email.trim().toLowerCase(), rsvp.phone || null, rsvp.attending,
        Math.max(0, Number(rsvp.partySize) || 0), JSON.stringify(asArray(rsvp.guestNames)),
        JSON.stringify(asArray(rsvp.dietaryRestrictions)), rsvp.dietaryNotes || null, rsvp.songRequest || null,
        rsvp.message || null, rsvp.submittedAt || new Date().toISOString()]
    );
    res.status(201).json(toRsvp(rows[0]));
  } catch (error) { next(error); }
});

app.get('/api/photos', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM wedding_photos ORDER BY created_at DESC');
    res.json(rows.map(toPhoto));
  } catch (error) { next(error); }
});

app.post('/api/photos', async (req, res, next) => {
  const photo = req.body;
  if (!photo?.id || !photo.url || !photo.uploaderName?.trim() || !isPhotoCategory(photo.category)) {
    return res.status(400).json({ error: 'Please provide valid photo details.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO wedding_photos (id, url, caption, uploader_name, category, photo_filter, likes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [photo.id, photo.url, photo.caption || '', photo.uploaderName.trim(), photo.category,
        isPhotoFilter(photo.filter) ? photo.filter : 'none', Math.max(0, Number(photo.likes) || 0)]
    );
    res.status(201).json(rows[0] ? toPhoto(rows[0]) : photo);
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'The database request could not be completed.' });
});

if (process.env.NODE_ENV === 'production') {
  const distDirectory = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distDirectory));
  app.get('*', (_req, res) => res.sendFile(path.join(distDirectory, 'index.html')));
}

app.listen(port, () => console.log(`Wedding API listening on http://localhost:${port}`));
