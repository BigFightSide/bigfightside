import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname
  // RSC-Payload-Requests (z. B. bei Client-Navigation) haben oft /_next/data/... – daraus den logischen Pfad ableiten
  const nextDataMatch = pathname.match(/^\/_next\/data\/[^/]+\/(.+?)\.json$/)
  if (nextDataMatch) {
    pathname = `/${nextDataMatch[1]}`
  }
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}
