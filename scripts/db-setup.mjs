// Sets up the Neon schema and seeds events from the Luma CSV export.
// Usage: node scripts/db-setup.mjs [--force] [--csv <path>]
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional here; DATABASE_URL may come from the environment
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Create .env from .env.example first.");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const csvIdx = args.indexOf("--csv");
const csvPath =
  csvIdx !== -1
    ? args[csvIdx + 1]
    : path.join(
        process.env.USERPROFILE ?? process.env.HOME ?? ".",
        "Downloads",
        "luma-portfolio.csv"
      );

const sql = neon(DATABASE_URL);

async function createSchema() {
  await sql`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    event_date TIMESTAMPTZ,
    date_label TEXT DEFAULT '',
    location TEXT DEFAULT '',
    url TEXT DEFAULT '',
    registered INTEGER DEFAULT 0,
    checked_in INTEGER,
    avg_rating NUMERIC(3,1),
    rating_count INTEGER,
    feedback TEXT,
    status TEXT NOT NULL DEFAULT 'past',
    cover_image TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS embed_url TEXT`;
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS x_post_url TEXT`;
  await sql`CREATE TABLE IF NOT EXISTS event_media (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'image',
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT DEFAULT '',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  console.log("Schema ready: events, event_media, admin_users, sessions");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@saqib.dev";
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const existing = await sql`SELECT id FROM admin_users WHERE email = ${email}`;
  if (existing.length > 0) {
    console.log(`Admin user ${email} already exists — skipping.`);
    return;
  }
  await sql`INSERT INTO admin_users (email, name, password_hash)
    VALUES (${email}, 'Saqib Ullah', ${hashPassword(password)})`;
  console.log(`Created admin user: ${email} / ${password}`);
}

function parseStartDate(label) {
  // "2026-09-26 11:00 AM-2:30 PM" -> start Date
  const m = String(label).match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-?\s*(\d{1,2}:\d{2}\s*[AP]M)?$/i
  );
  if (!m) return null;
  const d = new Date(`${m[1]} ${m[2]}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function num(v) {
  if (v === undefined || v === null || String(v).trim() === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

async function seed() {
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM events`;
  if (count > 0 && !force) {
    console.log(`events table already has ${count} rows — skipping seed (use --force to wipe + reseed).`);
    return;
  }
  if (force && count > 0) {
    await sql`DELETE FROM events`;
    console.log(`Wiped ${count} existing events.`);
  }

  if (!existsSync(csvPath)) {
    console.log(`CSV not found at ${csvPath} — schema only.`);
    return;
  }

  const rows = parse(readFileSync(csvPath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  });

  const now = new Date();
  let inserted = 0;
  for (const r of rows) {
    const eventDate = parseStartDate(r.date);
    const status = eventDate && eventDate > now ? "upcoming" : "past";
    const feedback =
      r.feedback_comments && !/^no feedback/i.test(r.feedback_comments.trim())
        ? r.feedback_comments.trim()
        : null;

    await sql`INSERT INTO events
      (title, event_date, date_label, location, url, registered, checked_in,
       avg_rating, rating_count, feedback, status)
      VALUES (
        ${r.title}, ${eventDate}, ${r.date ?? ""}, ${r.location ?? ""},
        ${r.url ?? ""}, ${num(r.registered) ?? 0}, ${num(r.checked_in)},
        ${num(r.avg_rating)}, ${num(r.rating_count)}, ${feedback}, ${status}
      )`;
    inserted++;
  }
  console.log(`Seeded ${inserted} events from ${csvPath}`);
}

await createSchema();
await seed();
await seedAdminUser();
