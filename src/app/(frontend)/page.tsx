import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter, Media, Gym, Event } from '@/payload-types'
import React from 'react'
import { Megaphone, Package, ExternalLink } from 'lucide-react'
import { products } from '@/lib/warehouse-products'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from './components/MediaImageWithFallback'
import { fetchMMANews } from '@/lib/newsdata'

export const dynamic = 'force-dynamic'

function getProfileImageUrl(profileImage: Fighter['profileImage']): string | null {
  if (!profileImage || typeof profileImage === 'number') return null
  const media = profileImage as Media
  return media?.url ?? null
}

function getGymName(gym: Fighter['gym']): string | null {
  if (!gym || typeof gym === 'number') return null
  return (gym as Gym).name ?? null
}

function formatNewsDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Kompaktes Datum für Event-Karten (z. B. "15. März" oder "15.03. 18:00") */
function formatEventDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const hasTime = dateStr.includes('T') && dateStr.length > 10
  if (hasTime) {
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  const [
    { docs: fighters },
    newsApiData,
    { docs: upcomingEvents },
  ] = await Promise.all([
    payload.find({
      collection: 'fighters',
      limit: 4,
      sort: '-updatedAt',
      depth: 2,
    }),
    fetchMMANews(),
    payload.find({
      collection: 'events',
      limit: 4,
      sort: 'date',
      depth: 0,
      where: {
        and: [
          { status: { equals: 'upcoming' } },
          { date: { greater_than_equal: now } },
        ],
      },
    }),
  ])

  const newsItems =
    newsApiData.status === 'success' && newsApiData.results
      ? newsApiData.results.slice(0, 3)
      : []

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      {/* Hero */}
      <section className="relative flex min-h-[28vh] sm:min-h-[38vh] md:min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-anthracite-light">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(18,18,18,0.5) 0%, rgba(18,18,18,0.75) 50%, #121212 100%), url("/hero-bg.png")`,
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:py-16 text-center">
          <h1 className="mx-auto max-w-4xl font-bold text-3xl leading-tight tracking-tight text-gold sm:text-5xl md:text-6xl lg:text-7xl">
            Big Fight Side
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-base text-muted-light sm:mt-4 sm:text-xl md:text-2xl">
            Kämpfe verfolgen. Fakten checken. Legenden ehren.
          </p>
        </div>
      </section>

      {/* Hauptbereich: Desktop 2 Spalten – links News+Kämpfer, rechts Events + Werbeplatz (Werbebanner bündig mit Kämpfer-Sektion) */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_1fr] lg:gap-10">
      {/* 1. Aktuelle News */}
      <section className="min-w-0 lg:order-1 lg:row-1 rounded-xl border border-border bg-anthracite-light">
        <div className="px-5 py-10 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-white sm:text-2xl">
                Aktuelle News
              </h2>
              <p className="mt-1 text-muted-light">
                Aktuelle Meldungen und Stories
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Alle News
              <span className="font-bold">→</span>
            </Link>
          </div>

          {newsItems.length === 0 ? (
            <div className="rounded-xl border border-border bg-anthracite-card p-8 text-center">
              <p className="text-muted">Keine News verfügbar.</p>
              <p className="mt-1 text-sm text-muted">
                Aktuelle MMA-News werden von externen Quellen geladen.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-6">
              {newsItems.map((item) => {
                const dateStr = formatNewsDate(item.pubDate)
                return (
                  <a
                    key={item.article_id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)]"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex min-h-0 w-28 shrink-0 overflow-hidden rounded-l-xl bg-anthracite sm:w-36">
                      <img
                        src={item.image_url ?? '/hero-bg.png'}
                        alt=""
                        className="h-full min-h-[80px] w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:min-h-[100px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-anthracite/60 to-transparent sm:from-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-3 pl-4 sm:p-4 sm:pl-5">
                      <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {dateStr}
                        {item.source_name && ` · ${item.source_name}`}
                      </span>
                      <h3 className="font-semibold text-sm text-white transition-colors group-hover:text-accent line-clamp-2 sm:text-base">
                        {item.title}
                      </h3>
                      <span className="mt-2 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-accent group-hover:underline">
                        Mehr lesen
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* 2. Nächste Termine (Events) – Desktop: rechte Spalte, Zeile 1 */}
      <aside className="flex lg:order-2 lg:row-1 lg:min-w-0" aria-label="Nächste Termine">
            <div className="sticky top-6 flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-anthracite-card p-5 lg:p-4">
              <h2 className="mb-4 shrink-0 text-lg font-bold tracking-tight text-gold">
                Nächste Termine
              </h2>
              <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-border">
                {upcomingEvents.length === 0 ? (
                  <p className="col-span-2 py-4 text-sm text-white lg:col-span-1">
                    Keine anstehenden Events.
                  </p>
                ) : (
                  upcomingEvents.map((event: Event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block rounded-lg border border-border bg-anthracite-light p-3 transition-colors hover:border-accent hover:text-accent lg:rounded-none lg:border-0 lg:bg-transparent lg:py-4 lg:first:pt-0 lg:last:pb-0"
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {formatEventDate(event.date)}
                      </span>
                      <span className="mt-0.5 block font-semibold text-white">
                        {event.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-light">
                        {event.location}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              <Link
                href="/events"
                className="mt-4 flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-accent/50 bg-accent/5 py-2.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
              >
                Alle Events
                <span className="font-bold">→</span>
              </Link>
            </div>
          </aside>

      {/* 3. Neueste Kämpfer */}
      <section className="min-w-0 border-t border-border bg-anthracite lg:order-3 lg:row-2">
        <div className="py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-white sm:text-2xl">
                Neueste Kämpfer
              </h2>
              <p className="mt-1 text-muted-light">
                Die zuletzt hinzugefügten Athleten
              </p>
            </div>
            <Link
              href="/fighters"
              className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Alle Kämpfer
              <span className="font-bold">→</span>
            </Link>
          </div>

          {fighters.length === 0 ? (
            <div className="rounded-xl border border-border bg-anthracite-card p-8 text-center">
              <p className="text-muted">Noch keine Kämpfer angelegt.</p>
              <p className="mt-1 text-sm text-muted">
                Leg sie im <Link href="/admin" className="font-semibold text-accent hover:underline">Admin Panel</Link> an.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {fighters.map((fighter, index) => {
                const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
                const gymName = getGymName(fighter.gym)
                const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`

                return (
                  <Link
                    key={fighter.id}
                    href={`/fighters/${fighter.slug}`}
                    className={`group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)] ${index === 3 ? 'lg:hidden' : ''}`}
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="flex flex-col p-4 pl-5">
                      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-anthracite-light">
                        {imageUrl ? (
                          <MediaImageWithFallback
                            src={imageUrl}
                            alt={fighter.name}
                            fallbackSrc="/fighter-placeholder.png"
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src="/fighter-placeholder.png"
                            alt="Platzhalter-Kämpfer"
                            className="h-full w-full object-cover object-top opacity-80"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 to-transparent opacity-60" />
                      </div>
                      <h3 className="font-semibold text-base text-white transition-colors group-hover:text-accent">
                        {fighter.name}
                        {fighter.nickname && (
                          <span className="ml-1 font-medium text-muted-light">
                            &quot;{fighter.nickname}&quot;
                          </span>
                        )}
                      </h3>
                      <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                        <span className="text-accent opacity-90">RECORD</span>
                        <span>{record}</span>
                      </div>
                      {gymName && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                          <span className="text-gold">▸</span>
                          {gymName}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Werbeplatz (Ad-Slot) – Desktop: bündig mit Kämpfer-Sektion */}
      <div className="lg:order-4 lg:row-2 lg:min-w-0 lg:self-start">
        <div className="rounded-xl border border-border bg-anthracite-card p-5 lg:p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-light">
            Anzeige
          </span>
          <div className="mt-3 flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-border bg-anthracite-light">
            <Megaphone className="size-10 text-muted-light" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="mt-3 text-center text-sm text-muted-light">
            Hier werben & lokale Kämpfer unterstützen
          </p>
          <Link
            href="/kontakt"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-anthracite-light py-2 text-xs font-semibold text-white transition hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            Mehr Infos
            <span className="font-bold">→</span>
          </Link>
        </div>
      </div>
        </div>
      </div>

      {/* Aus dem Warehouse */}
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <section className="border-t border-border pt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-white sm:text-2xl">
                Aus dem Warehouse
              </h2>
              <p className="mt-1 text-muted-light">
                Empfohlene Ausrüstung für deinen Kampfsport
              </p>
            </div>
            <Link
              href="/warehouse"
              className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Zum Warehouse
              <span className="font-bold">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <a
                key={product.id}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)]"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="flex flex-1 flex-col p-4 pl-5">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-anthracite-light">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-anthracite">
                        <Package className="size-12 text-muted opacity-40" aria-hidden />
                      </div>
                    )}
                  </div>
                  <h3 className="line-clamp-2 font-semibold text-sm text-white transition-colors group-hover:text-accent">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-light">
                    {product.description}
                  </p>
                  <div className="mt-2 inline-flex w-fit items-center rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                    {product.price}
                  </div>
                  <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-accent group-hover:underline">
                    Bei Amazon prüfen
                    <ExternalLink className="size-3" aria-hidden />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}
