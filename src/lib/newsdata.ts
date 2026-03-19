/**
 * NewsData.io API – MMA/UFC/PFL News abrufen
 * Der API-Key wird serverseitig über NEWSDATA_API_KEY gesetzt.
 */

const API_BASE = 'https://newsdata.io/api/1/latest'

export interface NewsDataArticle {
  article_id: string
  title: string
  link: string
  image_url: string | null
  description: string | null
  pubDate: string
  source_name?: string
}

export interface NewsDataResponse {
  status: 'success' | 'error'
  totalResults?: number
  results?: NewsDataArticle[]
  nextPage?: string
  message?: string
  code?: string
}

/**
 * Ruft MMA/UFC/PFL News von der NewsData.io API ab.
 * Sollte nur serverseitig aufgerufen werden (API-Key bleibt geheim).
 */
export async function fetchMMANews(page?: string): Promise<NewsDataResponse> {
  const apiKey = process.env.NEWSDATA_API_KEY
  if (!apiKey) {
    return {
      status: 'error',
      message: 'NEWSDATA_API_KEY ist nicht konfiguriert.',
    }
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    q: 'MMA AND (UFC OR PFL OR "Mixed Martial Arts")',
    language: 'en,de',
    removeduplicate: '0',
  })
  if (page) params.set('page', page)

  const url = `${API_BASE}?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 300 } }) // 5 Min Cache

  if (!res.ok) {
    return {
      status: 'error',
      message: `API-Fehler: ${res.status} ${res.statusText}`,
    }
  }

  const data = (await res.json()) as NewsDataResponse

  if (data.status === 'error') {
    return {
      status: 'error',
      message: data.message ?? 'Unbekannter API-Fehler',
      code: data.code,
    }
  }

  return data
}
