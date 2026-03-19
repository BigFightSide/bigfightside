import { NextResponse } from 'next/server'
import { fetchMMANews } from '@/lib/newsdata'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 Minuten

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') ?? undefined

  const data = await fetchMMANews(page)

  if (data.status === 'error') {
    return NextResponse.json(
      { error: data.message, code: data.code },
      { status: 400 },
    )
  }

  return NextResponse.json({
    results: data.results ?? [],
    totalResults: data.totalResults ?? 0,
    nextPage: data.nextPage ?? null,
  })
}
