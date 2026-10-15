import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/db";
import { eventDateLabel, isUpcoming } from "@/lib/format";
import { MediaGallery } from "@/components/Gallery";
import { XPost } from "@/components/XPost";
import {
  IconCalendar,
  IconExternal,
  IconPin,
  IconStar,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(Number(id)).catch(() => null);
  if (!event) notFound();

  const cover = event.cover_image || event.media?.[0]?.url || null;
  const upcoming = isUpcoming(event);
  const feedbackItems = event.feedback
    ?.split("|")
    .map((f) => f.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-canvas">
      <div className="container-page py-8">
        <nav className="t-body-sm text-stone mb-8 flex items-center gap-2">
          <Link href="/" className="text-steel hover:text-ink">
            Home
          </Link>
          <span>·</span>
          <span className="text-ink">{event.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: cover + gallery */}
          <div>
            <MediaGallery
              media={event.media ?? []}
              cover={cover}
              title={event.title}
            />

            {event.description && (
              <p className="t-body text-charcoal mt-8">{event.description}</p>
            )}

            {event.x_post_url && <XPost url={event.x_post_url} />}
          </div>

          {/* Right: summary rail */}
          <aside className="card-summary lg:sticky lg:top-24">
            <div className="flex gap-2 mb-4">
              {upcoming ? (
                <span className="badge-success">Upcoming</span>
              ) : (
                <span className="badge bg-ink-deep text-canvas">Past event</span>
              )}
              {event.avg_rating != null && (
                <span className="badge-warning inline-flex items-center gap-1">
                  <IconStar filled width={12} height={12} />
                  {Number(event.avg_rating).toFixed(1)} ({event.rating_count})
                </span>
              )}
            </div>

            <h1 className="t-heading-lg text-ink-deep">{event.title}</h1>

            <div className="mt-6 space-y-3 t-body-sm text-charcoal">
              <p className="flex items-center gap-2">
                <IconCalendar width={16} height={16} className="text-steel" />
                {eventDateLabel(event)}
              </p>
              <p className="flex items-start gap-2">
                <IconPin width={16} height={16} className="text-steel mt-0.5" />
                {event.location}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-surface-soft rounded-xl p-4 text-center">
                <p className="t-heading-sm text-ink-deep">{event.registered}</p>
                <p className="t-caption text-steel">Registered</p>
              </div>
              <div className="bg-surface-soft rounded-xl p-4 text-center">
                <p className="t-heading-sm text-ink-deep">
                  {event.checked_in ?? "—"}
                </p>
                <p className="t-caption text-steel">Checked in</p>
              </div>
            </div>

            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="btn-cta w-full mt-6"
              >
                View on Luma <IconExternal />
              </a>
            )}
            <Link
              href="/#community"
              className="btn-ghost w-full mt-3"
            >
              Back to all meetups
            </Link>
          </aside>
        </div>

        {feedbackItems && feedbackItems.length > 0 && (
          <section className="mt-16">
            <h2 className="t-heading-lg text-ink-deep mb-8">
              What attendees said
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackItems.map((f, i) => (
                <blockquote
                  key={i}
                  className="bg-canvas rounded-xl p-8 border border-hairline-soft"
                >
                  <p className="t-body text-ink">&ldquo;{f}&rdquo;</p>
                </blockquote>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
