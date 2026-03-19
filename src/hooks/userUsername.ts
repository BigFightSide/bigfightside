import type { CollectionBeforeChangeHook } from 'payload'
import { generateSlugFromTitle } from './slug'

/**
 * Stellt sicher, dass beim Erstellen/Aktualisieren eines Users ein eindeutiger
 * username (Slug) aus dem Namen generiert wird. Bei Duplikaten wird -2, -3, … angehängt.
 */
export const ensureUniqueUsername: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (!data) return data

  const name = data.name as string | undefined
  const existingUsername = data.username as string | undefined
  const id = data.id as number | undefined

  let base = existingUsername?.trim()
  if (!base && typeof name === 'string') {
    base = generateSlugFromTitle(name)
  }
  if (!base) {
    base = `user-${Date.now()}`
  }

  let username = base
  let suffix = 1

  while (true) {
    const existing = await req.payload.find({
      collection: 'users',
      where: {
        username: { equals: username },
        ...(id && operation === 'update' ? { id: { not_equals: id } } : {}),
      },
      limit: 1,
    })

    if (existing.docs.length === 0) break
    suffix += 1
    username = `${base}-${suffix}`
  }

  data.username = username
  return data
}
