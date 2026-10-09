CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  attending TEXT NOT NULL CHECK (attending IN ('accepted', 'declined')),
  party_size INTEGER NOT NULL CHECK (party_size >= 0),
  guest_names JSONB NOT NULL DEFAULT '[]'::jsonb,
  dietary_restrictions JSONB NOT NULL DEFAULT '[]'::jsonb,
  dietary_notes TEXT,
  song_request TEXT,
  message TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rsvps_email_index ON rsvps (LOWER(email));

ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE rsvps DROP CONSTRAINT IF EXISTS rsvps_attending_check;
ALTER TABLE rsvps ADD CONSTRAINT rsvps_attending_check CHECK (attending IN ('accepted', 'declined', 'pending'));

CREATE TABLE IF NOT EXISTS wedding_photos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  uploader_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ceremony', 'cocktail', 'dinner', 'party', 'candid')),
  photo_filter TEXT NOT NULL DEFAULT 'none' CHECK (photo_filter IN ('none', 'black-and-white', 'sepia')),
  likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wedding_photos_created_at_index ON wedding_photos (created_at DESC);
ALTER TABLE wedding_photos ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE wedding_photos ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,
  content_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
