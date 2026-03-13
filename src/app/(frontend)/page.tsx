import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter, Media, Gym } from '@/payload-types'
import React from 'react'

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

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [
    { docs: fighters },
    { docs: newsItems },
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
  ])

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden bg-anthracite-light">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(18,18,18,0.4) 0%, rgba(18,18,18,0.85) 60%, #121212 100%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E02424' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Big Fight Side
          </p>
          <h1 className="max-w-3xl font-bold text-4xl leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Die Home of MMA in Hessen
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-light">
            Deine Plattform für Kämpfer, Gyms und Events – mitten in Hessen.
          </p>
        </div>
      </section>

      {/* Neueste Kämpfer */}
      <section className="border-t border-border bg-anthracite">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-2xl text-white sm:text-3xl">
                Neueste Kämpfer
              </h2>
              <p className="mt-1 text-muted-light">
                Die zuletzt hinzugefügten Athleten
              </p>
            </div>
            <Link
              href="/fighters"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-accent bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Alle Kämpfer
              <span className="font-bold">→</span>
            </Link>
          </div>

          {fighters.length === 0 ? (
            <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
              <p className="text-muted">Noch keine Kämpfer angelegt.</p>
              <p className="mt-1 text-sm text-muted">
                Leg sie im <Link href="/admin" className="font-semibold text-accent hover:underline">Admin Panel</Link> an.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fighters.map((fighter) => {
                const imageUrl = getProfileImageUrl(fighter.profileImage)
                const gymName = getGymName(fighter.gym)
                const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`

                return (
                  <Link
                    key={fighter.id}
                    href={`/fighters/${fighter.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(224,36,36,0.25)]"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="flex flex-col p-5 pl-6">
                      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-anthracite-light">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={fighter.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-anthracite-light text-4xl text-muted">
                            🥊
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 to-transparent opacity-60" />
                      </div>
                      <h3 className="font-bold text-xl text-white transition-colors group-hover:text-accent">
                        {fighter.name}
                        {fighter.nickname && (
                          <span className="ml-1 font-medium text-muted-light">
                            &quot;{fighter.nickname}&quot;
                          </span>
                        )}
                      </h3>
                      <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                        <span className="text-accent opacity-90">RECORD</span>
                        <span>{record}</span>
                      </div>
                      {gymName && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
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

      {/* Neueste News */}
      <section className="border-t border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-bold text-2xl text-white sm:text-3xl">
                Neueste News
              </h2>
              <p className="mt-1 text-muted-light">
                Aktuelle Meldungen und Stories
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-accent bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Alle News
              <span className="font-bold">→</span>
            </Link>
          </div>

          {newsItems.length === 0 ? (
            <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
              <p className="text-muted">Noch keine News vorhanden.</p>
              <p className="mt-1 text-sm text-muted">
                News im <Link href="/admin" className="font-semibold text-accent hover:underline">Admin Panel</Link> anlegen.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => {
                const imageUrl = getNewsImageUrl(item)
                const dateStr = formatNewsDate(item.publishedAt ?? item.updatedAt)
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(224,36,36,0.25)]"
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
                          <div className="flex h-full w-full items-center justify-center bg-anthracite text-4xl text-muted">
                            📰
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/80 to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col p-5 pl-6">
                        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                          {dateStr}
                        </span>
                        <h3 className="font-bold text-lg text-white transition-colors group-hover:text-accent line-clamp-2">
                          {item.title}
                        </h3>
                        <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-accent group-hover:underline">
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

      {/* Footer */}
      <footer className="border-t border-border bg-anthracite py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-muted">
              Big Fight Side – Die Home of MMA in Hessen
            </p>
            <div className="flex gap-6">
              <Link href="/news" className="text-sm font-semibold text-muted-light hover:text-accent">
                News
              </Link>
              <Link href="/fighters" className="text-sm font-semibold text-muted-light hover:text-accent">
                Kämpfer
              </Link>
              <Link href="/admin" className="text-sm font-semibold text-muted-light hover:text-gold">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
