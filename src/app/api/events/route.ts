import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { fetchMMAOdds } from '@/lib/odds-api'
import { getMediaDisplayUrl } from '@/lib/media-url'
import type { Event as PayloadEvent, Media } from '@/payload-types'

/** Manuelle Events (Oktagon, lokale Kämpfe etc.) – einfach hier ergänzen */
const manualEvents: Array<{
  title: string
  date: string
  location: string
  organization: string
  badge?: string
}> = [
  {
    title: 'Oktagon 60',
    date: '2026-04-20T20:00:00Z',
    location: 'Frankfurt',
    organization: 'Oktagon',
    badge: 'Premium Event',
  },
]

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 Minuten

function getEventImageUrl(eventImage: PayloadEvent['eventImage']): string | null {
  if (!eventImage || typeof eventImage === 'number') return null
  return (eventImage as Media)?.url ?? null
}

export async function GET() {
  const { events: apiEvents, error } = await fetchMMAOdds()

  if (error) {
    return NextResponse.json({ error, events: [] }, { status: 400 })
  }

  const manual = manualEvents.map((e, i) => ({
    id: `manual-${i}-${e.date}`,
    commence_time: e.date,
    home_team: '',
    away_team: '',
    sport_title: e.organization,
    sport_key: 'manual',
    location: e.location,
    isManual: true,
    title: e.title,
    badge: e.badge ?? 'Lokal',
    slug: undefined,
    description: undefined,
    eventImageUrl: undefined,
    ticketLink: undefined,
    fightCard: undefined,
  }))

  let payloadEvents: Array<{
    id: string
    commence_time: string
    home_team: string
    away_team: string
    sport_title: string
    sport_key: string
    location: string
    isManual: boolean
    title?: string
    badge?: string
    slug?: string
    description?: string
    eventImageUrl?: string
    ticketLink?: string
    fightCard?: Array<{ id: number; name?: string }>
  }> = []

  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date().toISOString()
    const { docs } = await payload.find({
      collection: 'events',
      where: {
        and: [
          { status: { equals: 'upcoming' } },
          { date: { greater_than_equal: now } },
        ],
      },
      sort: 'date',
      depth: 2,
    })

    payloadEvents = docs.map((e) => {
      const img = getEventImageUrl(e.eventImage)
      const fightCard = Array.isArray(e.fightCard)
        ? e.fightCard.map((f) =>
            typeof f === 'object' && f && 'id' in f
              ? { id: (f as { id: number }).id, name: (f as { name?: string }).name }
              : { id: typeof f === 'number' ? f : 0 }
          )
        : []
      return {
        id: `payload-${e.id}`,
        commence_time: e.date ?? '',
        home_team: '',
        away_team: '',
        sport_title: 'Event',
        sport_key: 'payload',
        location: e.location ?? '',
        isManual: true,
        title: e.name,
        badge: 'Premium Event',
        slug: e.slug,
        description: e.description ?? undefined,
        eventImageUrl: getMediaDisplayUrl(img) ?? undefined,
        ticketLink: e.ticketLink ?? undefined,
        fightCard,
      }
    })
  } catch (err) {
    console.error('[Events API] Payload fetch failed:', err)
  }

  const combined = [
    ...apiEvents.map((e) => ({ ...e, isManual: false })),
    ...manual,
    ...payloadEvents,
  ].sort(
    (a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
  )

  return NextResponse.json({ events: combined })
}
