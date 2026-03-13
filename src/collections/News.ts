import type { CollectionConfig } from 'payload'
import { formatSlug } from '@/hooks/slug'
import { editorOrAdmin } from '@/access'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    group: 'Verwaltung',
  },
  labels: {
    singular: 'News',
    plural: 'News',
  },
  access: editorOrAdmin,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Titelbild',
      admin: { description: 'Bild für Karten und Detailansicht' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { hidden: true, description: 'Wird automatisch aus dem Titel erzeugt' },
      hooks: {
        beforeChange: [formatSlug('title')],
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'SEO-Titel' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'SEO-Beschreibung' },
        },
      ],
    },
  ],
}
