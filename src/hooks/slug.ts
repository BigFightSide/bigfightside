import type { FieldHook } from 'payload'

/**
 * Erzeugt einen URL-Slug aus einem Namen/Titel:
 * Leerzeichen → Bindestriche, Kleinbuchstaben, Umlaute ersetzt, Sonderzeichen entfernt.
 */
export function generateSlugFromTitle(title: string): string {
  if (typeof title !== 'string') return ''
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Erzeugt einen URL-Slug aus einem Namen/Titel (z. B. für /fighter/max-mustermann).
 */
export const formatSlug =
  (sourceField: string): FieldHook =>
  ({ data, value }) => {
    if (value && typeof value === 'string') return value
    const source = data?.[sourceField]
    if (typeof source !== 'string') return ''
    return generateSlugFromTitle(source)
  }
