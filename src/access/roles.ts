/**
 * Rollen für Big Fight Side CMS
 * Admin: Vollzugriff | Editor: Fighters, Gyms, News | Multimedia: Media, Interviews | Fan: Nur Lesen
 */
export const ROLES = {
  admin: 'admin',
  editor: 'editor',
  multimedia: 'multimedia',
  fan: 'fan',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const isAdmin = (role: string | undefined): boolean => role === ROLES.admin
export const isEditor = (role: string | undefined): boolean =>
  role === ROLES.editor || isAdmin(role)
export const isMultimedia = (role: string | undefined): boolean =>
  role === ROLES.multimedia || isAdmin(role)

/** Anzeigename für Rollen auf Profilseiten */
export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  editor: 'Partner',
  multimedia: 'Videograf',
  fan: 'Fan',
}
