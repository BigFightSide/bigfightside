import React from 'react'
import Image from 'next/image'

/**
 * Eigenes Logo in der Payload-Admin-Navigation und auf der Login-Seite.
 * Wird via admin.components.graphics.Logo eingebunden.
 */
export const AdminLogo: React.FC<Record<string, unknown>> = () => {
  return (
    <Image
      src="/logo.png?v=20260326"
      alt="Big Fight Side"
      width={120}
      height={30}
      className="block h-[30px] w-auto object-contain"
      unoptimized
    />
  )
}

export default AdminLogo
