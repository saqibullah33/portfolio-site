# Saqib Ullah — Portfolio

Dynamic portfolio site built with Next.js 16 (App Router), Tailwind CSS v4 and
Neon Postgres. Design system follows `design.md` (Meta commerce tokens:
Optimistic VF scale via Montserrat, cobalt `#0064e0`, pill buttons,
`rounded-xxxl` cards).

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL (Neon) and ADMIN_KEY
npm run db:setup       # creates tables + seeds meetups from the Luma CSV
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (DB-backed login; seed an admin account
  by setting `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars, then run
  `npm run db:setup`)

## Features

- Events/meetups stored in Neon (`events`, `event_media` tables)
- Public pages render live from the DB (`/`, `/events/[id]`)
- Admin CRUD at `/admin`: create, edit, delete events; upload images per event;
  set cover image; delete media
- Re-seed or re-import CSV: `npm run db:setup -- --force --csv path/to/file.csv`

## Media storage

Uploads go to **Neon Object Storage** when these are set in `.env` (otherwise
they fall back to `public/uploads/` on local disk):

```
NEON_BUCKET=<your bucket name>
AWS_ENDPOINT_URL_S3=https://<branch>.storage.c-2.us-east-1.aws.neon.tech
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=nak_live_...     # credential token_id
AWS_SECRET_ACCESS_KEY=nsk_live_... # credential s3_secret_access_key
```

Get credentials via `neon credentials create --scope storage:read --scope storage:write`
or Console → branch → Object storage. The bucket must have `public_read` access
for images to render on the public site.

## Notes

- Deleting media in admin removes both the DB row and the stored object.
- Schema is created idempotently by `npm run db:setup` — safe to re-run.
