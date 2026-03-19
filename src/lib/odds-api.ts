/**
 * The Odds API – MMA Kämpfe
 * Endpoint: /v4/sports/mma_mixed_martial_arts/odds
 * home_team vs. away_team = Kämpfer, commence_time = Datum
 */

const API_BASE = 'https://api.the-odds-api.com/v4'

export interface OddsEvent {
  id: string
  sport_key: string
  sport_title?: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers?: unknown[]
}

/**
 * Ruft kommende MMA-Kämpfe von The Odds API ab.
 */
export async function fetchMMAOdds(): Promise<{
  events: OddsEvent[]
  error?: string
}> {
  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) {
    return { events: [], error: 'ODDS_API_KEY ist nicht konfiguriert.' }
  }

  const url = `${API_BASE}/sports/mma_mixed_martial_arts/odds/?regions=eu&oddsFormat=decimal&apiKey=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 300 } })

  if (!res.ok) {
    return {
      events: [],
      error: `API-Fehler: ${res.status} ${res.statusText}`,
    }
  }

  const data = (await res.json()) as OddsEvent[] | { message?: string }

  if (Array.isArray(data)) {
    const events = data
      .filter((e) => e.commence_time && e.home_team && e.away_team)
      .sort(
        (a, b) =>
          new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
      )
    return { events }
  }

  const errMsg = (data as { message?: string }).message ?? 'Unbekannter API-Fehler'
  return { events: [], error: errMsg }
}
