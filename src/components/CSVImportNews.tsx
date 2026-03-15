'use client'

import React, { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Gutter } from '@payloadcms/ui'

/** Erzeugt minimales Lexical-JSON aus Plain-Text für das content-Feld. */
function plainTextToLexicalContent(text: string): Record<string, unknown> | undefined {
  const trimmed = String(text ?? '').trim()
  if (!trimmed) return undefined
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: '',
              mode: 'normal',
              style: '',
              detail: 0,
              version: 1,
              text: trimmed,
            },
          ],
        },
      ],
    },
  }
}

function mapStatus(value: string): 'draft' | 'published' {
  const v = String(value ?? '').trim().toLowerCase()
  if (v === 'draft') return 'draft'
  return 'published'
}

function mapRow(row: Record<string, string>): Record<string, unknown> {
  const title = (row.title ?? row.Title ?? '').trim()
  const contentRaw = (row.content ?? row.Content ?? '').trim()
  const category = (row.category ?? row.Category ?? '').trim() || undefined
  const status = mapStatus(row.status ?? row.Status ?? 'published')

  const payload: Record<string, unknown> = {
    title,
    content: plainTextToLexicalContent(contentRaw),
    category,
    status,
  }
  if (status === 'published') {
    payload.publishedAt = new Date().toISOString()
  }
  return payload
}

export function CSVImportNews() {
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

            if (!data.title) {
              errs.push({
                row: i + 2,
                msg: 'title ist ein Pflichtfeld.',
              })
              continue
            }

            try {
              const res = await fetch('/api/news', {
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
              ? `${created} News-Artikel erfolgreich importiert.`
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
      <h1 className="mb-6 text-2xl font-semibold">News CSV-Import</h1>
      <p className="mb-4 text-sm text-zinc-500">
        CSV mit Spalten: <code>title</code> (Pflicht), <code>content</code>,{' '}
        <code>category</code> (z. B. MMA, Boxen, Regional), <code>status</code> (Standard:
        published).
      </p>

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

export default CSVImportNews
