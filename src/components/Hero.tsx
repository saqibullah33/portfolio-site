import type { PortfolioEvent } from "@/lib/types";

export function Hero({ events }: { events: PortfolioEvent[] }) {
  const totalRegistered = events.reduce((s, e) => s + (e.registered || 0), 0);
  const stats = [
    { value: "4+", label: "Years of experience" },
    { value: String(events.length), label: "Meetups hosted" },
    { value: `${totalRegistered}+`, label: "Developers reached" },
    { value: "AI", label: "RAG · LangChain · LangGraph" },
  ];

  return (
    <section className="container-page pt-16 pb-8 md:pt-24 md:pb-12">
      <div className="rounded-feature bg-surface-soft px-8 py-16 md:px-16 md:py-24 relative overflow-hidden">
        {/* decorative cobalt wash — subtle, photographic-role substitute */}
        <div
          className="absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #0064e0 0%, transparent 65%)" }}
        />
        <p className="t-body-sm-bold text-steel mb-4">
          Software Engineer — Peshawar, Pakistan
        </p>
        <h1 className="t-hero text-ink-deep max-w-4xl">
          I build web apps, backends &amp; AI agents.
        </h1>
        <p className="t-subtitle text-charcoal mt-6 max-w-2xl">
          React, Next.js, Node.js and Python for product work — RAG, LangChain
          and LangGraph for the new wave of intelligent software. I also host
          developer meetups across Peshawar.
        </p>
        <div className="flex flex-wrap gap-3 mt-10">
          <a href="#community" className="btn-primary">
            See the community work
          </a>
          <a href="mailto:saqibregi43@gmail.com" className="btn-secondary">
            Get in touch
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.label} className="card-icon">
            <p className="t-heading-sm text-ink-deep heading-feature">
              {s.value}
            </p>
            <p className="t-body-sm text-steel mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
