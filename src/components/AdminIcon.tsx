import React from 'react'
import Image from 'next/image'

/**
 * Kleines Icon für Favicon / eingeklappte Sidebar im Payload-Admin.
 * Wird via admin.components.graphics.Icon eingebunden.
 */
export const AdminIcon: React.FC<Record<string, unknown>> = () => {
  return (
    <Image
      src="/logo.png?v=20260326"
      alt="Big Fight Side"
      width={24}
      height={24}
      className="block object-contain"
      unoptimized
    />
  )
}

export default AdminIcon
