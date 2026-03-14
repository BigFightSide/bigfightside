import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Event, Media } from '@/payload-types'
import { getMediaDisplayUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

function getEventImageUrl(eventImage: Event['eventImage']): string | null {
  if (!eventImage || typeof eventImage === 'number') return null
  return (eventImage as Media)?.url ?? null
}

function formatEventDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(String(dateStr).includes('T') && String(dateStr).length > 10
      ? { hour: '2-digit', minute: '2-digit' }
      : {}),
  })
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const event = result.docs[0]
  if (!event) notFound()

  const imageUrl = getMediaDisplayUrl(getEventImageUrl(event?.eventImage))
  const dateStr = formatEventDate(event?.date)
  const hasTicketLink = Boolean(event?.ticketLink?.trim())
  const hasDescription = Boolean(event?.description?.trim())

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <article className="border-b border-border bg-anthracite">
        {/* Header: Event-Bild (eventImage) */}
        {imageUrl && (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-anthracite-light">
            <img
              src={imageUrl}
              alt={event?.name ?? 'Event'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-anthracite-card px-3 py-2 text-sm font-semibold text-muted-light transition hover:border-accent hover:text-accent"
          >
            ← Zurück zur Übersicht
          </Link>

          <div className="flex flex-col gap-6">
            {/* Titel (name) */}
            {event?.name && (
              <header>
                <h1 className="font-bold text-3xl leading-tight text-white sm:text-4xl">
                  {event.name}
                </h1>
              </header>
            )}

            {/* Datum (date) */}
            {dateStr && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Datum
                </span>
                <p className="mt-1 text-lg text-muted-light">{dateStr}</p>
              </div>
            )}

            {/* Ort (location) */}
            {event?.location && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Ort
                </span>
                <p className="mt-1 flex items-center gap-2 text-lg text-muted-light">
                  <span className="text-gold">▸</span>
                  {event.location}
                </p>
              </div>
            )}

            {/* Beschreibung (description) – Textarea, kein Rich Text in dieser Collection */}
            {hasDescription && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Beschreibung
                </span>
                <div className="mt-2 prose prose-invert max-w-none [&_p]:text-muted-light [&_p]:leading-relaxed">
                  <div className="whitespace-pre-wrap text-muted-light leading-relaxed">
                    {event?.description}
                  </div>
                </div>
              </div>
            )}

            {/* ticketLink: nur als Button anzeigen, wenn vorhanden */}
            {hasTicketLink && event?.ticketLink && (
              <div className="pt-2">
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-accent bg-accent px-6 py-4 text-base font-bold text-white transition hover:bg-accent-hover hover:border-accent-hover"
                >
                  Tickets kaufen
                  <span className="font-bold">→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}
