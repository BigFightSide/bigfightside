import type { CollectionConfig } from 'payload'
import { multimediaOrAdmin } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'type', 'updatedAt'],
    listSearchableFields: ['alt', 'filename'],
    group: 'Verwaltung',
  },
  labels: {
    singular: 'Medien',
    plural: 'Medien',
  },
  access: multimediaOrAdmin,
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    // Server-seitiges Abrufen beim „Bild per URL einfügen“ (z. B. bei Kämpfer-Profilbild), um CORS-/„failed to fetch“-Fehler zu vermeiden. Weitere Hosts bei Bedarf ergänzen.
    pasteURL: {
      allowList: [
        { hostname: 'images.unsplash.com', protocol: 'https' },
        { hostname: 'unsplash.com', protocol: 'https' },
        { hostname: 'i.imgur.com', protocol: 'https' },
        { hostname: 'imgur.com', protocol: 'https' },
        { hostname: 'cdn.pixabay.com', protocol: 'https' },
        { hostname: 'pixabay.com', protocol: 'https' },
        { hostname: 'upload.wikimedia.org', protocol: 'https' },
        { hostname: 'avatars.githubusercontent.com', protocol: 'https' },
        { hostname: 'raw.githubusercontent.com', protocol: 'https' },
        { hostname: 'pbs.twimg.com', protocol: 'https' },
        { hostname: 'lh3.googleusercontent.com', protocol: 'https' },
        { hostname: 'localhost', protocol: 'http' },
        { hostname: '127.0.0.1', protocol: 'http' },
      ],
    },
    // Vermeidet Abbrüche bei strengen Safe-Fetch-Checks mancher Server
    skipSafeFetch: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Alternativtext für Barrierefreiheit und SEO' },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Bild', value: 'image' },
        { label: 'Video (Upload)', value: 'video' },
        { label: 'Video (Embed)', value: 'embed' },
      ],
      defaultValue: 'image',
      admin: { description: 'Medientyp' },
      hasMany: false,
    },
    {
      name: 'videoEmbedUrl',
      type: 'text',
      admin: {
        description: 'Embed-URL (z.B. YouTube, Vimeo) – nur bei type "Video (Embed)"',
        condition: (data) => data?.type === 'embed',
      },
    },
  ],
}
