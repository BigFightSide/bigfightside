import React from 'react'

/**
 * Eigenes Logo in der Payload-Admin-Navigation und auf der Login-Seite.
 * Wird via admin.components.graphics.Logo eingebunden.
 */
export const AdminLogo: React.FC<Record<string, unknown>> = () => {
  return (
    <img
      src="/logo.png?v=20260326"
      alt="Big Fight Side"
      style={{ height: 30, width: 'auto', display: 'block' }}
    />
  )
}

export default AdminLogo
