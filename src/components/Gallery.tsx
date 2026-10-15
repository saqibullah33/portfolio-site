"use client";

import { useEffect, useState } from "react";
import type { EventMedia } from "@/lib/types";
import { IconChevron, IconImage, IconX } from "./icons";

interface Item {
  id: number | string;
  url: string;
  caption?: string | null;
}

export function MediaGallery({
  media,
  cover,
  title,
}: {
  media: EventMedia[];
  cover: string | null;
  title: string;
}) {
  // Merge cover + media into one deduped list (cover first)
  const items: Item[] = [];
  const seen = new Set<string>();
  for (const m of [
    ...(cover ? [{ id: "cover", url: cover, caption: null }] : []),
    ...media,
  ]) {
    if (!seen.has(m.url)) {
      seen.add(m.url);
      items.push(m);
    }
  }

  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const len = items.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setOpen((o) => (o === null ? o : (o + 1) % len));
      if (e.key === "ArrowLeft")
        setOpen((o) => (o === null ? o : (o - 1 + len) % len));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  if (items.length === 0) {
    return (
      <div className="rounded-xxxl bg-surface-soft aspect-[16/9] flex flex-col items-center justify-center text-stone gap-2">
        <IconImage width={32} height={32} />
        <span className="t-caption">No cover image</span>
      </div>
    );
  }

  const current = open !== null ? items[open] : null;

  return (
    <>
      {/* Cover — full image visible, no cropping */}
      <button
        className="block w-full rounded-xxxl overflow-hidden bg-surface-soft cursor-zoom-in"
        onClick={() => setOpen(0)}
        aria-label={`Open ${title} gallery`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={items[0].url}
          alt={title}
          className="w-full max-h-[70vh] object-contain"
        />
      </button>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {items.map((m, i) => (
            <button
              key={m.id}
              className="rounded-xl overflow-hidden bg-surface-soft aspect-square cursor-zoom-in focus:outline-2 focus:outline-offset-2 focus:outline-fb-blue"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt={m.caption ?? `${title} photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[80] bg-ink-deep/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo viewer`}
        >
          <button
            className="icon-btn absolute top-4 right-4 bg-canvas/15 text-canvas hover:bg-canvas/25"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <IconX />
          </button>

          {items.length > 1 && (
            <button
              className="icon-btn absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-canvas/15 text-canvas hover:bg-canvas/25"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open! - 1 + items.length) % items.length);
              }}
              aria-label="Previous photo"
            >
              <IconChevron className="rotate-90" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.caption ?? `${title} photo`}
            className="max-w-full max-h-[82vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {items.length > 1 && (
            <button
              className="icon-btn absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-canvas/15 text-canvas hover:bg-canvas/25"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open! + 1) % items.length);
              }}
              aria-label="Next photo"
            >
              <IconChevron className="-rotate-90" />
            </button>
          )}

          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            {current.caption && (
              <p className="t-body-sm text-canvas/90 mb-1">{current.caption}</p>
            )}
            <p className="t-caption text-canvas/60">
              {open! + 1} / {items.length} — Esc or click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
