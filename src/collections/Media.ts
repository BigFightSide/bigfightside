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
