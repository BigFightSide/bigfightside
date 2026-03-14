import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter, Gym, Media, Ranking } from '@/payload-types'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from '../components/MediaImageWithFallback'

export const dynamic = 'force-dynamic'

function getProfileImageUrl(profileImage: Fighter['profileImage']): string | null {
  if (!profileImage || typeof profileImage === 'number') return null
  const media = profileImage as Media
  return media?.url ?? null
}

function getGym(gym: Fighter['gym']): Gym | null {
  if (!gym || typeof gym === 'number') return null
  return gym as Gym
}

type RegionValue = 'europe' | 'germany' | 'hessen'

const REGIONS: { label: string; value: RegionValue }[] = [
  { label: 'Europa', value: 'europe' },
  { label: 'Deutschland', value: 'germany' },
  { label: 'Hessen', value: 'hessen' },
]

const WEIGHT_CLASSES: string[] = [
  'Strawweight (bis 52 kg)',
  'Flyweight (bis 57 kg)',
  'Bantamweight (bis 61 kg)',
  'Featherweight (bis 66 kg)',
  'Lightweight (bis 70 kg)',
  'Welterweight (bis 77 kg)',
  'Middleweight (bis 84 kg)',
  'Light Heavyweight (bis 93 kg)',
  'Heavyweight (bis 120 kg)',
]

type SearchParams = {
  region?: RegionValue
  weightClass?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function RankingsPage({ searchParams }: Props) {
  const { region, weightClass } = await searchParams
  const selectedRegion: RegionValue = region && ['europe', 'germany', 'hessen'].includes(region)
    ? region
    : 'germany'
  const selectedWeightClass = weightClass && WEIGHT_CLASSES.includes(weightClass)
    ? weightClass
    : ''

  const payload = await getPayload({ config: configPromise })

  const where: any = {
    region: { equals: selectedRegion },
  }

  if (selectedWeightClass) {
    where.weightClass = { equals: selectedWeightClass }
  }

  const { docs: rankings } = await payload.find({
    collection: 'rankings',
    where,
    depth: 2,
    limit: 50,
  })

  const enriched = rankings
    .map((ranking) => {
      const fighter = ranking.fighter as Fighter | number | undefined
      if (!fighter || typeof fighter === 'number') return null

      // Länder-Rankings automatisch mit Nationalität absichern
      if (selectedRegion === 'germany') {
        if (!fighter.nationality || fighter.nationality.trim().toUpperCase() !== 'DE') {
          return null
        }
      }

      const gym = getGym(fighter.gym)
      const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
      const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`

      return {
        ranking,
        fighter,
        gym,
        imageUrl,
        record,
      }
    })
    .filter((item): item is {
      ranking: Ranking
      fighter: Fighter
      gym: Gym | null
      imageUrl: string | null
      record: string
    } => Boolean(item))
    .sort((a, b) => (a.ranking.position ?? 999) - (b.ranking.position ?? 999))

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
            Rankings
          </h1>
          <p className="mt-2 font-medium text-muted-light">
            Offizielle Big Fight Side Rankings nach Gewichtsklasse und Region.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Filter-Leiste */}
        <section className="mb-6 rounded-2xl border border-border bg-anthracite-card p-4 sm:p-6">
          <form className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Region
                </label>
                <select
                  name="region"
                  defaultValue={selectedRegion}
                  className="mt-1 w-full rounded-lg border border-border bg-anthracite-light px-3 py-2 text-sm text-white outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
                >
                  {REGIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Gewichtsklasse
                </label>
                <select
                  name="weightClass"
                  defaultValue={selectedWeightClass}
                  className="mt-1 w-full rounded-lg border border-border bg-anthracite-light px-3 py-2 text-sm text-white outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
                >
                  <option value="">Alle Gewichtsklassen</option>
                  {WEIGHT_CLASSES.map((wc) => (
                    <option key={wc} value={wc}>
                      {wc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90"
            >
              Filter anwenden
            </button>
          </form>
        </section>

        {/* Ranking-Liste */}
        <section className="rounded-2xl border border-border bg-anthracite-card p-4 sm:p-6">
          {enriched.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium text-muted">
                Für diese Kombination aus Region und Gewichtsklasse sind noch keine Rankings hinterlegt.
              </p>
              <p className="mt-1 text-sm text-muted-light">
                Lege sie im Admin Panel in der Collection &quot;Rankings&quot; an.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {enriched.map(({ ranking, fighter, gym, imageUrl, record }, index) => {
                const isChampion = (ranking.position ?? 0) === 1

                return (
                  <li
                    key={ranking.id}
                    className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:gap-6"
                  >
                    {/* Platzierung */}
                    <div className="flex items-center gap-3 sm:w-32">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-bold ${
                          isChampion
                            ? 'border-gold bg-gold/20 text-gold shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                            : 'border-border bg-anthracite-light text-muted-light'
                        }`}
                      >
                        #{ranking.position}
                      </div>
                      {isChampion && (
                        <span className="rounded-full border border-gold/60 bg-gold/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">
                          C
                        </span>
                      )}
                    </div>

                    {/* Fighter Info */}
                    <div className="flex flex-1 items-center gap-4">
                      <div className="hidden h-14 w-14 overflow-hidden rounded-full bg-anthracite-light sm:block">
                        {imageUrl ? (
                          <MediaImageWithFallback
                            src={imageUrl}
                            alt={fighter.name}
                            fallbackSrc="/fighter-placeholder.png"
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-muted">
                            🥊
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <Link
                          href={`/fighters/${fighter.slug}`}
                          className="font-bold text-base text-white hover:text-accent"
                        >
                          {fighter.name}
                          {fighter.nickname && (
                            <span className="ml-1 font-medium text-muted-light">
                              &quot;{fighter.nickname}&quot;
                            </span>
                          )}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                          <span className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent">
                            Record {record}
                          </span>
                          {gym && (
                            <span className="text-muted-light">
                              {gym.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

