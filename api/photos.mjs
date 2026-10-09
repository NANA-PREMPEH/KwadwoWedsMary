import { pool } from '../server/db.mjs';

const isPhotoCategory = (value) => ['ceremony', 'cocktail', 'dinner', 'party', 'candid'].includes(value);
const isPhotoFilter = (value) => ['none', 'black-and-white', 'sepia'].includes(value);

// Makes the photo endpoint resilient when the initial schema was applied before moderation was added.
const ensurePhotoModerationColumns = async () => {
  await pool.query("ALTER TABLE wedding_photos ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'approved'");
  await pool.query("ALTER TABLE wedding_photos ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE");
};

const toPhoto = (row) => ({
  id: row.id,
  url: row.url,
  caption: row.caption,
  uploaderName: row.uploader_name,
  category: row.category,
  filter: row.photo_filter,
  likes: row.likes,
  moderationStatus: row.moderation_status,
  isFeatured: row.is_featured,
  timestamp: new Date(row.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
});

export default async function handler(req, res) {
  try {
    await ensurePhotoModerationColumns();
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM wedding_photos ORDER BY created_at DESC');
      return res.status(200).json(rows.map(toPhoto));
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    const photo = req.body;
    if (!photo?.id || !photo.url || !photo.uploaderName?.trim() || !isPhotoCategory(photo.category)) {
      return res.status(400).json({ error: 'Please provide valid photo details.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO wedding_photos (id, url, caption, uploader_name, category, photo_filter, likes, moderation_status, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET moderation_status = EXCLUDED.moderation_status, is_featured = EXCLUDED.is_featured
       RETURNING *`,
      [photo.id, photo.url, photo.caption || '', photo.uploaderName.trim(), photo.category,
        isPhotoFilter(photo.filter) ? photo.filter : 'none', Math.max(0, Number(photo.likes) || 0), photo.moderationStatus || 'pending', Boolean(photo.isFeatured)]
    );
    return res.status(201).json(rows[0] ? toPhoto(rows[0]) : photo);
  } catch (error) {
    console.error('Photo API error:', error);
    return res.status(500).json({ error: 'The database request could not be completed.' });
  }
}
