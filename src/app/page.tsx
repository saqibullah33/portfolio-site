import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { EventsSection } from "@/components/Events";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { listEvents } from "@/lib/db";
import type { PortfolioEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let events: PortfolioEvent[] = [];
  let dbError = false;
  try {
    events = await listEvents();
  } catch {
    dbError = true;
  }

  return (
    <>
      <Nav />
      <main>
        {dbError && (
          <div className="container-page mt-6">
            <div className="badge-critical">DATABASE_URL not configured</div>
            <p className="t-body-sm text-steel mt-2">
              Add your Neon connection string to <code>.env</code>, then run{" "}
              <code>npm run db:setup</code> and restart the dev server.
            </p>
          </div>
        )}
        <Hero events={events} />
        <About />
        <Skills />
        <EventsSection events={events} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
