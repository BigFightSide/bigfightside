/**
 * Entfernt Dev-Migrations (batch=-1) aus payload_migrations.
 * Payload fragt sonst interaktiv nach und blockiert CI/Vercel-Builds.
 *
 * Aufruf: node scripts/clean-dev-migrations.mjs
 *         (DATABASE_URL aus .env oder Umgebungsvariable)
 */
import postgres from 'postgres'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getConnectionString() {
  if (process.env.DATABASE_URL?.trim()) {
    let url = process.env.DATABASE_URL.trim()
    const [base] = url.split('?')
    let out = base.trim()
    if (out.includes('supabase') && out.includes(':5432/')) {
      out = out.replace(':5432/', ':6543/')
    }
    return out
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.replace(/^#.*/, '').trim()
      const m = trimmed.match(/^DATABASE_URL=(.+)$/)
      if (m) {
        const val = m[1].trim().replace(/^["']|["']$/g, '')
        if (val) {
          const [base] = val.split('?')
          let out = base.trim()
          if (out.includes('supabase') && out.includes(':5432/')) {
            out = out.replace(':5432/', ':6543/')
          }
          return out
        }
      }
    }
  } catch {}
  return ''
}

const url = getConnectionString()
if (!url) {
  console.error('FEHLER: DATABASE_URL nicht gesetzt.')
  process.exit(1)
}

const isSupabase = url.includes('supabase')
const sql = postgres(url, {
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
  max: 1,
})

try {
  const deleted = await sql`DELETE FROM payload_migrations WHERE batch = -1 RETURNING id`
  if (deleted.length > 0) {
    console.log(`Dev-Migrations gelöscht: ${deleted.length} Einträge (batch=-1)`)
  }
} catch (err) {
  if (err.code === '42P01' || err.message?.includes('does not exist')) {
    // Tabelle existiert noch nicht (frische DB) – kein Fehler
    process.exit(0)
  }
  console.error('Fehler beim Bereinigen der Dev-Migrations:', err.message)
  process.exit(1)
} finally {
  await sql.end()
}
