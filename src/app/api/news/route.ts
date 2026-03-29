import { NextResponse } from 'next/server'
import { fetchMMANews, MMA_NEWS_CACHE_SECONDS } from '@/lib/newsdata'

export async function GET() {
  const data = await fetchMMANews()

  if (data.status === 'error') {
    return NextResponse.json(
      { error: data.message, code: data.code },
      { status: 400 },
    )
  }

  const body = {
    results: data.results ?? [],
    totalResults: data.totalResults ?? 0,
    nextPage: data.nextPage ?? null,
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': `public, s-maxage=${MMA_NEWS_CACHE_SECONDS}, stale-while-revalidate=${MMA_NEWS_CACHE_SECONDS}`,
    },
  })
}
