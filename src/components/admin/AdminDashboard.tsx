"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventInput, EventMedia, PortfolioEvent } from "@/lib/types";
import {
  IconCheck,
  IconEdit,
  IconExternal,
  IconImage,
  IconPlus,
  IconTrash,
  IconX,
} from "@/components/icons";

const EMPTY: EventInput = {
  title: "",
  event_date: "",
  date_label: "",
  location: "",
  url: "",
  registered: 0,
  checked_in: null,
  avg_rating: null,
  rating_count: null,
  feedback: "",
  status: "past",
  cover_image: "",
  description: "",
  embed_url: "",
};

export function AdminDashboard() {
  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<PortfolioEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      setEvents(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Delete this event and its media?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert(await res.text());
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="t-heading-lg text-ink-deep">Meetups</h1>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => setCreating(true)}>
            <IconPlus /> New event
          </button>
          <button className="btn-ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="card mb-6">
          <p className="t-body-sm text-critical-strong">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="t-body text-steel">Loading…</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-canvas rounded-xl border border-hairline-soft p-5 flex flex-wrap items-center gap-4"
            >
              <div className="w-20 h-14 rounded-lg bg-surface-soft overflow-hidden shrink-0 flex items-center justify-center text-stone">
                {e.cover_image || e.media?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.cover_image || e.media?.[0]?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconImage />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="t-body-bold text-ink-deep">{e.title}</p>
                <p className="t-body-sm text-steel">
                  {e.date_label || e.event_date?.slice(0, 10)} ·{" "}
                  {e.registered} registered
                </p>
              </div>
              <div className="flex items-center gap-2">
                {e.status === "upcoming" ? (
                  <span className="badge-success">Upcoming</span>
                ) : (
                  <span className="badge bg-surface-soft text-charcoal">
                    Past
                  </span>
                )}
                <span className="t-caption text-stone">
                  {e.media?.length ?? 0} media
                </span>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/events/${e.id}`}
                  className="icon-btn border border-hairline-soft"
                  title="View"
                >
                  <IconExternal />
                </a>
                <button
                  className="icon-btn border border-hairline-soft"
                  onClick={() => setEditing(e)}
                  title="Edit"
                >
                  <IconEdit />
                </button>
                <button
                  className="icon-btn border border-hairline-soft text-critical hover:border-critical"
                  onClick={() => remove(e.id)}
                  title="Delete"
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="card text-center py-12 t-body text-steel">
              No events yet. Click “New event” to add one.
            </div>
          )}
        </div>
      )}

      {(creating || editing) && (
        <EventEditor
          event={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function EventEditor({
  event,
  onClose,
  onSaved,
}: {
  event: PortfolioEvent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EventInput>(
    event
      ? {
          title: event.title,
          event_date: event.event_date?.slice(0, 16) ?? "",
          date_label: event.date_label,
          location: event.location,
          url: event.url,
          registered: event.registered,
          checked_in: event.checked_in,
          avg_rating: event.avg_rating,
          rating_count: event.rating_count,
          feedback: event.feedback ?? "",
          status: event.status,
          cover_image: event.cover_image ?? "",
          description: event.description ?? "",
          embed_url: event.embed_url ?? "",
        }
      : EMPTY
  );
  const [media, setMedia] = useState<EventMedia[]>(event?.media ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof EventInput>(k: K, v: EventInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setErr("");
    const payload = {
      ...form,
      event_date: form.event_date
        ? new Date(form.event_date).toISOString()
        : null,
      registered: Number(form.registered) || 0,
      checked_in: form.checked_in === null || form.checked_in === ("" as never) ? null : Number(form.checked_in),
      avg_rating: form.avg_rating === null || form.avg_rating === ("" as never) ? null : Number(form.avg_rating),
      rating_count: form.rating_count === null || form.rating_count === ("" as never) ? null : Number(form.rating_count),
    };
    const res = event
      ? await fetch(`/api/events/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) {
      onSaved();
      return await res.json();
    }
    setErr(await res.text());
    return null;
  }

  async function upload(file: File) {
    if (!event) return; // must save first
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/events/${event.id}/media`, {
      method: "POST",
      body: fd,
    });
    setUploading(false);
    if (res.ok) {
      const m = await res.json();
      setMedia((ms) => [...ms, m]);
    } else {
      alert(await res.text());
    }
  }

  async function removeMedia(id: number) {
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) setMedia((ms) => ms.filter((m) => m.id !== id));
  }

  async function setCover(url: string) {
    if (!event) return;
    set("cover_image", url);
    await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cover_image: url }),
    });
  }

  const inputCls = "input";
  return (
    <div className="fixed inset-0 z-[60] bg-ink-deep/40 flex justify-center overflow-y-auto p-4 md:p-10">
      <div className="bg-canvas rounded-xxxl w-full max-w-3xl h-fit p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="t-heading-sm text-ink-deep">
            {event ? "Edit event" : "New event"}
          </h2>
          <button className="icon-btn border border-hairline-soft" onClick={onClose}>
            <IconX />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Title *</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.event_date ?? ""}
              onChange={(e) => set("event_date", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Date label (display text)</label>
            <input
              className={inputCls}
              placeholder="2026-09-26 11:00 AM-2:30 PM"
              value={form.date_label}
              onChange={(e) => set("date_label", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Location</label>
            <input
              className={inputCls}
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Event URL</label>
            <input
              className={inputCls}
              placeholder="https://luma.com/…"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Luma embed URL (optional)</label>
            <input
              className={inputCls}
              placeholder="https://luma.com/embed/event/evt-…/simple"
              value={form.embed_url ?? ""}
              onChange={(e) => set("embed_url", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="past">Past</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="label">Registered</label>
            <input
              type="number"
              className={inputCls}
              value={form.registered ?? 0}
              onChange={(e) => set("registered", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Checked in</label>
            <input
              type="number"
              className={inputCls}
              value={form.checked_in ?? ""}
              onChange={(e) =>
                set("checked_in", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="label">Avg rating</label>
            <input
              type="number"
              step="0.1"
              className={inputCls}
              value={form.avg_rating ?? ""}
              onChange={(e) =>
                set("avg_rating", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="label">Rating count</label>
            <input
              type="number"
              className={inputCls}
              value={form.rating_count ?? ""}
              onChange={(e) =>
                set("rating_count", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Cover image URL</label>
            <input
              className={inputCls}
              placeholder="/uploads/… or https://…"
              value={form.cover_image ?? ""}
              onChange={(e) => set("cover_image", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input h-auto py-3"
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">
              Feedback (separate comments with |)
            </label>
            <textarea
              className="input h-auto py-3"
              rows={3}
              value={form.feedback ?? ""}
              onChange={(e) => set("feedback", e.target.value)}
            />
          </div>
        </div>

        {/* Media manager — only for saved events */}
        <div className="mt-8">
          <p className="t-body-sm-bold text-ink mb-3">Media</p>
          {event ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="relative rounded-xl overflow-hidden bg-surface-soft aspect-square group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.url}
                      alt={m.caption ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink-deep/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        className="icon-btn"
                        title="Set as cover"
                        onClick={() => setCover(m.url)}
                      >
                        <IconCheck />
                      </button>
                      <button
                        className="icon-btn text-critical"
                        title="Delete"
                        onClick={() => removeMedia(m.id)}
                      >
                        <IconTrash />
                      </button>
                    </div>
                    {form.cover_image === m.url && (
                      <span className="badge-success absolute top-2 left-2">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                <button
                  className="rounded-xl border-2 border-dashed border-hairline aspect-square flex flex-col items-center justify-center text-steel gap-1 t-caption-bold hover:border-steel transition-colors"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <IconImage />
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/mp4"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  files.forEach(upload);
                  e.target.value = "";
                }}
              />
              <p className="t-caption text-stone mt-2">
                Hover a thumbnail to set it as the cover or delete it.
              </p>
            </>
          ) : (
            <p className="t-body-sm text-steel">
              Save the event first, then upload images.
            </p>
          )}
        </div>

        {err && <p className="t-body-sm text-critical-strong mt-4">{err}</p>}

        <div className="flex gap-3 mt-8">
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : event ? "Save changes" : "Create event"}
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
