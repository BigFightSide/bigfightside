import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import fs from 'node:fs'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { de } from 'payload/i18n/de'
import { en } from 'payload/i18n/en'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Gyms } from '@/collections/Gyms'
import { Fighters } from '@/collections/Fighters'
import { Events } from '@/collections/Events'
import { News } from '@/collections/News'
import { Rankings } from '@/collections/Rankings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Lädt DATABASE_URL aus .env, falls nicht gesetzt (Next.js/Turbopack lädt .env teils erst später)
function ensureDatabaseUrl(): void {
  if (process.env.DATABASE_URL?.trim()) return
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.replace(/^#.*/, '').trim()
      const match = trimmed.match(/^DATABASE_URL=(.+)$/)
      if (match) {
        const value = match[1].trim().replace(/^["']|["']$/g, '')
        if (value) process.env.DATABASE_URL = value
        break
      }
    }
  } catch {
    // ignore
  }
}

// Connection-String ohne SSL-Query-Params (sonst überschreibt sslmode=require unser ssl-Objekt)
function getConnectionString(): string {
  ensureDatabaseUrl()
  const url = process.env.DATABASE_URL?.trim() || ''
  if (!url) return url
  const [base] = url.split('?')
  return base.trim()
}

ensureDatabaseUrl()

// Für korrekte Media-URLs in Production (z. B. Vercel): NEXT_PUBLIC_SERVER_URL setzen (https://deine-domain.vercel.app)
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

export default buildConfig({
  ...(serverURL && { serverURL }),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { de, en },
    fallbackLanguage: 'de',
  },
  collections: [Users, Media, Gyms, Fighters, Events, News, Rankings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getConnectionString(),
      // Mind. 2–3, damit Migration und Seiten-Requests nicht um eine Verbindung konkurrieren (max: 1 → Timeout)
      max: 3,
      // Verbindung bricht nach 90s ab – Supabase Free Tier braucht nach Pause oft 1–2 Min zum Aufwachen
      connectionTimeoutMillis: 90_000,
      // Supabase: SSL erforderlich, Zertifikat nicht verifizieren (self-signed in chain)
      ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
    },
  }),
  sharp,
  plugins: [],
})
