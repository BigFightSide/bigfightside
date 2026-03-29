'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface EventItem {
  id: string
  sport_key: string
  sport_title?: string
  commence_time: string
  home_team: string
  away_team: string
  isManual?: boolean
  title?: string
  badge?: string
  location?: string
  slug?: string
  description?: string
  eventImageUrl?: string
  ticketLink?: string
  fightCard?: Array<{ id: number; name?: string }>
}

/** Datum: DD.MM.YYYY HH:mm */
function formatEventDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
  } catch {
    return ''
  }
}

function getSportLabel(sportTitle?: string, sportKey?: string): string {
  if (sportTitle) return sportTitle
  if (sportKey?.toLowerCase().includes('ufc')) return 'UFC'
  return 'MMA'
}

type Filter = 'all' | 'fights' | 'events'

export function EventCards() {
  const router = useRouter()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/events')
        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? 'Fehler beim Laden')
          setEvents([])
          return
        }

        setEvents(data.events ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Netzwerkfehler')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-accent" aria-hidden />
          <p className="text-muted">Kämpfe werden geladen…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
        <p className="font-semibold text-accent">Fehler</p>
        <p className="mt-2 text-muted">{error}</p>
        <p className="mt-2 text-sm text-muted">
          Bitte versuche es später erneut.
        </p>
      </div>
    )
  }

  const filteredEvents =
    filter === 'all'
      ? events
      : filter === 'fights'
        ? events.filter((e) => !e.isManual)
        : events.filter((e) => e.isManual)

  const hasFights = events.some((e) => !e.isManual)
  const hasEvents = events.some((e) => e.isManual)

  return (
    <div className="flex flex-col gap-6">
      {/* Filter-Menü */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            filter === 'all'
              ? 'border-2 border-accent bg-accent/20 text-accent'
              : 'border border-border bg-anthracite-card text-muted-light hover:border-accent hover:text-accent'
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => setFilter('fights')}
          className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            filter === 'fights'
              ? 'border-2 border-accent bg-accent/20 text-accent'
              : 'border border-border bg-anthracite-card text-muted-light hover:border-accent hover:text-accent'
          }`}
        >
          Kämpfe
          {hasFights && (
            <span className="ml-1.5 text-xs opacity-80">({events.filter((e) => !e.isManual).length})</span>
          )}
        </button>
        <button
          onClick={() => setFilter('events')}
          className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            filter === 'events'
              ? 'border-2 border-accent bg-accent/20 text-accent'
              : 'border border-border bg-anthracite-card text-muted-light hover:border-accent hover:text-accent'
          }`}
        >
          Premium Events
          {hasEvents && (
            <span className="ml-1.5 text-xs opacity-80">({events.filter((e) => e.isManual).length})</span>
          )}
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
          <p className="text-muted">
            {filter === 'all'
              ? 'Keine kommenden Kämpfe gefunden.'
              : filter === 'fights'
                ? 'Keine Kämpfe gefunden.'
                : 'Keine Premium Events gefunden.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {filteredEvents.map((event) => {
            const CardContent = (
              <>
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="relative flex min-h-[100px] w-24 shrink-0 overflow-hidden rounded-l-xl bg-anthracite sm:min-h-[120px] sm:w-28 md:w-36">
                  {event.eventImageUrl ? (
                    <Image
                      src={event.eventImageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full min-h-[100px] w-full items-center justify-center bg-anthracite text-2xl text-accent sm:min-h-[120px]">
                      {getSportLabel(event.sport_title, event.sport_key).charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center p-4 pl-5 sm:p-5 sm:pl-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit rounded-md bg-black px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
                      {getSportLabel(event.sport_title, event.sport_key)}
                    </span>
                    {event.isManual && event.badge && (
                      <span className="inline-flex w-fit rounded-md border border-accent bg-accent/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
                        {event.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-xl text-white transition-colors group-hover:text-accent sm:text-2xl">
                    {event.isManual && event.title
                      ? event.title
                      : `${event.home_team} vs. ${event.away_team}`}
                  </h2>
                  <p className="mt-2 text-sm text-accent">
                    {formatEventDate(event.commence_time)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-light">
                    <span className="text-gold">▸</span>
                    {event.location ?? '—'}
                  </p>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-light">
                      {event.description}
                    </p>
                  )}
                  {event.fightCard && event.fightCard.length > 0 && (
                    <p className="mt-1 text-xs text-muted">
                      {event.fightCard.length} Kampfpaarung
                      {event.fightCard.length !== 1 ? 'en' : ''}
                    </p>
                  )}
                  {event.ticketLink && (
                    <a
                      href={event.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-accent hover:underline"
                    >
                      Tickets sichern
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                  )}
                </div>
              </>
            )

            const cardClass =
              'group relative flex overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(184,134,11,0.3)]'

            if (event.slug) {
              return (
                <article
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/events/${event.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(`/events/${event.slug}`)
                    }
                  }}
                  className={`cursor-pointer ${cardClass}`}
                >
                  {CardContent}
                </article>
              )
            }

            return (
              <article key={event.id} className={cardClass}>
                {CardContent}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
