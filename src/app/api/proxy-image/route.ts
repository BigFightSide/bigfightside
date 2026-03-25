import { NextResponse } from 'next/server'

// Erlaubte Domains für den Proxy (Sicherheit)
const ALLOWED_HOSTS = ['lowkickmma.com', 'www.lowkickmma.com']

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  let hostname: string
  try {
    hostname = new URL(imageUrl).hostname
  } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(hostname)) {
    return new NextResponse('Domain not allowed', { status: 403 })
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        // Referer auf die Quell-Domain setzen – umgeht Hotlink-Schutz
        Referer: 'https://lowkickmma.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/avif,image/*,*/*;q=0.8',
      },
    })

    if (!res.ok) {
      return new NextResponse('Image fetch failed', { status: 502 })
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    return new NextResponse('Proxy error', { status: 502 })
  }
}
