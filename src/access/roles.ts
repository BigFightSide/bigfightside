/**
 * Rollen für Big Fight Side CMS
 * Admin: Vollzugriff | Editor: Fighters, Gyms, News | Multimedia: Media, Interviews
 */
export const ROLES = {
  admin: 'admin',
  editor: 'editor',
  multimedia: 'multimedia',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const isAdmin = (role: string | undefined): boolean => role === ROLES.admin
export const isEditor = (role: string | undefined): boolean =>
  role === ROLES.editor || isAdmin(role)
export const isMultimedia = (role: string | undefined): boolean =>
  role === ROLES.multimedia || isAdmin(role)
