/**
 * Importiert Events aus einer CSV-Datei in die Payload-Collection "events".
 *
 * Voraussetzungen:
 * - Datei "public/skripte/events.csv" liegt im Projekt.
 * - Spalten: title,date,location,ticketLink,description,status
 * - Datum-Formate:
 *   - ISO / US-Format (z.B. 2026-03-15T20:00, 2026-03-15 20:00)
 *   - Deutsches Format (z.B. 15.03.2026 oder 15.03.2026 20:00)
 *
 * Aufruf:
 *   node --env-file=.env scripts/import-events.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import payload from 'payload'
import configPromise from '@payload-config'
import csv from 'csv-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// CSV wie von dir angelegt
const csvPath = path.resolve(process.cwd(), 'public', 'skripte', 'events.csv')

if (!fs.existsSync(csvPath)) {
  console.error(`FEHLER: CSV-Datei nicht gefunden: ${csvPath}`)
  process.exit(1)
}

// PAYLOAD_SECRET aus Umgebung oder .env laden (wie im migrate-Skript)
if (!process.env.PAYLOAD_SECRET) {
  const envPath = path.resolve(process.cwd(), '.env')
  try {
    const content = fs.readFileSync(envPath, 'utf8')
    const m = content.match(/^PAYLOAD_SECRET=(.+)$/m)
    if (m) {
      process.env.PAYLOAD_SECRET = m[1].trim()
    }
  } catch {
    // ignorieren, prüfen unten nochmals
  }
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('FEHLER: PAYLOAD_SECRET ist nicht gesetzt (weder Umgebung noch .env).')
  process.exit(1)
}

/**
 * Versucht verschiedene Datumsformate zu parsen und gibt ein ISO-String zurück.
 */
function parseDateToISO(raw) {
  if (!raw) throw new Error('Kein Datum angegeben')
  const input = String(raw).trim()

  // 1) Direkt versuchen (ISO, 2026-03-15, 2026-03-15 20:00 etc.)
  let d = new Date(input)
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString()
  }

  // 2) Deutsches Format: 15.03.2026 oder 15.03.2026 20:00
  const m = input.match(
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/
  )
  if (m) {
    const [, dd, mm, yyyy, hh = '12', min = '00'] = m
    d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
    )
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString()
    }
  }

  throw new Error(`Ungültiges Datum: "${input}"`)
}

async function run() {
  // Payload initialisieren (direkt mit TS-Config)
  console.log('PAYLOAD_SECRET gesetzt:', !!process.env.PAYLOAD_SECRET)
  const config = await configPromise
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    config,
  })

  console.log(`Starte Import aus: ${csvPath}\n`)

  const rows = []

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`Gefundene Zeilen in CSV: ${rows.length}\n`)

  for (const [index, row] of rows.entries()) {
    const name = row.name || row.Name || row.title || row.Titel
    const location = row.location || row.Location || row.ort || row.Ort
    const rawDate = row.date || row.Date || row.datum || row.Datum

    if (!name || !location || !rawDate) {
      console.warn(
        `Zeile ${index + 1}: übersprungen (name/location/date fehlt)`,
        row,
      )
      continue
    }

    try {
      const dateISO = parseDateToISO(rawDate)

      // Status aus Datum ableiten (CSV-Status "published" wird ignoriert)
      const eventTime = new Date(dateISO).getTime()
      const now = Date.now()
      const status = eventTime >= now ? 'upcoming' : 'past'

      const event = await payload.create({
        collection: 'events',
        data: {
          name,
          date: dateISO,
          location,
          description: row.description || row.Description || '',
          ticketLink: row.ticketLink || row.TicketLink || undefined,
          status,
          metaTitle: row.metaTitle || row.MetaTitle || undefined,
          metaDescription:
            row.metaDescription || row.MetaDescription || undefined,
        },
      })

      console.log(
        `✓ Event erstellt: "${event.name}" (ID: ${event.id}) – Datum: ${event.date}`,
      )
    } catch (err) {
      console.error(
        `✗ Fehler beim Erstellen des Events in Zeile ${index + 1} ("${name}")`,
      )
      console.error('  Grund:', err.message)
    }
  }

  console.log('\nImport abgeschlossen.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Unerwarteter Fehler beim Import:', err)
  process.exit(1)
})

