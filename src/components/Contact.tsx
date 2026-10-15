import { SOCIALS } from "@/lib/socials";
import {
  IconArrowRight,
  IconGithub,
  IconLinkedIn,
  IconMail,
  IconPhone,
  IconX2,
} from "./icons";

const LINKS = [
  { icon: IconGithub, label: "GitHub", href: SOCIALS.github },
  { icon: IconLinkedIn, label: "LinkedIn", href: SOCIALS.linkedin },
  { icon: IconX2, label: "X / Twitter", href: SOCIALS.x },
];

export function Contact() {
  return (
    <section id="contact" className="container-page section">
      <div className="card-promo">
        <div className="max-w-2xl">
          <h2 className="t-display">Let&apos;s build something.</h2>
          <p className="t-subtitle text-canvas/80 mt-4">
            Full-stack development, AI/RAG applications, or a meetup in your
            city — I&apos;m up for it.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={`mailto:${SOCIALS.email}`}
              className="btn-cta bg-canvas text-ink-deep active:bg-surface-soft"
            >
              Email me <IconArrowRight />
            </a>
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary border-canvas text-canvas"
              >
                <l.icon /> {l.label}
              </a>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 t-body-sm text-canvas/80">
            <span className="inline-flex items-center gap-2">
              <IconMail width={16} height={16} /> {SOCIALS.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <IconPhone width={16} height={16} /> {SOCIALS.phone}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
