/**
 * API-Sports MMA API – Fights Endpoint
 * Strategie: fights?league=2&season=YYYY (UFC)
 * Keine Status-Filter, Fallback auf season=2025 bei leerem Ergebnis
 */

const API_BASE = 'https://v1.mma.api-sports.io'

const FALLBACK_LEAGUES: Record<
  string,
  { id: number; name: string; logo: string }
> = {
  UFC: { id: 2, name: 'UFC', logo: 'https://media.api-sports.io/mma/leagues/2.png' },
  PFL: { id: 3, name: 'PFL', logo: 'https://media.api-sports.io/mma/leagues/3.png' },
  BELLATOR: { id: 4, name: 'Bellator', logo: 'https://media.api-sports.io/mma/leagues/4.png' },
  ONE: { id: 5, name: 'ONE', logo: 'https://media.api-sports.io/mma/leagues/5.png' },
}

function detectLeagueFromSlug(slug: string): { id: number; name: string; logo: string } {
  const upper = (slug || '').toUpperCase()
  if (upper.includes('UFC')) return FALLBACK_LEAGUES.UFC
  if (upper.includes('PFL')) return FALLBACK_LEAGUES.PFL
  if (upper.includes('BELLATOR')) return FALLBACK_LEAGUES.BELLATOR
  if (upper.includes('ONE ')) return FALLBACK_LEAGUES.ONE
  return FALLBACK_LEAGUES.UFC
}

export interface MMALeague {
  id: number
  name: string
  logo: string
}

export interface MMAEvent {
  id?: string | number
  slug: string
  name: string
  date: string
  timestamp: number
  location: string
  league: MMALeague
  status?: string
  fights?: unknown[]
  mainCard?: unknown[]
}

interface MMAFight {
  id: number
  date: string
  timestamp: number
  slug: string
  is_main: boolean
  category: string
  status?: { long?: string; short?: string }
  fighters: { first: { name: string }; second: { name: string } }
}

interface FightsApiResponse {
  get?: string
  parameters?: Record<string, string>
  errors?: Record<string, string> | string[]
  results?: number
  response?: MMAFight[]
}

/**
 * Ruft fights?league=2&season=YYYY ab (UFC).
 * Keine Status-Filter. Fallback ohne league wenn API league ablehnt.
 */
export async function fetchEventsFromFights(
  apiKey: string,
  season: number,
  league = 2
): Promise<{ events: MMAEvent[]; apiErrors?: string; rawData?: FightsApiResponse }> {
  let url = `${API_BASE}/fights?league=${league}&season=${season}`
  let res = await fetch(url, {
    headers: { 'x-apisports-key': apiKey },
    next: { revalidate: 300 },
  })

  let data = (await res.json()) as FightsApiResponse

  // Fallback: ohne league wenn "League field do not exist"
  const hasLeagueError =
    data.errors &&
    typeof data.errors === 'object' &&
    !Array.isArray(data.errors) &&
    Object.values(data.errors).some((v) => String(v).toLowerCase().includes('league'))
  if (hasLeagueError) {
    console.log('[MMA API] League-Parameter nicht unterstützt, versuche ohne league')
    url = `${API_BASE}/fights?season=${season}`
    res = await fetch(url, { headers: { 'x-apisports-key': apiKey }, next: { revalidate: 300 } })
    data = (await res.json()) as FightsApiResponse
  }

  // API-Antwort loggen (Kurzform: results + Fehler)
  console.log('[MMA API]', {
    results: data.results ?? data.response?.length ?? 0,
    errors: data.errors,
    eventCount: new Set((data.response ?? []).map((f) => f.slug)).size,
  })

  const apiErrors =
    data.errors && Object.keys(data.errors).length > 0
      ? typeof data.errors === 'object' && !Array.isArray(data.errors)
        ? JSON.stringify(data.errors)
        : String(data.errors)
      : undefined

  const fights = data.response ?? []

  const bySlug = new Map<string, MMAFight[]>()
  for (const f of fights) {
    const key = f.slug || `Event-${f.date}`
    if (!bySlug.has(key)) bySlug.set(key, [])
    bySlug.get(key)!.push(f)
  }

  const events: MMAEvent[] = []
  for (const [slug, eventFights] of bySlug) {
    const sorted = [...eventFights].sort((a, b) => a.timestamp - b.timestamp)
    const first = sorted[0]!
    const leagueInfo = detectLeagueFromSlug(slug)
    const mainCard = sorted.filter((f) => f.is_main)

    events.push({
      slug,
      name: slug,
      date: first.date,
      timestamp: first.timestamp,
      location: '—',
      league: leagueInfo,
      fights: sorted,
      mainCard: mainCard.length > 0 ? mainCard : sorted.slice(0, 5),
    })
  }

  events.sort((a, b) => a.timestamp - b.timestamp)
  return { events, apiErrors, rawData: data }
}

/**
 * Hauptfunktion: fights?league=2&season=2026, Fallback season=2025.
 */
export async function fetchUpcomingEvents(season?: number): Promise<{
  events: MMAEvent[]
  error?: string
  apiErrors?: string
}> {
  const apiKey = process.env.APISPORTS_API_KEY
  if (!apiKey) {
    return { events: [], error: 'APISPORTS_API_KEY ist nicht konfiguriert.' }
  }

  const year = season ?? 2026

  const result = await fetchEventsFromFights(apiKey, year)

  return {
    events: result.events,
    apiErrors: result.apiErrors,
  }
}

/**
 * Test: Letzte 5 Events (ohne Status-Filter).
 */
export async function fetchLastFinishedEvents(
  season?: number
): Promise<{ events: MMAEvent[]; error?: string }> {
  const apiKey = process.env.APISPORTS_API_KEY
  if (!apiKey) {
    return { events: [], error: 'APISPORTS_API_KEY ist nicht konfiguriert.' }
  }

  const year = season ?? 2024
  const { events, apiErrors } = await fetchEventsFromFights(apiKey, year)

  return {
    events: events.slice(-5).reverse(),
    error: apiErrors,
  }
}
