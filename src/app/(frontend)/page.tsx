import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter, Media, Gym, Event, HallOfFame as HallOfFameLegend } from '@/payload-types'
import React from 'react'
import { Package, ExternalLink } from 'lucide-react'
import { products } from '@/lib/warehouse-products'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from './components/MediaImageWithFallback'
import { fetchMMANews } from '@/lib/newsdata'
import { SpotlightHero } from './components/SpotlightHero'

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

function getLegendImageUrl(image: HallOfFameLegend['image']): string | null {
  if (!image || typeof image === 'number') return null
  const media = image as Media
  return media?.url ?? null
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
    { docs: legends },
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
    payload.find({
      collection: 'hall-of-fame',
      limit: 6,
      sort: 'sortOrder',
      depth: 2,
    }),
  ])

  const newsItems =
    newsApiData.status === 'success' && newsApiData.results
      ? newsApiData.results.slice(0, 5)
      : []

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <SpotlightHero newsItems={newsItems} />

      {/* Direkt unter Hero: 2er-Grid 50/50 mit Events und Hall of Fame */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <aside className="flex min-w-0" aria-label="Nächste Termine">
            <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-anthracite-card p-5">
              <h2 className="mb-4 shrink-0 text-lg font-bold tracking-tight text-gold">Nächste Termine</h2>
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-3">
                {upcomingEvents.length === 0 ? (
                  <p className="py-4 text-sm text-white">Keine anstehenden Events.</p>
                ) : (
                  upcomingEvents.map((event: Event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block rounded-lg border border-border bg-anthracite-light p-3 transition-colors hover:border-accent hover:text-accent"
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {formatEventDate(event.date)}
                      </span>
                      <span className="mt-0.5 block font-semibold text-white">{event.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-light">{event.location}</span>
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

          <aside className="flex min-w-0" aria-label="Neueste Kämpfer">
            <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-anthracite-card p-5">
              <h2 className="mb-4 shrink-0 text-lg font-bold tracking-tight text-gold">Neueste Kämpfer</h2>
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-3">
                {fighters.length === 0 ? (
                  <p className="py-4 text-sm text-white">Noch keine Kämpfer angelegt.</p>
                ) : (
                  fighters.slice(0, 4).map((fighter) => {
                    const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
                    const gymName = getGymName(fighter.gym)
                    const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`
                    return (
                      <Link
                        key={fighter.id}
                        href={`/fighters/${fighter.slug}`}
                        className="group flex items-center gap-3 rounded-lg border border-border bg-anthracite-light p-3 transition-colors hover:border-accent"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-anthracite">
                          <MediaImageWithFallback
                            src={imageUrl || '/fighter-placeholder.png'}
                            alt={fighter.name}
                            fallbackSrc="/fighter-placeholder.png"
                            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white group-hover:text-accent">
                            {fighter.name}
                          </p>
                          <p className="text-xs text-muted-light">
                            {record}
                            {gymName ? ` · ${gymName}` : ''}
                          </p>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
              <Link
                href="/fighters"
                className="mt-4 flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-accent/50 bg-accent/5 py-2.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
              >
                Alle Kämpfer
                <span className="font-bold">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6">
      {/* Hall of Fame */}
      <section className="min-w-0 border-t border-border bg-anthracite">
        <div className="py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-white sm:text-2xl">
                Hall of Fame
              </h2>
              <p className="mt-1 text-muted-light">
                Legenden, die den Sport gepraegt haben
              </p>
            </div>
            <Link
              href="/hall-of-fame"
              className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Zur Hall of Fame
              <span className="font-bold">→</span>
            </Link>
          </div>

          {legends.length === 0 ? (
            <div className="rounded-xl border border-border bg-anthracite-card p-8 text-center">
              <p className="text-muted">Noch keine Legenden eingetragen.</p>
              <p className="mt-1 text-sm text-muted">
                Lege sie im <Link href="/admin" className="font-semibold text-accent hover:underline">Admin Panel</Link> an.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {legends.map((legend) => {
                const imageUrl = getMediaDisplayUrl(getLegendImageUrl(legend.image))

                return (
                  <Link
                    key={legend.id}
                    href="/hall-of-fame"
                    className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)]"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="flex flex-col p-4 pl-5">
                      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-anthracite-light">
                        <MediaImageWithFallback
                          src={imageUrl || '/fighter-placeholder.png'}
                          alt={legend.name}
                          fallbackSrc="/fighter-placeholder.png"
                          className="h-full w-full object-cover object-top grayscale transition-transform duration-300 group-hover:scale-105 group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 to-transparent opacity-60" />
                      </div>
                      <h3 className="font-semibold text-base text-white transition-colors group-hover:text-accent">
                        {legend.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-light">{legend.activeYears}</p>
                      {legend.legacy && (
                        <p className="mt-2 line-clamp-2 text-xs italic text-muted">
                          &quot;{legend.legacy}&quot;
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
      </div>

      {/* Aus dem Warehouse */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
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
