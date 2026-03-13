/**
 * Führt Payload-Migrationen im Next.js-Kontext aus (dort funktioniert die DB-Verbindung).
 * Nur für lokale/Dev-Nutzung – mit Secret schützen.
 *
 * Aufruf (Dev-Server muss laufen):
 *   curl "http://localhost:3000/api/run-migrations?secret=DEIN_PAYLOAD_SECRET"
 *   oder im Browser (nach dem Start von npm run dev)
 */
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    if (!payload.db?.migrate) {
      return NextResponse.json(
        { error: 'Adapter unterstützt keine Migrationen' },
        { status: 500 }
      )
    }
    await payload.db.migrate()
    // Payload-Instanz nicht destroyen – ist gecacht und wird weiter genutzt; destroy() kann unter Windows zu libuv-Assertion führen
    return NextResponse.json({ ok: true, message: 'Migrationen ausgeführt.' })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[run-migrations]', err)
    return NextResponse.json(
      { error: 'Migration fehlgeschlagen', details: message },
      { status: 500 }
    )
  }
}
