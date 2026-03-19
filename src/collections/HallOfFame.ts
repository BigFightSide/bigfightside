import type { CollectionConfig } from 'payload'
import { formatSlug } from '@/hooks/slug'
import { editorOrAdmin } from '@/access'

export const HallOfFame: CollectionConfig = {
  slug: 'hall-of-fame',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'activeYears', 'updatedAt'],
    listSearchableFields: ['name', 'bio', 'legacy'],
    group: 'Verwaltung',
    description: 'Legenden und Hall-of-Fame-Kämpfer – getrennt von aktiven Kämpfern',
  },
  labels: {
    singular: 'Legende',
    plural: 'Legenden',
  },
  access: editorOrAdmin,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
      admin: { description: 'Vor- und Nachname der Legende' },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Bild',
      admin: { description: 'Profilbild – wird auf der Hall-of-Fame-Seite in Schwarz-Weiß dargestellt' },
    },
    {
      name: 'activeYears',
      type: 'text',
      required: true,
      label: 'Aktivste Jahre',
      admin: { description: 'z.B. "2005–2018" oder "1998–2012"' },
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Größte Erfolge',
      admin: { description: 'Auflistung der wichtigsten Erfolge (z.B. Pionier des deutschen MMA, Ehemaliger Champion)' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Erfolg',
        },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografie',
      admin: { description: 'Ausführliche Beschreibung der Karriere' },
    },
    {
      name: 'legacy',
      type: 'text',
      label: 'Legacy / Zitat',
      admin: {
        description: 'Ein prägnantes Zitat oder kurzer Satz, der die Bedeutung für den Sport unterstreicht',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sortierung',
      defaultValue: 0,
      admin: { description: 'Niedrigere Zahlen erscheinen zuerst' },
    },
  ],
}
