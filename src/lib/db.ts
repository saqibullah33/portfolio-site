import { neon } from "@neondatabase/serverless";
import type { EventInput, EventMedia, PortfolioEvent } from "@/lib/types";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env"
    );
  }
  return neon(url);
}

export async function listEvents(): Promise<PortfolioEvent[]> {
  const sql = getSql();
  const events = (await sql`
    SELECT * FROM events
    ORDER BY event_date DESC NULLS LAST, id DESC
  `) as PortfolioEvent[];

  if (events.length === 0) return events;

  const media = (await sql`
    SELECT * FROM event_media
    WHERE event_id = ANY(${events.map((e) => e.id)})
    ORDER BY sort_order ASC, id ASC
  `) as EventMedia[];

  const byEvent = new Map<number, EventMedia[]>();
  for (const m of media) {
    const list = byEvent.get(m.event_id) ?? [];
    list.push(m);
    byEvent.set(m.event_id, list);
  }
  return events.map((e) => ({ ...e, media: byEvent.get(e.id) ?? [] }));
}

export async function getEvent(id: number): Promise<PortfolioEvent | null> {
  const sql = getSql();
  const rows = (await sql`SELECT * FROM events WHERE id = ${id}`) as PortfolioEvent[];
  if (rows.length === 0) return null;
  const media = (await sql`
    SELECT * FROM event_media WHERE event_id = ${id}
    ORDER BY sort_order ASC, id ASC
  `) as EventMedia[];
  return { ...rows[0], media };
}

export async function createEvent(input: EventInput): Promise<PortfolioEvent> {
  const sql = getSql();
  const status =
    input.status ??
    (input.event_date && new Date(input.event_date) > new Date()
      ? "upcoming"
      : "past");
  const rows = (await sql`
    INSERT INTO events (title, event_date, date_label, location, url, registered,
      checked_in, avg_rating, rating_count, feedback, status, cover_image,
      description, embed_url, x_post_url)
    VALUES (${input.title}, ${input.event_date ?? null}, ${input.date_label ?? ""},
      ${input.location ?? ""}, ${input.url ?? ""}, ${input.registered ?? 0},
      ${input.checked_in ?? null}, ${input.avg_rating ?? null},
      ${input.rating_count ?? null}, ${input.feedback ?? null}, ${status},
      ${input.cover_image ?? null}, ${input.description ?? null},
      ${input.embed_url ?? null}, ${input.x_post_url?.trim() || null})
    RETURNING *
  `) as PortfolioEvent[];
  return rows[0];
}

export async function updateEvent(
  id: number,
  input: EventInput
): Promise<PortfolioEvent | null> {
  const sql = getSql();
  const existing = await getEvent(id);
  if (!existing) return null;

  const e = {
    ...existing,
    ...input,
    embed_url: input.embed_url ?? existing.embed_url ?? null,
    x_post_url: input.x_post_url === undefined
      ? existing.x_post_url ?? null
      : input.x_post_url?.trim() || null,
  };
  const rows = (await sql`
    UPDATE events SET
      title = ${e.title},
      event_date = ${e.event_date},
      date_label = ${e.date_label},
      location = ${e.location},
      url = ${e.url},
      registered = ${e.registered},
      checked_in = ${e.checked_in},
      avg_rating = ${e.avg_rating},
      rating_count = ${e.rating_count},
      feedback = ${e.feedback},
      status = ${e.status},
      cover_image = ${e.cover_image},
      description = ${e.description},
      embed_url = ${e.embed_url},
      x_post_url = ${e.x_post_url}
    WHERE id = ${id}
    RETURNING *
  `) as PortfolioEvent[];
  return rows[0] ?? null;
}

export async function deleteEvent(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM events WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function addMedia(
  eventId: number,
  data: { url: string; type?: string; caption?: string }
): Promise<EventMedia> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO event_media (event_id, url, type, caption)
    VALUES (${eventId}, ${data.url}, ${data.type ?? "image"}, ${data.caption ?? null})
    RETURNING *
  `) as EventMedia[];
  return rows[0];
}

export async function deleteMedia(id: number): Promise<string | null> {
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM event_media WHERE id = ${id} RETURNING url
  `) as { url: string }[];
  return rows[0]?.url ?? null;
}
