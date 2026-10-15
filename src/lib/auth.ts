import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "pf_admin";
const SESSION_DAYS = 30;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length &&
    crypto.timingSafeEqual(candidate, expected)
  );
}

export async function verifyUser(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, email, name, password_hash FROM admin_users
    WHERE email = ${email.trim().toLowerCase()}
  `) as (AdminUser & { password_hash: string })[];
  const user = rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export async function createSession(userId: number): Promise<string> {
  const sql = getSql();
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expires.toISOString()})
  `;
  return token;
}

export async function getSessionUser(): Promise<AdminUser | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const sql = getSql();
    const rows = (await sql`
      SELECT u.id, u.email, u.name FROM sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > now()
    `) as AdminUser[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  return (await getSessionUser()) !== null;
}

export async function destroySession(): Promise<void> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (token) {
      const sql = getSql();
      await sql`DELETE FROM sessions WHERE token = ${token}`;
    }
    store.delete(COOKIE_NAME);
  } catch {
    // no-op
  }
}

export { COOKIE_NAME };
