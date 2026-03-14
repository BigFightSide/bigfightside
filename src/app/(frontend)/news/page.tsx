import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMediaDisplayUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

function getNewsImageUrl(news: { featuredImage?: { url?: string | null } | number | null }): string | null {
  const img = news.featuredImage
  if (!img || typeof img === 'number') return null
  const url = (img as { url?: string | null }).url
  return url ?? null
}

function formatNewsDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function NewsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: newsItems } = await payload.find({
    collection: 'news',
    sort: '-publishedAt',
    depth: 2,
  })

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="font-bold text-3xl text-white sm:text-4xl">
            News
          </h1>
          <p className="mt-2 text-muted-light">
            Alle Meldungen und Stories von Big Fight Side
          </p>
        </div>
      </section>

      <section className="bg-anthracite">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
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
                const imageUrl = getMediaDisplayUrl(getNewsImageUrl(item))
                const dateStr = formatNewsDate(item.publishedAt ?? item.updatedAt)
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(184,134,11,0.3)]"
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
                        <h2 className="font-bold text-lg text-white transition-colors group-hover:text-accent line-clamp-2">
                          {item.title}
                        </h2>
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
    </main>
  )
}
