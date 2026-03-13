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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-Slug' },
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
