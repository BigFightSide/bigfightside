import type { CollectionConfig } from 'payload'
import { ROLES } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
    group: 'Admin',
  },
  auth: true,
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
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
