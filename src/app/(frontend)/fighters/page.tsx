import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter, Media, Gym } from '@/payload-types'

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

export default async function FightersPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: fighters } = await payload.find({
    collection: 'fighters',
    limit: 100,
    sort: 'name',
    depth: 2,
  })

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      {/* Header */}
      <header className="border-b border-border bg-anthracite/95 backdrop-blur supports-[backdrop-filter]:bg-anthracite/90">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-wider text-muted transition hover:text-accent"
          >
            ← Zurück
          </Link>
          <h1 className="mt-4 font-bold text-4xl tracking-tight text-white sm:text-5xl">
            Kämpfer
          </h1>
          <p className="mt-2 font-medium text-muted-light">
            Die Fighter von Big Fight Side – alle Athleten im Überblick.
          </p>
        </div>
      </header>

      {/* Cards Grid */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {fighters.length === 0 ? (
          <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
            <p className="font-medium text-muted">Noch keine Kämpfer angelegt.</p>
            <p className="mt-1 text-sm text-muted">
              Leg sie im Admin Panel an.
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
                  className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(184,134,11,0.3)]"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />

                  <div className="flex flex-col p-5 pl-6">
                    <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-anthracite-light">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={fighter.name}
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

                    <h2 className="font-bold text-xl text-white transition-colors group-hover:text-accent">
                      {fighter.name}
                      {fighter.nickname && (
                        <span className="ml-1 font-medium text-muted-light">
                          &quot;{fighter.nickname}&quot;
                        </span>
                      )}
                    </h2>

                    <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                      <span className="opacity-90">RECORD</span>
                      <span>{record}</span>
                    </div>

                    {gymName && (
                      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-muted">
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
    </main>
  )
}
