import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Event } from '@/payload-types'

export const dynamic = 'force-dynamic'

function formatEventDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: events } = await payload.find({
    collection: 'events',
    sort: 'date',
    depth: 2,
  })

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="font-bold text-3xl text-white sm:text-4xl">
            Events
          </h1>
          <p className="mt-2 text-muted-light">
            Alle Events – das nächste zuerst
          </p>
        </div>
      </section>

      <section className="bg-anthracite">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          {events.length === 0 ? (
            <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
              <p className="text-muted">Noch keine Events vorhanden.</p>
              <p className="mt-1 text-sm text-muted">
                Events im <Link href="/admin" className="font-semibold text-accent hover:underline">Admin Panel</Link> anlegen.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {events.map((event) => {
                const dateStr = formatEventDate(event.date)
                const hasTicketLink = Boolean(event.ticketLink?.trim())

                return (
                  <article
                    key={event.id}
                    className="group relative flex flex-wrap items-center gap-4 overflow-hidden rounded-xl border border-border bg-anthracite-card py-4 pl-5 pr-4 transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_rgba(184,134,11,0.3)] sm:flex-nowrap sm:py-5 sm:pl-6 sm:pr-6"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                    <Link
                      href={`/events/${event.slug}`}
                      className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-accent sm:mb-0 sm:w-36 sm:shrink-0">
                        {dateStr}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-lg text-white transition-colors group-hover:text-accent">
                          {event.name}
                        </h2>
                        <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-light">
                          <span className="text-gold">▸</span>
                          {event.location}
                        </p>
                      </div>
                    </Link>
                    <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
                      <Link
                        href={`/events/${event.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-anthracite-light px-4 py-2.5 text-sm font-bold text-white transition hover:border-accent hover:text-accent"
                      >
                        Details
                        <span className="font-bold">→</span>
                      </Link>
                      {hasTicketLink && (
                        <a
                          href={event.ticketLink!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-accent bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent hover:text-white"
                        >
                          Tickets sichern
                          <span className="font-bold">→</span>
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
