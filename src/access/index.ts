import type { CollectionConfig } from 'payload'
import { isAdmin, isEditor, isMultimedia } from './roles'

type CollectionAccess = NonNullable<CollectionConfig['access']>

/** Vollzugriff nur für Admin */
export const adminOnly: CollectionAccess = {
  create: ({ req: { user } }) => !!user && isAdmin(user.role),
  read: ({ req: { user } }) => !!user && isAdmin(user.role),
  update: ({ req: { user } }) => !!user && isAdmin(user.role),
  delete: ({ req: { user } }) => !!user && isAdmin(user.role),
}

/** Lesen für alle (öffentlich), Schreiben für Editor+ */
export const editorOrAdmin: CollectionAccess = {
  read: () => true,
  create: ({ req: { user } }) => !!user && isEditor(user.role),
  update: ({ req: { user } }) => !!user && isEditor(user.role),
  delete: ({ req: { user } }) => !!user && isAdmin(user.role),
}

/** Lesen für alle, Erstellen/Update für Multimedia+ (Videograf) */
export const multimediaOrAdmin: CollectionAccess = {
  read: () => true,
  create: ({ req: { user } }) => !!user && isMultimedia(user.role),
  update: ({ req: { user } }) => !!user && isMultimedia(user.role),
  delete: ({ req: { user } }) => !!user && isAdmin(user.role),
}
