import { SOCIALS } from "@/lib/socials";

export function Footer() {
  return (
    <footer className="border-t border-hairline-soft bg-canvas">
      <div className="container-page py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <p className="t-subtitle-lg text-ink-deep heading-feature">
            Saqib Ullah
          </p>
          <p className="t-body-sm text-steel mt-2 max-w-xs">
            Software Engineer · Peshawar, Pakistan. Building web apps, backends
            and AI products — and growing the local developer community.
          </p>
        </div>
        <div>
          <p className="t-body-sm-bold text-ink mb-3">Site</p>
          <ul className="space-y-2 t-body-sm text-steel">
            <li><a href="#about" className="hover:text-ink">About</a></li>
            <li><a href="#skills" className="hover:text-ink">Skills</a></li>
            <li><a href="#community" className="hover:text-ink">Community</a></li>
            <li><a href="#contact" className="hover:text-ink">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="t-body-sm-bold text-ink mb-3">Connect</p>
          <ul className="space-y-2 t-body-sm text-steel">
            <li>
              <a href={SOCIALS.github} target="_blank" rel="noreferrer" className="hover:text-ink">
                GitHub
              </a>
            </li>
            <li>
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={SOCIALS.x} target="_blank" rel="noreferrer" className="hover:text-ink">
                X / Twitter
              </a>
            </li>
            <li>
              <a href={`mailto:${SOCIALS.email}`} className="hover:text-ink">
                {SOCIALS.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SOCIALS.phone}`} className="hover:text-ink">
                0334-1958928
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline-soft">
        <div className="container-page py-4 flex items-center justify-between t-caption text-stone">
          <span>© {new Date().getFullYear()} Saqib Ullah</span>
          <a href="/admin" className="hover:text-steel">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
