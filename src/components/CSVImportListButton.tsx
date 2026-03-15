'use client'

import React from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Wird in der Events-Listen-Ansicht via admin.components.beforeList eingeblendet.
 * Link zur CSV-Import-Seite (/admin/collections/events/import).
 */
export function CSVImportListButton() {
  const pathname = usePathname()
  const importHref = pathname?.endsWith('/') ? `${pathname}import` : `${pathname}/import`

  return (
    <div className="mb-4">
      <NextLink
        href={importHref}
        className="inline-flex items-center gap-2 rounded bg-theme-success px-4 py-2 text-sm font-medium text-white no-underline hover:opacity-90"
      >
        CSV importieren
      </NextLink>
    </div>
  )
}

export default CSVImportListButton
