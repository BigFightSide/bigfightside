import Link from 'next/link'
import { FaInstagram, FaYoutube, FaFacebookF, FaTiktok, FaXTwitter } from 'react-icons/fa6'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-anthracite-light text-sm text-white">
      {/* Newsletter-Zeile */}
      <div className="border-b border-border bg-anthracite py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wide text-white">
              Keine News von Big Fight Side mehr verpassen
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted-light">
              Bleib auf dem Laufenden zu neuen Events, Kämpfern, Rankings und exklusiven Aktionen aus der MMA‑Szene.
            </p>
          </div>
          <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Ihre E‑Mail"
              className="h-10 flex-1 rounded-md border border-border bg-anthracite-card px-3 text-xs text-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-xs font-semibold uppercase tracking-wide text-black transition hover:bg-accent-hover"
            >
              Jetzt abonnieren
            </button>
          </form>
        </div>
      </div>

      {/* Link-Spalten & Social */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Spalte 1: Brand + Infos */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="text-lg font-bold tracking-tight text-white">Big Fight Side</div>
              <p className="text-xs text-muted-light">
                Deine Plattform für MMA in Deutschland und Europa – Events, Kämpfer, Gyms, Rankings und News auf einen Blick.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-light">Infos</h3>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link href="/about" className="transition hover:text-accent-hover">
                    Über Big Fight Side
                  </Link>
                </li>
                <li>
                  <Link href="/bars" className="transition hover:text-accent-hover">
                    Sportsbars & Partner
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-accent-hover">
                    Kontakt & Kooperationen
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="transition hover:text-accent-hover">
                    Hilfe & FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Spalte 2: Wichtige Seiten */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-light">Plattform</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/events" className="transition hover:text-accent-hover">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/fighters" className="transition hover:text-accent-hover">
                  Kämpfer
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="transition hover:text-accent-hover">
                  Rankings
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition hover:text-accent-hover">
                  News
                </Link>
              </li>
              <li>
                <Link href="/gyms" className="transition hover:text-accent-hover">
                  Gyms
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte 3: Social */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-light">Folge uns</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: 'Instagram', href: 'https://instagram.com/bigfightside', Icon: FaInstagram },
                { label: 'YouTube', href: 'https://youtube.com', Icon: FaYoutube },
                { label: 'Facebook', href: 'https://facebook.com', Icon: FaFacebookF },
                { label: 'TikTok', href: 'https://tiktok.com', Icon: FaTiktok },
                { label: 'X', href: 'https://x.com', Icon: FaXTwitter },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-anthracite px-3 py-1 text-xs font-medium text-white transition hover:bg-anthracite-card hover:text-accent-hover"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-anthracite">
                    <item.Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Untere Zeile */}
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-light">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Big Fight Side. Alle Rechte vorbehalten.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/privacy" className="transition hover:text-white">
                Datenschutz
              </Link>
              <Link href="/imprint" className="transition hover:text-white">
                Impressum
              </Link>
              <Link href="/cookies" className="transition hover:text-white">
                Cookie-Einstellungen
              </Link>
            </div>
          </div>
        </div>

        {/* Design-Credit */}
        <div className="border-t border-border py-4 text-center text-xs text-muted-light">
          <a
            href="https://www.319Webdesign.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            designed by 319Webdesign
          </a>
        </div>
      </div>
    </footer>
  )
}

