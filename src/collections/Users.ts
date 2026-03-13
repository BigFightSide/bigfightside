import type { CollectionConfig } from 'payload'
import { ROLES } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: ROLES.admin },
        { label: 'Editor (Partner)', value: ROLES.editor },
        { label: 'Multimedia (Videograf)', value: ROLES.multimedia },
      ],
      saveToJWT: true,
      hasMany: false,
    },
  ],
}
