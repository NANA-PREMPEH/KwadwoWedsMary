# PostgreSQL setup

The application now persists RSVPs and guest photo submissions to PostgreSQL. Browser storage remains a fallback when the API is unavailable.

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Start a local database with `docker compose up -d postgres`, or use a managed PostgreSQL provider.
3. Apply the schema with `npm.cmd run db:migrate`.
4. In one terminal run `npm.cmd run api`; in a second terminal run `npm.cmd run dev`.

The Vite development server proxies `/api` requests to `http://localhost:4000`.

## Deploying on Vercel

The root `api/` directory contains Vercel Functions for the RSVP, photo, and health endpoints, so no long-running Express server is required after deployment.

1. Import this GitHub repository into Vercel.
2. In the Vercel Marketplace, install a managed PostgreSQL provider such as [Neon](https://vercel.com/marketplace/neon). Vercel Postgres is no longer offered for new projects; Marketplace providers supply the database credentials instead.
3. In **Settings → Environment Variables**, set `DATABASE_URL` to the provider connection string and `DATABASE_SSL` to `true` for Neon/managed PostgreSQL.
4. Apply [database/schema.sql](database/schema.sql) in the provider's SQL editor once, before accepting RSVP submissions.
5. Deploy. Vercel uses `vercel.json` to install with npm, build the Vite site, and deploy the API functions.

After deployment, verify `<your-domain>/api/health` returns `{ "ok": true }`.

Do not commit `.env`; it can contain your database password.
