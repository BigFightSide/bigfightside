import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import fs from 'node:fs'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { migrations } from '@/migrations'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Gyms } from '@/collections/Gyms'
import { Fighters } from '@/collections/Fighters'
import { Events } from '@/collections/Events'
import { News } from '@/collections/News'
import { Rankings } from '@/collections/Rankings'
import { HallOfFame } from '@/collections/HallOfFame'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Lädt Variablen aus .env, falls nicht gesetzt (z.B. bei Standalone-Scripts wie seedGlobalMMA)
function ensureEnvFromFile(): void {
  if (process.env.DATABASE_URL?.trim() && process.env.PAYLOAD_SECRET?.trim()) return
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.replace(/^#.*/, '').trim()
      const match = trimmed.match(/^(DATABASE_URL|PAYLOAD_SECRET)=(.+)$/)
      if (match) {
        const key = match[1]
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        if (value) process.env[key] = value
      }
    }
  } catch {
    // ignore
  }
}

// Connection-String ohne SSL-Query-Params (sonst überschreibt sslmode=require unser ssl-Objekt)
// Für Supabase: Port 6543 = Pooler (empfohlen für Vercel/Serverless), Port 5432 = Direkt (wenige Connections)
function getConnectionString(): string {
  ensureEnvFromFile()
  let url = process.env.DATABASE_URL?.trim() || ''
  if (!url) return url
  const [base] = url.split('?')
  let out = base.trim()
  // Supabase: Stelle sicher, dass Pooler (6543) genutzt wird, um MaxClientsInSessionMode zu vermeiden
  if (out.includes('supabase') && out.includes(':5432/')) {
    out = out.replace(':5432/', ':6543/')
  }
  return out
}

ensureEnvFromFile()

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
    components: {
      graphics: {
        Logo: '/components/AdminLogo',
        Icon: '/components/AdminIcon',
      },
    },
  },
  // i18n entfernt, damit das Admin unter /admin läuft (ohne /de in der URL)
  collections: [Users, Media, Gyms, Fighters, Events, News, Rankings, HallOfFame],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    prodMigrations: migrations,
    pool: {
      connectionString: getConnectionString(),
      // Pro Vercel-Instanz niedrig halten, damit Supabase-Limit (MaxClientsInSessionMode) nicht erreicht wird
      max: 10,
      // Idle-Verbindungen nach 10s schließen → weniger offene Connections, kein Connection-Leak
      idleTimeoutMillis: 10_000,
      // Verbindung bricht nach 90s ab – Supabase Free Tier braucht nach Pause oft 1–2 Min zum Aufwachen
      connectionTimeoutMillis: 90_000,
      // Supabase: SSL erforderlich, Zertifikat nicht verifizieren (self-signed in chain)
      ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
    },
  }),
  sharp,
  plugins: [],
})
