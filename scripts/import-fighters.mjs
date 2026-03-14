/**
 * Importiert Kämpfer aus einer CSV-Datei in die Payload-Collection "fighters".
 *
 * Erwartete CSV (UTF-8, mit Header):
 * name,weightClass,record,gym,description,status,imageUrl
 *
 * Datei-Pfad:
 *   public/skripte/fighters.csv
 *
 * Aufruf (im Projekt-Root):
 *   node --env-file=.env scripts/import-fighters.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import csv from 'csv-parser'
import { getPayload } from 'payload'

// Gewichtsklassen-Map von CSV-Werten → Payload-Select-Optionen
const WEIGHT_CLASS_MAP = {
  Strawweight: 'Strawweight (bis 52 kg)',
  Flyweight: 'Flyweight (bis 57 kg)',
  Bantamweight: 'Bantamweight (bis 61 kg)',
  Featherweight: 'Featherweight (bis 66 kg)',
  Lightweight: 'Lightweight (bis 70 kg)',
  Welterweight: 'Welterweight (bis 77 kg)',
  Middleweight: 'Middleweight (bis 84 kg)',
  'Light Heavyweight': 'Light Heavyweight (bis 93 kg)',
  Heavyweight: 'Heavyweight (bis 120 kg)',
}

function mapWeightClass(raw) {
  if (!raw) throw new Error('Gewichtsklasse fehlt')
  const key = String(raw).trim()
  const mapped = WEIGHT_CLASS_MAP[key]
  if (!mapped) {
    throw new Error(`Unbekannte Gewichtsklasse: "${key}" – bitte in WEIGHT_CLASS_MAP ergänzen`)
  }
  return mapped
}

// "16-6-0" → { wins: 16, losses: 6, draws: 0 }
function parseRecord(recordStr) {
  const [w = '0', l = '0', d = '0'] = String(recordStr || '').split('-')
  const wins = Number.parseInt(w, 10) || 0
  const losses = Number.parseInt(l, 10) || 0
  const draws = Number.parseInt(d, 10) || 0
  return { wins, losses, draws }
}

async function run() {
  if (!process.env.PAYLOAD_SECRET) {
    console.error(
      'FEHLER: PAYLOAD_SECRET ist nicht gesetzt. Starte mit: node --env-file=.env scripts/import-fighters.mjs',
    )
    process.exit(1)
  }

  const csvPath = path.resolve(process.cwd(), 'public', 'skripte', 'fighters.csv')
  if (!fs.existsSync(csvPath)) {
    console.error(`FEHLER: CSV-Datei nicht gefunden: ${csvPath}`)
    process.exit(1)
  }

  // Payload-Local-API initialisieren – nutzt deine payload.config.ts
  const payload = await getPayload({
    config: path.resolve(process.cwd(), 'src', 'payload.config.ts'),
  })

  console.log('Starte Import der Kämpfer aus:', csvPath, '\n')

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
    const name = row.name || row.Name
    const weightClassRaw = row.weightClass || row.WeightClass
    const record = row.record || row.Record
    const gymText = row.gym || row.Gym
    const description = row.description || row.Description || ''
    const imageUrl = row.imageUrl || row.ImageUrl || row.image || row.Image

    if (!name || !weightClassRaw || !record) {
      console.warn(
        `Zeile ${index + 1}: übersprungen (name/weightClass/record fehlt)`,
        row,
      )
      continue
    }

    try {
      const weightClass = mapWeightClass(weightClassRaw)
      const { wins, losses, draws } = parseRecord(record)

      // CSV-Status "published" → aktiver Kämpfer
      const status =
        String(row.status || row.Status || '').trim().toLowerCase() === 'published'
          ? 'active'
          : 'inactive'

      const fighter = await payload.create({
        collection: 'fighters',
        data: {
          name,
          weightClass,
          wins,
          losses,
          draws,
          status,
          team: gymText || undefined,
          bio: description,
          // Profilbild: hier könnte man imageUrl nutzen und Media-Uploads anlegen.
          // Für den Start speichern wir die URL in der Meta-Beschreibung mit ab.
          metaTitle: name,
          metaDescription: imageUrl
            ? `${description ? description + ' ' : ''}(Bild: ${imageUrl})`
            : description || undefined,
        },
      })

      console.log(
        `✓ Kämpfer erstellt: "${fighter.name}" (ID: ${fighter.id}) – Rekord: ${wins}-${losses}-${draws}`,
      )
    } catch (err) {
      console.error(
        `✗ Fehler beim Erstellen des Kämpfers in Zeile ${index + 1} ("${name}")`,
      )
      console.error('  Grund:', err.message)
    }
  }

  console.log('\nImport der Kämpfer abgeschlossen.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Unerwarteter Fehler beim Import:', err)
  process.exit(1)
})

