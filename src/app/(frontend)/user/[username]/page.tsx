import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import type { User, Fighter, News, Media } from '@/payload-types'
import { ROLES, ROLE_LABELS } from '@/access/roles'
import { Settings2, Heart, Newspaper } from 'lucide-react'
import { getMediaDisplayUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

function getProfileImageUrl(profileImage: Fighter['profileImage']): string | null {
  if (!profileImage || typeof profileImage === 'number') return null
  return (profileImage as Media)?.url ?? null
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user: currentUser } = await payload.auth({ headers: headersList })

  const result = await payload.find({
    collection: 'users',
    where: { username: { equals: username } },
    limit: 1,
    depth: 1,
  })

  const profileUser = result.docs[0] as User | undefined
  if (!profileUser) notFound()

  const isOwner = currentUser?.id === profileUser.id
  const isAdmin = currentUser?.role === ROLES.admin
  const roleLabel = ROLE_LABELS[profileUser.role] ?? profileUser.role

  // Favorisierte Kämpfer (mit depth:1 bereits vollständig befüllt)
  const favoriteFighters: Fighter[] = ((profileUser.favorites ?? []) as (number | Fighter)[])
    .filter((f): f is Fighter => typeof f !== 'number')

  const favoriteIds = favoriteFighters.map((f) => f.id)

  // Smart News: Neueste News, in denen ein favorisierter Kämpfer getaggt ist
  let smartNews: News[] = []
  if (isOwner && favoriteIds.length > 0) {
    const newsResult = await payload.find({
      collection: 'news',
      where: {
        and: [
          { taggedFighters: { in: favoriteIds } },
          { status: { equals: 'published' } },
        ],
      },
      sort: '-publishedAt',
      limit: 5,
      depth: 0,
    })
    smartNews = newsResult.docs as News[]
  }

  return (
    <main className="min-h-screen bg-anthracite text-white">
      {/* ── Hero ── */}
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <h1 className="font-bold text-4xl tracking-tight text-white sm:text-5xl">
            {profileUser.name}
          </h1>
          <p className="mt-2 text-gold text-lg font-medium">@{profileUser.username}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5">
            <span className="text-sm font-semibold text-gold">{roleLabel}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 space-y-10">
        {/* ── Profildetails ── */}
        <section className="space-y-6 rounded-xl border border-border bg-anthracite-card p-6 sm:p-8">
          {isOwner && (
            <div className="rounded-lg border border-border bg-anthracite-light p-4">
              <p className="text-sm font-semibold text-muted-light">E-Mail</p>
              <p className="mt-1 text-white">{profileUser.email}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-anthracite-light p-4">
            <p className="text-sm font-semibold text-muted-light">Status / Rolle</p>
            <p className="mt-1 text-white">{roleLabel}</p>
          </div>

          {isAdmin && (
            <div className="border-t border-border pt-6">
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/15 px-4 py-2.5 text-sm font-bold text-gold transition hover:bg-gold/25 hover:border-gold/70"
              >
                <Settings2 className="size-4" strokeWidth={2} />
                Admin-Portal aufrufen
              </Link>
            </div>
          )}
        </section>

        {/* ── Meine Favoriten ── */}
        {(isOwner || favoriteFighters.length > 0) && (
          <section>
            <div className="mb-5 flex items-center gap-2.5">
              <Heart className="size-5 text-red-400" fill="currentColor" strokeWidth={0} />
              <h2 className="text-xl font-bold text-white">Meine Favoriten</h2>
              {favoriteFighters.length > 0 && (
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-bold text-red-400">
                  {favoriteFighters.length}
                </span>
              )}
            </div>

            {favoriteFighters.length === 0 ? (
              <div className="rounded-xl border border-border bg-anthracite-card p-8 text-center">
                <Heart className="mx-auto mb-3 size-8 text-muted-light/40" strokeWidth={1.5} />
                <p className="text-sm text-muted-light">Noch keine Favoriten gespeichert.</p>
                <Link
                  href="/fighters"
                  className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  Alle Kämpfer entdecken →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {favoriteFighters.map((fighter) => {
                  const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
                  const record = `${fighter.wins ?? 0}-${fighter.losses ?? 0}-${fighter.draws ?? 0}`
                  return (
                    <Link
                      key={fighter.id}
                      href={`/fighters/${fighter.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_-5px_rgba(184,134,11,0.25)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-anthracite-light">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={fighter.name}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              ;(e.currentTarget as HTMLImageElement).src =
                                '/fighter-placeholder.png'
                            }}
                          />
                        ) : (
                          <img
                            src="/fighter-placeholder.png"
                            alt="Platzhalter"
                            className="h-full w-full object-cover object-top opacity-70"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/80 to-transparent" />
                      </div>
                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-white group-hover:text-accent">
                          {fighter.name}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-muted-light">{record}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Smart News ── */}
        {isOwner && smartNews.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-2.5">
              <Newspaper className="size-5 text-accent" strokeWidth={2} />
              <h2 className="text-xl font-bold text-white">News zu deinen Favoriten</h2>
            </div>
            <div className="space-y-3">
              {smartNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="flex items-start gap-4 rounded-xl border border-border bg-anthracite-card p-4 transition-all duration-200 hover:border-accent/50 hover:bg-anthracite-card/80"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white line-clamp-2 leading-snug transition-colors group-hover:text-accent">
                      {article.title}
                    </p>
                    {article.publishedAt && (
                      <p className="mt-1.5 text-xs text-muted-light">
                        {new Date(article.publishedAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    {article.category && (
                      <span className="mt-2 inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                        {article.category}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/news"
                className="text-sm font-semibold text-muted-light hover:text-accent transition-colors"
              >
                Alle News anzeigen →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
