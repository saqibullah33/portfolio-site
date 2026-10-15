import type { PortfolioEvent } from "./types";

export function eventDateLabel(e: PortfolioEvent): string {
  if (e.date_label) return e.date_label;
  if (!e.event_date) return "TBA";
  return new Date(e.event_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isUpcoming(e: PortfolioEvent): boolean {
  if (e.status) return e.status === "upcoming";
  return e.event_date ? new Date(e.event_date) > new Date() : false;
}

export function ratingStars(avg: number | null): number {
  if (avg == null) return 0;
  return Math.round(avg);
}

/** Attendees = checked_in when recorded, otherwise registrations. */
export function attendeeCount(e: PortfolioEvent): number {
  return e.checked_in ?? e.registered ?? 0;
}

/**
 * Luma embed URL. Prefers an explicit embed_url; otherwise derives
 * https://luma.com/embed/event/<slug>/simple from any luma.com / lu.ma link.
 * Returns null for non-Luma or missing URLs.
 */
export function lumaEmbedUrl(e: PortfolioEvent): string | null {
  if (e.embed_url) return e.embed_url;
  if (!e.url) return null;
  const m = e.url.match(/(?:luma\.com|lu\.ma)\/([^\s?/]+)/i);
  if (!m) return null;
  return `https://luma.com/embed/event/${m[1]}/simple`;
}
