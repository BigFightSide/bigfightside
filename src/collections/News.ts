import type { CollectionConfig } from 'payload'
import { formatSlug, generateSlugFromTitle } from '@/hooks/slug'
import { editorOrAdmin } from '@/access'

/** Setzt Slug aus title, wenn beim CSV-Import kein Slug angegeben wird. */
function slugFromTitleIfEmpty({
  data,
  value,
}: {
  data?: Record<string, unknown>
  value?: unknown
}): string | undefined {
  if (value != null && String(value).trim() !== '') return value as string
  const title = data?.title
  if (typeof title !== 'string') return undefined
  return generateSlugFromTitle(title)
}

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'category'],
    group: 'Verwaltung',
    components: {
      beforeList: ['/components/CSVImportNews'],
    },
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
      admin: {
        position: 'sidebar',
        description: 'Wird automatisch aus dem Titel erzeugt',
      },
      hooks: {
        beforeValidate: [slugFromTitleIfEmpty],
        beforeChange: [formatSlug('title')],
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'category',
      type: 'text',
      label: 'Kategorie',
      admin: { description: 'z. B. MMA, Boxen, Regional' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'published',
      options: [
        { label: 'Veröffentlicht', value: 'published' },
        { label: 'Entwurf', value: 'draft' },
      ],
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
