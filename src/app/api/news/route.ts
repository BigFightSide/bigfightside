import { NextResponse } from 'next/server'
import { fetchMMANews } from '@/lib/newsdata'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 Minuten

export async function GET() {
  const data = await fetchMMANews()

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
