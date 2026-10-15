"use client";

import { useState } from "react";
import Link from "next/link";
import { SOCIALS } from "@/lib/socials";
import { IconGithub, IconLinkedIn, IconMail, IconX, IconX2 } from "./icons";

const TABS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Community", href: "#community" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Promo banner */}
      <div className="bg-ink-deep text-canvas t-body-sm-bold px-6 py-3 text-center">
        Open to new opportunities — full-stack &amp; AI engineering ·{" "}
        <a
          href="mailto:saqibregi43@gmail.com"
          className="underline underline-offset-2"
        >
          Get in touch
        </a>
      </div>

      <header className="sticky top-0 z-50 bg-canvas border-b border-hairline-soft">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="t-subtitle-lg text-ink-deep heading-feature">
            Saqib Ullah
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {TABS.map((t) => (
              <a key={t.href} href={t.href} className="pill-tab">
                {t.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="icon-btn border border-hairline-soft"
            >
              <IconGithub />
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="icon-btn border border-hairline-soft hidden sm:inline-flex"
            >
              <IconLinkedIn />
            </a>
            <a
              href={SOCIALS.x}
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="icon-btn border border-hairline-soft hidden sm:inline-flex"
            >
              <IconX2 />
            </a>
            <a
              href={`mailto:${SOCIALS.email}`}
              aria-label="Email"
              className="icon-btn border border-hairline-soft hidden sm:inline-flex"
            >
              <IconMail />
            </a>
            <button
              className="icon-btn border border-hairline-soft md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? (
                <IconX />
              ) : (
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-hairline-soft px-6 py-4 flex flex-col gap-2">
            {TABS.map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="pill-tab self-start"
                onClick={() => setOpen(false)}
              >
                {t.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
