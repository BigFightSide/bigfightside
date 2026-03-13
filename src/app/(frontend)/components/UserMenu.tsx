'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { CircleUser, LogIn, UserPlus, User as UserIcon, LogOut } from 'lucide-react'
import type { User } from '@/payload-types'

const CLOSE_DELAY_MS = 150

type UserMenuProps = {
  user?: User | null
}

export function UserMenu({ user = null }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimeout()
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      clearCloseTimeout()
    }
  }, [open])

  const displayName = user?.email ?? (user as { name?: string })?.name ?? 'Nutzer'

  return (
    <div
      className="relative"
      ref={menuRef}
      onMouseEnter={() => {
        clearCloseTimeout()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="rounded-md p-2 text-white transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-anthracite"
        aria-label="Benutzermenü"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <CircleUser className="size-6" strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-border bg-anthracite-card py-2 shadow-xl shadow-black/40"
          role="menu"
        >
          {user ? (
            <>
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-semibold text-white" title={displayName}>
                  {displayName}
                </p>
              </div>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-light transition-colors hover:bg-anthracite-light hover:text-white"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <UserIcon className="size-4 shrink-0" strokeWidth={1.5} />
                Mein Profil
              </Link>
              <div className="mt-1 border-t border-border pt-1">
                <form action="/api/users/logout" method="POST" className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-muted-light transition-colors hover:bg-anthracite-light hover:text-red-400 focus:outline-none"
                    role="menuitem"
                  >
                    <LogOut className="size-4 shrink-0" strokeWidth={1.5} />
                    Abmelden
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/admin/login"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-light transition-colors hover:bg-anthracite-light hover:text-white"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <LogIn className="size-4 shrink-0" strokeWidth={1.5} />
                Anmelden
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-light transition-colors hover:bg-anthracite-light hover:text-white"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <UserPlus className="size-4 shrink-0" strokeWidth={1.5} />
                Registrieren
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
