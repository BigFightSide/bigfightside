import type { CollectionConfig } from 'payload'
import { editorOrAdmin } from '@/access'

const RANKING_WEIGHT_CLASSES = [
  'Strawweight (bis 52 kg)',
  'Flyweight (bis 57 kg)',
  'Bantamweight (bis 61 kg)',
  'Featherweight (bis 66 kg)',
  'Lightweight (bis 70 kg)',
  'Welterweight (bis 77 kg)',
  'Middleweight (bis 84 kg)',
  'Light Heavyweight (bis 93 kg)',
  'Heavyweight (bis 120 kg)',
] as const

export const Rankings: CollectionConfig = {
  slug: 'rankings',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['position', 'fighter', 'weightClass', 'region', 'updatedAt'],
    listSearchableFields: ['label'],
    group: 'Verwaltung',
    description: 'Rankings nach Gewichtsklasse und Region verwalten',
  },
  labels: {
    singular: 'Ranking',
    plural: 'Rankings',
  },
  access: editorOrAdmin,
  fields: [
    {
      name: 'fighter',
      type: 'relationship',
      relationTo: 'fighters',
      required: true,
      label: 'Fighter',
    },
    {
      name: 'weightClass',
      type: 'select',
      required: true,
      hasMany: false,
      label: 'Gewichtsklasse',
      options: [...RANKING_WEIGHT_CLASSES],
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      label: 'Region',
      options: [
        { label: 'Europa', value: 'europe' },
        { label: 'Deutschland', value: 'germany' },
        { label: 'Hessen', value: 'hessen' },
      ],
      admin: {
        description:
          'Für Länder-Rankings (z.B. Deutschland) wird zusätzlich die Nationalität des Fighters berücksichtigt.',
      },
    },
    {
      name: 'position',
      type: 'number',
      required: true,
      label: 'Platzierung',
      min: 1,
      max: 15,
      admin: {
        description: 'Ranking-Position (1–15)',
      },
    },
    {
      name: 'label',
      type: 'text',
      label: 'Interner Titel',
      admin: {
        description:
          'Optionaler interner Titel, z.B. \"DE Lightweight #1\" – für die Admin-Übersicht.',
      },
    },
  ],
}

