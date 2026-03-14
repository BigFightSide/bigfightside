import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter, Media, Gym, Event } from '@/payload-types'
import React from 'react'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from './components/MediaImageWithFallback'

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

function getNewsImageUrl(news: { featuredImage?: { url?: string | null } | number | null }): string | null {
  const img = news.featuredImage
  if (!img || typeof img === 'number') return null
  const url = (img as { url?: string | null }).url
  return url ?? null
}

function formatNewsDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
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
    { docs: newsItems },
    { docs: upcomingEvents },
  ] = await Promise.all([
    payload.find({
      collection: 'fighters',
      limit: 3,
      sort: '-updatedAt',
      depth: 2,
    }),
    payload.find({
      collection: 'news',
      limit: 3,
      sort: '-publishedAt',
      depth: 2,
    }),
    payload.find({
      collection: 'events',
      limit: 5,
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

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden bg-anthracite-light">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(18,18,18,0.5) 0%, rgba(18,18,18,0.75) 50%, #121212 100%), url("/hero-bg.png")`,
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Big Fight Side
          </p>
          <h1 className="max-w-3xl font-bold text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Die Home of MMA in Hessen
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-light sm:text-lg">
            Deine Plattform für Kämpfer, Gyms und Events – mitten in Hessen.
          </p>
        </div>
      </section>

      {/* Hauptbereich: Inhalt (3/4) + Event-Sidebar (1/4); Mobil: Inhalt oben, Sidebar unten */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_1fr] lg:gap-10">
          {/* Linke Spalte: News + Kämpfer */}
          <div className="min-w-0">
      {/* Neueste News */}
      <section className="rounded-xl border border-border bg-anthracite-light">
        <div className="px-5 py-10 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-white sm:text-2xl">
                Neueste News
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
              <p className="text-muted">Noch keine News vorhanden.</p>
              <p className="mt-1 text-sm text-muted">
                News im <Link href="/admin" className="font-semibold text-accent hover:underline">Admin Panel</Link> anlegen.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => {
                const imageUrl = getMediaDisplayUrl(getNewsImageUrl(item))
                const dateStr = formatNewsDate(item.publishedAt ?? item.updatedAt)
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)]"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-anthracite">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-anthracite text-3xl text-muted">
                            📰
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/80 to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col p-4 pl-5">
                        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                          {dateStr}
                        </span>
                        <h3 className="font-semibold text-base text-white transition-colors group-hover:text-accent line-clamp-2">
                          {item.title}
                        </h3>
                        <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-accent group-hover:underline">
                          Mehr lesen
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Neueste Kämpfer */}
      <section className="border-t border-border bg-anthracite">
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fighters.map((fighter) => {
                const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
                const gymName = getGymName(fighter.gym)
                const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`

                return (
                  <Link
                    key={fighter.id}
                    href={`/fighters/${fighter.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)]"
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
          </div>

          {/* Rechte Spalte: Nächste Termine (Sidebar) */}
          <aside className="lg:min-w-0">
            <div className="sticky top-6 rounded-xl border border-border bg-anthracite-card p-5 lg:p-4">
              <h2 className="mb-4 text-lg font-bold tracking-tight text-gold">
                Nächste Termine
              </h2>
              <div className="divide-y divide-border">
                {upcomingEvents.length === 0 ? (
                  <p className="py-4 text-sm text-white">
                    Keine anstehenden Events.
                  </p>
                ) : (
                  upcomingEvents.map((event: Event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block py-4 first:pt-0 last:pb-0 transition-colors hover:text-accent"
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-accent/50 bg-accent/5 py-2.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
              >
                Alle Events
                <span className="font-bold">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

    </main>
  )
}
