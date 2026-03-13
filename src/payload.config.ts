import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

export default buildConfig({
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
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
