import React from 'react'

/**
 * Kleines Icon für Favicon / eingeklappte Sidebar im Payload-Admin.
 * Wird via admin.components.graphics.Icon eingebunden.
 */
export const AdminIcon: React.FC<Record<string, unknown>> = () => {
  return (
    <img
      src="/logo.png"
      alt="Big Fight Side"
      style={{ height: 24, width: 24, objectFit: 'contain', display: 'block' }}
    />
  )
}

export default AdminIcon
