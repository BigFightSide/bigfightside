/**
 * LowKickMMA RSS-Feed – serverseitig geparsed.
 * Titel + Beschreibung via DeepL API (ein Request pro Batch).
 * Ergebnisse werden mit Next.js Data Cache (unstable_cache) 45 Minuten gehalten –
 * kein RSS/DeepL bei jedem Seitenaufruf.
 * Benötigt: DEEPL_API_KEY in .env (kostenlos: deepl.com/pro#developer)
 */

import { unstable_cache } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'

const RSS_FEED_URL = 'https://lowkickmma.com/feed/'
const MAX_ITEMS = 9
const FEED_SOURCE = 'LowKickMMA'

/** Revalidate: 45 Minuten (Zielvorgabe 30–60 Min.) */
export const MMA_NEWS_CACHE_SECONDS = 45 * 60

const FILE_CACHE_PATH = path.join(process.cwd(), '.cache', 'mma-news.json')

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
  nextPage?: string | null
  message?: string
  code?: string
}

function xmlText(block: string, tag: string): string | null {
  const cdata = block.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i'),
  )
  if (cdata?.[1] != null) return cdata[1].trim()
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  if (plain?.[1] != null) return plain[1].trim()
  return null
}

function imgFromHtml(html: string): string | null {
  const dq = html.match(/<img[^>]+src="([^"]+)"/i)
  if (dq?.[1]) return dq[1]
  const sq = html.match(/<img[^>]+src='([^']+)'/i)
  if (sq?.[1]) return sq[1]
  return null
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

async function translateBatch(texts: string[]): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey || texts.length === 0) return texts

  const baseUrl = apiKey.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate'

  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: 'DE',
        source_lang: 'EN',
        tag_handling: 'html',
      }),
    })

    if (!res.ok) {
      console.error('[DeepL] Fehler:', res.status, await res.text())
      return texts
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: { translations: { text: string }[] } = await res.json()
    return data.translations.map((t) => t.text)
  } catch (err) {
    console.error('[DeepL] Netzwerkfehler:', err)
    return texts
  }
}

async function readDiskCache(): Promise<NewsDataResponse | null> {
  if (process.env.VERCEL) return null
  try {
    const raw = await fs.readFile(FILE_CACHE_PATH, 'utf8')
    const parsed: { savedAt: number; payload: NewsDataResponse } = JSON.parse(raw)
    if (Date.now() - parsed.savedAt > MMA_NEWS_CACHE_SECONDS * 1000) return null
    return parsed.payload
  } catch {
    return null
  }
}

async function writeDiskCache(payload: NewsDataResponse): Promise<void> {
  if (process.env.VERCEL) return
  try {
    await fs.mkdir(path.dirname(FILE_CACHE_PATH), { recursive: true })
    await fs.writeFile(
      FILE_CACHE_PATH,
      JSON.stringify({ savedAt: Date.now(), payload }),
      'utf8',
    )
  } catch {
    /* optionaler Dev-Cache */
  }
}

async function fetchMMANewsFresh(): Promise<NewsDataResponse> {
  const fromDisk = await readDiskCache()
  if (fromDisk?.status === 'success' && fromDisk.results?.length) {
    return fromDisk
  }

  try {
    const res = await fetch(RSS_FEED_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BigFightSide)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    })

    if (!res.ok) {
      return { status: 'error', message: `RSS-Feed Fehler: ${res.status} ${res.statusText}` }
    }

    const xml = await res.text()
    const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[0])

    if (!itemBlocks.length) {
      return { status: 'error', message: 'Keine Artikel im RSS-Feed gefunden.' }
    }

    const limited = itemBlocks.slice(0, MAX_ITEMS)

    const raw = limited.map((item, index) => {
      const title = stripHtml(xmlText(item, 'title') ?? '')
      const link = xmlText(item, 'link') ?? xmlText(item, 'guid') ?? ''
      const guid = xmlText(item, 'guid') ?? link
      const pubDate = xmlText(item, 'pubDate') ?? ''
      const descHtml = xmlText(item, 'description') ?? ''

      const imageUrl =
        imgFromHtml(descHtml) ??
        imgFromHtml(xmlText(item, 'content:encoded') ?? '') ??
        null

      const plainDescription = stripHtml(descHtml).slice(0, 220) || null

      return { article_id: guid || `rss-${index}`, title, link, pubDate, imageUrl, plainDescription }
    })

    const titlesToTranslate = raw.map((r) => r.title)
    const descsToTranslate = raw.map((r) => r.plainDescription ?? '')

    const [translatedTitles, translatedDescs] = await Promise.all([
      translateBatch(titlesToTranslate),
      translateBatch(descsToTranslate),
    ])

    const results: NewsDataArticle[] = raw.map((r, i) => ({
      article_id: r.article_id,
      title: translatedTitles[i] ?? r.title,
      link: r.link,
      image_url: r.imageUrl
        ? `/api/proxy-image?url=${encodeURIComponent(r.imageUrl)}`
        : null,
      description: translatedDescs[i] || null,
      pubDate: r.pubDate,
      source_name: FEED_SOURCE,
    }))

    const out: NewsDataResponse = {
      status: 'success',
      totalResults: results.length,
      results,
      nextPage: null,
    }
    await writeDiskCache(out)
    return out
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Netzwerkfehler beim Laden der News',
    }
  }
}

const getCachedMMANews = unstable_cache(
  async () => fetchMMANewsFresh(),
  ['mma-rss-deepl-news'],
  {
    revalidate: MMA_NEWS_CACHE_SECONDS,
    tags: ['mma-news'],
  },
)

export async function fetchMMANews(_page?: string): Promise<NewsDataResponse> {
  return getCachedMMANews()
}
