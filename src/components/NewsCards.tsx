'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Ruft MMA/UFC/PFL News von unserer API ab (proxied zu newsdata.io).
 * Kann auch außerhalb der NewsCards-Komponente verwendet werden.
 */
export async function fetchMMANews(): Promise<{
  results: NewsArticle[]
  totalResults: number
  nextPage: string | null
} | { error: string }> {
  const res = await fetch('/api/news')
  const data = await res.json()
  if (!res.ok) return { error: data.error ?? 'Fehler beim Laden' }
  return data
}

interface NewsArticle {
  article_id: string
  title: string
  link: string
  image_url: string | null
  description: string | null
  pubDate: string
  source_name?: string
}

function formatNewsDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function NewsCards() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMMANews()

        if ('error' in data) {
          setError(data.error)
          setArticles([])
          return
        }

        if (!data.results?.length) {
          setError('Keine News gefunden. Möglicherweise ist das API-Limit erreicht.')
          setArticles([])
          return
        }

        setArticles(data.results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Netzwerkfehler')
        setArticles([])
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
          <p className="text-muted">News werden geladen…</p>
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
          Bitte versuche es später erneut oder prüfe die API-Konfiguration.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {articles.map((item) => (
        <a
          key={item.article_id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(184,134,11,0.3)]"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
          <div className="relative flex min-h-0 w-36 shrink-0 overflow-hidden rounded-l-xl bg-anthracite sm:w-44 md:w-52">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="h-full min-h-[100px] w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:min-h-[120px]"
              />
            ) : (
              <div className="flex h-full min-h-[100px] w-full items-center justify-center bg-anthracite text-3xl text-muted sm:min-h-[120px]">
                📰
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-anthracite/60 to-transparent sm:from-transparent" />
          </div>
          <div className="flex flex-1 flex-col justify-center p-4 pl-5 sm:p-5 sm:pl-6">
            <span className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              {formatNewsDate(item.pubDate)}
              {item.source_name && ` · ${item.source_name}`}
            </span>
            <h2 className="font-bold text-base text-white transition-colors group-hover:text-accent line-clamp-2 sm:text-lg">
              {item.title}
            </h2>
            {item.description && (
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-light">
                {item.description}
              </p>
            )}
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-accent group-hover:underline">
              Mehr lesen
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
