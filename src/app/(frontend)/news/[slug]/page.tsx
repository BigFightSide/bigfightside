import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

function getNewsImageUrl(news: { featuredImage?: { url?: string } | number | null }): string | null {
  const img = news.featuredImage
  if (!img || typeof img === 'number') return null
  return (img as { url?: string }).url ?? null
}

function formatNewsDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const item = result.docs[0]
  if (!item) notFound()

  const imageUrl = getNewsImageUrl(item)
  const dateStr = formatNewsDate(item.publishedAt ?? item.updatedAt)

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <article className="border-b border-border bg-anthracite">
        {/* Titelbild */}
        {imageUrl && (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-anthracite-light">
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-light transition hover:text-accent"
          >
            ← Zurück zu News
          </Link>

          <header className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {dateStr}
            </span>
            <h1 className="mt-2 font-bold text-3xl leading-tight text-white sm:text-4xl">
              {item.title}
            </h1>
          </header>

          {item.content && (
            <div className="prose prose-invert prose-lg max-w-none [&_a]:text-accent [&_a]:underline [&_a]:hover:no-underline [&_p]:text-muted-light [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-bold [&_ul]:text-muted-light">
              <RichText data={item.content as import('lexical').SerializedEditorState} />
            </div>
          )}
        </div>
      </article>
    </main>
  )
}
