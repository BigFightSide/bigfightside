import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import csv from 'csv-parser'
import type { Fighter } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const WEIGHT_CLASS_MAP: Record<string, string> = {
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

function mapWeightClass(raw: unknown): string {
  const key = String(raw ?? '').trim()
  const mapped = WEIGHT_CLASS_MAP[key]
  if (!mapped) {
    throw new Error(`Unbekannte Gewichtsklasse: "${key}"`)
  }
  return mapped
}

function parseRecord(recordStr: unknown): { wins: number; losses: number; draws: number } {
  const [w = '0', l = '0', d = '0'] = String(recordStr ?? '').split('-')
  const wins = Number.parseInt(w, 10) || 0
  const losses = Number.parseInt(l, 10) || 0
  const draws = Number.parseInt(d, 10) || 0
  return { wins, losses, draws }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const csvPath = path.resolve(process.cwd(), 'public', 'skripte', 'fighters.csv')

  if (!fs.existsSync(csvPath)) {
    return NextResponse.json(
      { error: 'CSV-Datei nicht gefunden', path: csvPath },
      { status: 404 },
    )
  }

  const rows: any[] = []

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => resolve())
      .on('error', reject)
  })

  const config = await configPromise
  const payload = await getPayload({ config })

  let created = 0
  const errors: { name: string; line: number; reason: string }[] = []

  for (const [index, row] of rows.entries()) {
    const name = row.name || row.Name
    const weightClassRaw = row.weightClass || row.WeightClass
    const record = row.record || row.Record
    const gymText = row.gym || row.Gym
    const description = row.description || row.Description || ''
    const imageUrl = row.imageUrl || row.ImageUrl || row.image || row.Image

    if (!name || !weightClassRaw || !record) {
      errors.push({
        name: String(name || 'UNBEKANNT'),
        line: index + 2, // +1 für Header, +1 für 1-index
        reason: 'name/weightClass/record fehlt',
      })
      continue
    }

    try {
      const weightClass = mapWeightClass(weightClassRaw)
      const { wins, losses, draws } = parseRecord(record)
      const status =
        String(row.status || row.Status || '').trim().toLowerCase() === 'published'
          ? 'active'
          : 'inactive'

      await payload.create({
        collection: 'fighters',
        data: {
          name,
          weightClass: weightClass as Fighter['weightClass'],
          wins,
          losses,
          draws,
          status,
          team: gymText || undefined,
          bio: description,
          metaTitle: name,
          metaDescription: imageUrl
            ? `${description ? description + ' ' : ''}(Bild: ${imageUrl})`
            : description || undefined,
        },
      })

      created += 1
    } catch (err) {
      errors.push({
        name,
        line: index + 2,
        reason: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.json({
    ok: true,
    created,
    errors,
  })
}

