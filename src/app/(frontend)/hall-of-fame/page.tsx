import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { HallOfFame as HallOfFameType, Media } from '@/payload-types'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from '../components/MediaImageWithFallback'
import { Trophy, Quote } from 'lucide-react'

export const dynamic = 'force-dynamic'

function getImageUrl(image: HallOfFameType['image']): string | null {
  if (!image || typeof image === 'number') return null
  const media = image as Media
  return media?.url ?? null
}

export default async function HallOfFamePage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: legends } = await payload.find({
    collection: 'hall-of-fame',
    sort: 'sortOrder',
    depth: 2,
  })

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero – ehrfurcht gebietend */}
      <section className="relative overflow-hidden border-b border-amber-900/40 bg-gradient-to-b from-amber-950/20 to-black">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="size-10 text-amber-500/90" strokeWidth={1.25} aria-hidden />
            <h1 className="font-bold text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
              Hall of Fame
            </h1>
            <Trophy className="size-10 text-amber-500/90" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="mx-auto max-w-2xl text-center text-lg text-amber-200/80 sm:text-xl">
            Die Legenden, die den Sport geprägt haben – unvergessen.
          </p>
        </div>
      </section>

      {/* Legenden-Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {legends.length === 0 ? (
          <div className="rounded-2xl border border-amber-900/30 bg-amber-950/10 p-16 text-center">
            <Trophy className="mx-auto size-16 text-amber-600/50" strokeWidth={1} aria-hidden />
            <p className="mt-4 text-lg text-amber-200/70">
              Noch keine Legenden aufgenommen.
            </p>
            <p className="mt-1 text-sm text-amber-300/50">
              Legenden können im <a href="/admin" className="font-semibold text-amber-400 hover:text-amber-300 underline">Admin Panel</a> unter „Hall of Fame“ angelegt werden.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {legends.map((legend) => {
              const imageUrl = getMediaDisplayUrl(getImageUrl(legend.image))
              const achievements = legend.achievements ?? []

              return (
                <article
                  key={legend.id}
                  className="group relative overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-amber-950/20 to-black/80 transition-all duration-300 hover:border-amber-600/50 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)]"
                >
                  {/* Goldener Akzent oben */}
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                  {/* Bild – Schwarz-Weiß, hoher Kontrast */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                    {imageUrl ? (
                      <div
                        className="absolute inset-0 overflow-hidden transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'grayscale(100%) contrast(1.15) brightness(0.9)' }}
                      >
                        <MediaImageWithFallback
                          src={imageUrl}
                          alt={legend.name}
                          fallbackSrc="/fighter-placeholder.png"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                        <Trophy className="size-20 text-amber-700/40" strokeWidth={1} aria-hidden />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                        {legend.activeYears}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h2 className="font-bold text-xl text-white sm:text-2xl">
                      {legend.name}
                    </h2>

                    {achievements.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {achievements.map((a) => (
                          <li
                            key={a.id ?? a.title}
                            className="flex items-start gap-2 text-sm text-amber-200/90"
                          >
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                            {a.title}
                          </li>
                        ))}
                      </ul>
                    )}

                    {legend.legacy && (
                      <blockquote className="mt-4 flex gap-2 rounded-lg border-l-2 border-amber-600/60 bg-amber-950/20 px-3 py-2">
                        <Quote className="mt-0.5 size-4 shrink-0 text-amber-500/70" aria-hidden />
                        <p className="text-sm italic text-amber-100/90">
                          &quot;{legend.legacy}&quot;
                        </p>
                      </blockquote>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
