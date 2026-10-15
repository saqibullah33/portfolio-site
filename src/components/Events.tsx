import Link from "next/link";
import type { PortfolioEvent } from "@/lib/types";
import { attendeeCount, eventDateLabel, isUpcoming } from "@/lib/format";
import {
  IconCalendar,
  IconImage,
  IconPin,
  IconStar,
  IconUsers,
} from "./icons";

export function EventCard({ event }: { event: PortfolioEvent }) {
  const upcoming = isUpcoming(event);
  const cover = event.cover_image || event.media?.[0]?.url;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-canvas rounded-xxxl border border-hairline-soft overflow-hidden transition-shadow duration-200 hover:shadow-[rgba(20,22,26,0.08)_0px_4px_16px]"
    >
      <div className="relative aspect-[16/9] bg-surface-soft overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone gap-2">
            <IconImage width={32} height={32} />
            <span className="t-caption">No cover yet</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {upcoming ? (
            <span className="badge-success">Upcoming</span>
          ) : (
            <span className="badge bg-ink-deep/80 text-canvas">Past</span>
          )}
          {event.avg_rating != null && (
            <span className="badge-warning inline-flex items-center gap-1">
              <IconStar filled width={12} height={12} />
              {Number(event.avg_rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="t-heading-sm text-ink-deep leading-snug">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 t-body-sm text-steel">
          <p className="flex items-center gap-2">
            <IconCalendar width={16} height={16} className="shrink-0" />
            {eventDateLabel(event)}
          </p>
          <p className="flex items-center gap-2">
            <IconPin width={16} height={16} className="shrink-0" />
            <span className="truncate">{event.location || "Peshawar"}</span>
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 t-body-sm-bold text-charcoal">
          <span className="inline-flex items-center gap-1.5">
            <IconUsers width={16} height={16} />
            {event.registered} registered
          </span>
          {event.checked_in != null && event.checked_in > 0 && (
            <span>{event.checked_in} attended</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function EventsSection({ events }: { events: PortfolioEvent[] }) {
  // Upcoming: soonest first. Past: most-attended first.
  const upcoming = events
    .filter((e) => isUpcoming(e))
    .sort(
      (a, b) =>
        new Date(a.event_date ?? 0).getTime() -
        new Date(b.event_date ?? 0).getTime()
    );
  const past = events
    .filter((e) => !isUpcoming(e))
    .sort((a, b) => attendeeCount(b) - attendeeCount(a));

  const totalRegistered = events.reduce((s, e) => s + (e.registered || 0), 0);
  const totalAttended = events.reduce((s, e) => s + (e.checked_in || 0), 0);
  const rated = events.filter((e) => e.avg_rating != null);
  const avgRating = rated.length
    ? rated.reduce((s, e) => s + Number(e.avg_rating), 0) / rated.length
    : null;

  const featured = past.find(
    (e) => e.cover_image || (e.media && e.media.length > 0)
  );

  const quotes = events
    .flatMap((e) =>
      (e.feedback ?? "")
        .split("|")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((text) => ({ text, event: e.title }))
    )
    .slice(0, 3);

  const stats = [
    { value: String(events.length), label: "Meetups hosted" },
    { value: `${totalRegistered}+`, label: "Total registrations" },
    { value: `${totalAttended}+`, label: "Developers attended" },
    {
      value: avgRating != null ? `${avgRating.toFixed(1)}★` : "—",
      label: "Avg. attendee rating",
    },
  ];

  return (
    <section id="community" className="container-page section">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <p className="t-body-sm-bold text-primary mb-3">
            Community &amp; Speaking
          </p>
          <h2 className="t-display text-ink-deep max-w-2xl">
            Developer education, on the ground in Peshawar.
          </h2>
          <p className="t-subtitle text-charcoal mt-4 max-w-2xl">
            I organize and host hands-on technical meetups and workshops —
            bringing tools like Supabase, Clerk, Devin, Replit and agentic
            coding to hundreds of developers across Khyber Pakhtunkhwa.
          </p>
        </div>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card-icon">
            <p className="t-heading-sm text-ink-deep heading-feature">
              {s.value}
            </p>
            <p className="t-body-sm text-steel mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Featured flagship event — photographic card */}
      {featured && (
        <Link
          href={`/events/${featured.id}`}
          className="group relative block rounded-xxxl overflow-hidden mb-12 bg-ink-deep"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.cover_image ?? featured.media?.[0]?.url ?? ""}
            alt={featured.title}
            className="w-full aspect-[16/9] md:aspect-[21/9] object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-ink-deep/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-canvas max-w-2xl">
            <span className="badge-warning mb-4">Flagship meetup</span>
            <h3 className="t-heading-lg heading-feature">
              {featured.title}
            </h3>
            <p className="t-body text-canvas/85 mt-3">
              {eventDateLabel(featured)} · {featured.location} ·{" "}
              {attendeeCount(featured)} attendees
            </p>
          </div>
        </Link>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <h3 className="t-heading-sm text-ink-deep mb-6 heading-feature">
            Upcoming
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}

      {/* Past events grid */}
      {upcoming.length > 0 && (
        <h3 className="t-heading-sm text-ink-deep mb-6 heading-feature">
          Past events
        </h3>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(featured ? past.filter((e) => e.id !== featured.id) : past).map(
          (e) => (
            <EventCard key={e.id} event={e} />
          )
        )}
      </div>

      {/* Attendee feedback quotes */}
      {quotes.length > 0 && (
        <div className="mt-16">
          <h3 className="t-heading-sm text-ink-deep mb-6 heading-feature">
            What attendees say
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <blockquote
                key={i}
                className="bg-canvas rounded-xl p-8 border border-hairline-soft"
              >
                <p className="t-body text-ink">&ldquo;{q.text}&rdquo;</p>
                <footer className="t-body-sm-bold text-steel mt-4">
                  — {q.event}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="card text-center py-16">
          <p className="t-body text-steel">
            No events yet — add some from the admin panel.
          </p>
        </div>
      )}
    </section>
  );
}
