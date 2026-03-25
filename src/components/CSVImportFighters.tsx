'use client'

import React, { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Gutter } from '@payloadcms/ui'

const WEIGHT_CLASS_MAP: Record<string, string> = {
  strawweight: 'Strawweight (bis 52 kg)',
  flyweight: 'Flyweight (bis 57 kg)',
  bantamweight: 'Bantamweight (bis 61 kg)',
  featherweight: 'Featherweight (bis 66 kg)',
  lightweight: 'Lightweight (bis 70 kg)',
  welterweight: 'Welterweight (bis 77 kg)',
  middleweight: 'Middleweight (bis 84 kg)',
  'light heavyweight': 'Light Heavyweight (bis 93 kg)',
  heavyweight: 'Heavyweight (bis 120 kg)',
  // Kurzformen
  sw: 'Strawweight (bis 52 kg)',
  fw: 'Flyweight (bis 57 kg)',
  bw: 'Bantamweight (bis 61 kg)',
  few: 'Featherweight (bis 66 kg)',
  lw: 'Lightweight (bis 70 kg)',
  ww: 'Welterweight (bis 77 kg)',
  mw: 'Middleweight (bis 84 kg)',
  lhw: 'Light Heavyweight (bis 93 kg)',
  hw: 'Heavyweight (bis 120 kg)',
}

const ALL_WEIGHT_CLASSES = [
  'Strawweight (bis 52 kg)',
  'Flyweight (bis 57 kg)',
  'Bantamweight (bis 61 kg)',
  'Featherweight (bis 66 kg)',
  'Lightweight (bis 70 kg)',
  'Welterweight (bis 77 kg)',
  'Middleweight (bis 84 kg)',
  'Light Heavyweight (bis 93 kg)',
  'Heavyweight (bis 120 kg)',
]

function mapWeightClass(value: string): string {
  const raw = String(value ?? '').trim()
  if (!raw) return 'Lightweight (bis 70 kg)'
  // Exakter Match (vollständiger Label)
  if (ALL_WEIGHT_CLASSES.includes(raw)) return raw
  // Case-insensitive Suche in der Mapping-Tabelle
  const lower = raw.toLowerCase()
  if (WEIGHT_CLASS_MAP[lower]) return WEIGHT_CLASS_MAP[lower]
  // Teilstring-Suche
  const found = ALL_WEIGHT_CLASSES.find((wc) => wc.toLowerCase().includes(lower))
  return found ?? 'Lightweight (bis 70 kg)'
}

function mapGender(value: string): 'male' | 'female' {
  const v = String(value ?? '').trim().toLowerCase()
  if (v === 'female' || v === 'f' || v === 'frauen' || v === 'w') return 'female'
  return 'male'
}

function mapStatus(value: string): 'active' | 'inactive' {
  const v = String(value ?? '').trim().toLowerCase()
  if (v === 'inactive' || v === 'inaktiv') return 'inactive'
  return 'active'
}

function parseNumber(value: string | undefined): number {
  const n = parseInt(String(value ?? '0').trim(), 10)
  return isNaN(n) ? 0 : Math.max(0, n)
}

function mapRow(row: Record<string, string>): Record<string, unknown> {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = row[k]?.trim()
      if (v) return v
    }
    return ''
  }

  const name = get('name', 'Name', 'fighter', 'Fighter')
  const nickname = get('nickname', 'Nickname', 'kampfname', 'Kampfname') || undefined
  const gender = mapGender(get('gender', 'Gender', 'geschlecht', 'Geschlecht'))
  const wins = parseNumber(get('wins', 'Wins', 'siege', 'Siege', 'w'))
  const losses = parseNumber(get('losses', 'Losses', 'niederlagen', 'Niederlagen', 'l'))
  const draws = parseNumber(get('draws', 'Draws', 'unentschieden', 'Unentschieden', 'd'))
  const weightClass = mapWeightClass(
    get('weightClass', 'weight_class', 'weightclass', 'WeightClass', 'klasse', 'Klasse', 'gewichtsklasse'),
  )
  const status = mapStatus(get('status', 'Status'))
  const nationality = get('nationality', 'Nationality', 'nation', 'Nation', 'country', 'Country') || undefined
  const team = get('team', 'Team', 'gym', 'Gym') || undefined
  const bio = get('bio', 'Bio', 'biografie', 'Biografie', 'description', 'Description') || undefined
  const dateOfBirth = get('dateOfBirth', 'date_of_birth', 'dob', 'birthday', 'Geburtsdatum') || undefined

  const height = get('height', 'Height', 'groesse', 'Größe', 'grosse') || undefined
  const reach = get('reach', 'Reach', 'reichweite', 'Reichweite') || undefined
  const legReach = get('legReach', 'leg_reach', 'LegReach', 'legreach') || undefined
  const fightingStyle = get('fightingStyle', 'fighting_style', 'style', 'Style', 'kampfstil', 'Kampfstil') || undefined

  const instagram = get('instagram', 'Instagram') || undefined
  const twitter = get('twitter', 'Twitter', 'x', 'X') || undefined
  const youtube = get('youtube', 'YouTube', 'Youtube') || undefined

  const data: Record<string, unknown> = {
    name,
    gender,
    wins,
    losses,
    draws,
    weightClass,
    status,
  }

  if (nickname) data.nickname = nickname
  if (nationality) data.nationality = nationality
  if (team) data.team = team
  if (bio) data.bio = bio
  if (dateOfBirth) data.dateOfBirth = dateOfBirth

  if (height || reach || legReach || fightingStyle) {
    data.stats = { height, reach, legReach, fightingStyle }
  }

  if (instagram || twitter || youtube) {
    data.socialMedia = { instagram, twitter, youtube }
  }

  return data
}

export function CSVImportFighters() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Array<{ row: number; msg: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0]
    if (!chosen) {
      setFile(null)
      setStatus('idle')
      setMessage(null)
      return
    }
    if (!chosen.name.toLowerCase().endsWith('.csv')) {
      setMessage('Bitte nur .csv-Dateien auswählen.')
      setFile(null)
      setStatus('idle')
      return
    }
    setFile(chosen)
    setMessage(null)
    setStatus('idle')
    setErrors([])
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('Bitte zuerst eine CSV-Datei auswählen.')
      return
    }

    setStatus('uploading')
    setMessage(null)
    setErrors([])

    return new Promise<void>((resolve) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const rows = results.data
          if (!rows.length) {
            setMessage('Keine Daten in der CSV gefunden.')
            setStatus('done')
            resolve()
            return
          }

          const total = rows.length
          setProgress({ current: 0, total })
          const errs: Array<{ row: number; msg: string }> = []
          let created = 0

          for (let i = 0; i < rows.length; i++) {
            setProgress({ current: i + 1, total })
            const raw = rows[i]
            const data = mapRow(raw)

            if (!data.name) {
              errs.push({ row: i + 2, msg: 'name ist ein Pflichtfeld.' })
              continue
            }

            try {
              const res = await fetch('/api/fighters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
              })

              if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                errs.push({
                  row: i + 2,
                  msg: body.errors?.[0]?.message ?? body.message ?? `HTTP ${res.status}`,
                })
                continue
              }
              created += 1
            } catch (e) {
              errs.push({
                row: i + 2,
                msg: e instanceof Error ? e.message : String(e),
              })
            }
          }

          setProgress({ current: total, total })
          setErrors(errs)
          setMessage(
            errs.length === 0
              ? `${created} Kämpfer erfolgreich importiert.`
              : `Import abgeschlossen: ${created} importiert, ${errs.length} Fehler.`,
          )
          setStatus('done')
          resolve()
        },
        error: (err) => {
          setMessage(`CSV-Fehler: ${err.message}`)
          setStatus('error')
          resolve()
        },
      })
    })
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setMessage(null)
    setErrors([])
    setProgress({ current: 0, total: 0 })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Gutter className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">Kämpfer CSV-Import</h1>
      <p className="mb-1 text-sm text-zinc-500">
        Pflichtfelder: <code>name</code>. Optionale Spalten:
      </p>
      <ul className="mb-4 list-inside list-disc text-sm text-zinc-500 space-y-0.5">
        <li>
          <code>nickname</code>, <code>gender</code> (male/female, Standard: male),{' '}
          <code>weightClass</code> (z.&nbsp;B. &quot;Lightweight&quot;, &quot;lw&quot;,
          &quot;Welterweight (bis 77 kg)&quot;)
        </li>
        <li>
          <code>wins</code>, <code>losses</code>, <code>draws</code> (Zahlen, Standard: 0)
        </li>
        <li>
          <code>status</code> (active/inactive), <code>nationality</code> (z.&nbsp;B. DE, AT),{' '}
          <code>team</code>
        </li>
        <li>
          <code>height</code>, <code>reach</code>, <code>legReach</code>,{' '}
          <code>fightingStyle</code>
        </li>
        <li>
          <code>instagram</code>, <code>twitter</code>, <code>youtube</code>
        </li>
        <li>
          <code>bio</code>, <code>dateOfBirth</code>
        </li>
      </ul>

      <div className="flex flex-wrap items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block text-sm text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-theme-elevation-100 file:px-4 file:py-2 file:text-sm file:font-medium"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || status === 'uploading'}
          className="rounded bg-theme-success px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {status === 'uploading' ? 'Importiere…' : 'CSV hochladen'}
        </button>
        {(status === 'done' || status === 'error') && (
          <button
            type="button"
            onClick={reset}
            className="rounded border border-theme-elevation-300 bg-theme-elevation-50 px-4 py-2 text-sm font-medium hover:bg-theme-elevation-100"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {status === 'uploading' && (
        <div className="mt-4">
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-theme-elevation-200">
            <div
              className="h-full bg-theme-success transition-all duration-300"
              style={{
                width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {progress.current} von {progress.total} Zeilen …
          </p>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 rounded-lg border p-4 text-sm ${
            status === 'error'
              ? 'border-red-500/50 bg-red-500/10 text-red-700'
              : 'border-theme-elevation-300 bg-theme-elevation-50 text-zinc-700'
          }`}
        >
          {message}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-4 max-h-48 overflow-auto rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="mb-2 text-sm font-medium text-amber-800">Fehler pro Zeile:</p>
          <ul className="list-inside list-disc text-sm text-amber-800">
            {errors.slice(0, 20).map((e, i) => (
              <li key={i}>
                Zeile {e.row}: {e.msg}
              </li>
            ))}
            {errors.length > 20 && (
              <li className="text-amber-600">… und {errors.length - 20} weitere</li>
            )}
          </ul>
        </div>
      )}
    </Gutter>
  )
}

export default CSVImportFighters
