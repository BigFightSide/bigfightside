import type { CollectionConfig } from 'payload'
import { formatSlug } from '@/hooks/slug'
import { editorOrAdmin } from '@/access'

export const Events: CollectionConfig = {
  slug: 'events',
  defaultSort: '-date',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'status', 'location', 'updatedAt'],
    listSearchableFields: ['name', 'location', 'slug'],
    group: 'Verwaltung',
  },
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  access: editorOrAdmin,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Event-Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { hidden: true, description: 'Wird automatisch aus dem Event-Titel erzeugt' },
      hooks: {
        beforeChange: [formatSlug('name')],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum & Uhrzeit',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Ort / Location',
    },
    {
      name: 'ticketLink',
      type: 'text',
      label: 'Ticket-Verkauf Link',
      admin: { description: 'URL zum Ticket-Verkauf' },
    },
    {
      name: 'fightCard',
      type: 'relationship',
      relationTo: 'fighters',
      hasMany: true,
      label: 'Kampfpaarungen',
      admin: { description: 'Kämpfer auf der Fight Card' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      label: 'Status',
      options: [
        { label: 'Kommend', value: 'upcoming' },
        { label: 'Vergangen', value: 'past' },
      ],
      hasMany: false,
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
