/**
 * Ruft die Migrations-API auf (Dev-Server muss laufen: npm run dev).
 * Nutzt die gleiche DB-Verbindung wie die App – umgeht CLI-Timeout-Probleme.
 *
 * Aufruf: node --env-file=.env scripts/migrate-via-app.mjs
 * Oder:   npm run migrate:via-app
 */
import fs from 'node:fs'
import path from 'node:path'

const envPath = path.resolve(process.cwd(), '.env')
let secret = process.env.PAYLOAD_SECRET
if (!secret) {
  try {
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const m = line.match(/^PAYLOAD_SECRET=(.+)$/)
      if (m) {
        secret = m[1].trim()
        break
      }
    }
  } catch (_) {}
}

if (!secret) {
  console.error('PAYLOAD_SECRET fehlt in .env')
  process.exit(1)
}

const url = `http://localhost:3000/api/run-migrations?secret=${encodeURIComponent(secret)}`
console.log('Rufe Migrations-API auf (Dev-Server muss laufen)...')

try {
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('Fehler:', data.error || data.details || res.statusText)
    process.exit(1)
  }
  console.log('✓', data.message || data)
} catch (err) {
  console.error('Verbindung fehlgeschlagen. Läuft der Dev-Server (npm run dev)?', err.message)
  process.exit(1)
}
