import type { CollectionConfig } from 'payload'
import { formatSlug } from '@/hooks/slug'
import { editorOrAdmin } from '@/access'

export const Gyms: CollectionConfig = {
  slug: 'gyms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'updatedAt'],
    listSearchableFields: ['name', 'city', 'slug'],
    group: 'Verwaltung',
  },
  labels: {
    singular: 'Gym',
    plural: 'Gyms',
  },
  access: editorOrAdmin,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name des Gyms',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { hidden: true, description: 'Wird automatisch aus dem Namen erzeugt' },
      hooks: {
        beforeChange: [formatSlug('name')],
      },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'Stadt / Standort',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adresse',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
      admin: { description: 'Vollständige URL' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: { description: 'Logo des Gyms' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    // SEO
    {
      type: 'row',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'SEO-Titel',
          admin: { description: 'SEO-Titel (optional)' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'SEO-Beschreibung',
          admin: { description: 'SEO-Beschreibung (optional)' },
        },
      ],
    },
  ],
}
