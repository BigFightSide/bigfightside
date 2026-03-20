import type { CollectionConfig } from 'payload'
import { ROLES, isAdmin } from '@/access/roles'
import { ensureUniqueUsername } from '@/hooks/userUsername'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'username', 'role', 'updatedAt'],
    group: 'Admin',
  },
  auth: true,
  access: {
    create: () => true,
    read: () => true,
    update: ({ req: { user } }) => !!user && isAdmin(user.role),
    delete: ({ req: { user } }) => !!user && isAdmin(user.role),
  },
  hooks: {
    beforeChange: [ensureUniqueUsername],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      saveToJWT: true,
      label: 'Benutzername (URL-Slug)',
      admin: {
        description: 'Wird automatisch aus dem Namen erzeugt, z.B. /user/max-mustermann',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: ROLES.admin },
        { label: 'Partner', value: ROLES.editor },
        { label: 'Videograf', value: ROLES.multimedia },
        { label: 'Fan', value: ROLES.fan },
      ],
      saveToJWT: true,
      hasMany: false,
    },
  ],
}
