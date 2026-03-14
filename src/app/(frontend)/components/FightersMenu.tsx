'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Users } from 'lucide-react'

const CLOSE_DELAY_MS = 120

export function FightersMenu() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  useEffect(() => () => clearCloseTimeout(), [])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        clearCloseTimeout()
        setOpen(true)
      }}
      onMouseLeave={() => {
        closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-anthracite"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Kämpfer
        <ChevronDown className="size-3.5" strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-40 mt-2 min-w-[190px] rounded-xl border border-border bg-anthracite-card py-2 shadow-lg shadow-black/40"
          onMouseEnter={clearCloseTimeout}
        >
          <Link
            href="/fighters"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-light transition-colors hover:bg-anthracite-light hover:text-white"
            onClick={() => setOpen(false)}
          >
            <Users className="size-4 shrink-0" strokeWidth={1.5} />
            Alle Kämpfer
          </Link>
          <Link
            href="/rankings"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-light transition-colors hover:bg-anthracite-light hover:text-white"
            onClick={() => setOpen(false)}
          >
            <span className="inline-flex size-4 items-center justify-center rounded-full border border-gold/50 text-[10px] text-gold">
              KG
            </span>
            Gewichtsklassen
          </Link>
        </div>
      )}
    </div>
  )
}

