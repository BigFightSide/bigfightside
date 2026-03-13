import type { CollectionConfig } from 'payload'
import { formatSlug } from '@/hooks/slug'
import { editorOrAdmin } from '@/access'

const WEIGHT_CLASSES = [
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

export const Fighters: CollectionConfig = {
  slug: 'fighters',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nickname', 'weightClass', 'wins', 'losses', 'draws', 'updatedAt'],
    listSearchableFields: ['name', 'nickname', 'slug'],
    group: 'Verwaltung',
    description: 'Kämpfer verwalten',
  },
  labels: {
    singular: 'Kämpfer',
    plural: 'Kämpfer',
  },
  access: editorOrAdmin,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Vor- & Nachname',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-Slug, z.B. /fighter/max-mustermann' },
      hooks: {
        beforeChange: [formatSlug('name')],
      },
    },
    {
      name: 'nickname',
      type: 'text',
      label: 'Spitzname',
      admin: { description: 'Kampfname, z.B. "The Beast"' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'wins',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          label: 'Siege (Rekord)',
          admin: { description: 'Anzahl Siege – wird als Rekord z.B. 12-2-0 angezeigt' },
        },
        {
          name: 'losses',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          label: 'Niederlagen',
          admin: { description: 'Anzahl Niederlagen' },
        },
        {
          name: 'draws',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          label: 'Unentschieden',
          admin: { description: 'Anzahl Unentschieden' },
        },
      ],
    },
    {
      name: 'weightClass',
      type: 'select',
      required: true,
      options: [...WEIGHT_CLASSES],
      hasMany: false,
      label: 'Gewichtsklasse',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Inaktiv', value: 'inactive' },
      ],
      defaultValue: 'active',
      admin: { description: 'Wird in der Info-Leiste angezeigt (z.B. AKTIV)' },
    },
    {
      name: 'nationality',
      type: 'text',
      label: 'Nation',
      admin: {
        description: 'Nationalität, z.B. "DE" oder "Deutschland" – Ländercode (DE, AT, US) für Flaggen',
      },
    },
    {
      name: 'team',
      type: 'text',
      label: 'Team / Gym (Text)',
      admin: { description: 'Team- oder Gym-Name, falls nicht über Verknüpfung gewählt' },
    },
    {
      name: 'gym',
      type: 'relationship',
      relationTo: 'gyms',
      hasMany: false,
      label: 'Team / Gym (Verknüpfung)',
      admin: { description: 'Zugehöriges Gym aus der Gyms-Liste' },
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      admin: { description: 'Links zu Profilen (ohne @ bei Handles)' },
      fields: [
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
          admin: { description: 'z.B. max_mustermann' },
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter / X',
          admin: { description: 'Handle ohne @' },
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube',
          admin: { description: 'Kanal-URL oder Kanalname' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Statistik',
      admin: { description: 'Größe, Reichweite, Kampfstil' },
      fields: [
        {
          name: 'height',
          type: 'text',
          label: 'Größe',
          admin: { description: 'z.B. 1,75 m oder 5\'9"' },
        },
        {
          name: 'reach',
          type: 'text',
          label: 'Reichweite',
          admin: { description: 'Armspannweite, z.B. 180 cm' },
        },
        {
          name: 'legReach',
          type: 'text',
          label: 'Leg Reach',
          admin: { description: 'Beinreichweite in cm (optional)' },
        },
        {
          name: 'fightingStyle',
          type: 'text',
          label: 'Kampfstil',
          admin: { description: 'z.B. Boxer, Wrestler, BJJ' },
        },
      ],
    },
    {
      name: 'fightHistory',
      type: 'array',
      label: 'Kampfhistorie',
      admin: { description: 'Vergangene Kämpfe (neueste zuerst)' },
      fields: [
        {
          name: 'opponent',
          type: 'text',
          required: true,
          label: 'Gegner',
        },
        {
          name: 'result',
          type: 'select',
          required: true,
          label: 'Ergebnis',
          options: [
            { label: 'Sieg', value: 'win' },
            { label: 'Niederlage', value: 'loss' },
            { label: 'Unentschieden', value: 'draw' },
            { label: 'No Contest', value: 'no_contest' },
          ],
        },
        {
          name: 'method',
          type: 'text',
          label: 'Methode',
          admin: { description: 'z.B. KO, TKO, Submission, Decision' },
        },
        {
          name: 'event',
          type: 'text',
          label: 'Event',
          admin: { description: 'Name des Events' },
        },
        {
          name: 'date',
          type: 'date',
          label: 'Datum',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profilbild',
      admin: { description: 'Profilbild des Kämpfers' },
    },
    {
      name: 'instagramHandle',
      type: 'text',
      label: 'Instagram (Legacy)',
      admin: { description: 'Falls noch genutzt – sonst Social-Media-Gruppe verwenden' },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografie',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Geburtsdatum',
      admin: { description: 'Geburtsdatum' },
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
