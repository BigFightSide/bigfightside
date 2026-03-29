'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { FightersMenu } from './FightersMenu'
import { SearchToggle } from './SearchToggle'
import { UserMenu } from './UserMenu'
import type { User } from '@/payload-types'

type NavProps = {
  user?: User | null
}

export function Nav({ user = null }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-anthracite/95 backdrop-blur supports-[backdrop-filter]:bg-anthracite/80">
      <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 pt-2 transition opacity-90 hover:opacity-100 sm:pt-2.5"
          aria-label="Big Fight Side – Startseite"
        >
          <Image
            src="/logo.png?v=20260326"
            alt="Big Fight Side MMA"
            width={234}
            height={63}
            className="h-13 w-auto sm:h-15"
            priority
          />
          <span className="hidden text-lg font-bold leading-tight tracking-[0.16em] text-gold sm:inline md:text-xl">
            BIG FIGHT SIDE
          </span>
        </Link>

        {/* Desktop: Menüpunkte sichtbar (gleiche vertikale Ausrichtung wie Logo) */}
        <div className="hidden pt-2 sm:flex sm:min-w-0 sm:shrink sm:items-center sm:justify-end sm:gap-2 sm:pt-2.5">
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/news"
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
            >
              News
            </Link>
            <Link
              href="/warehouse"
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
            >
              Warehouse
            </Link>
            <Link
              href="/events"
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
            >
              Events
            </Link>
            <FightersMenu />
            <Link
              href="/hall-of-fame"
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
            >
              Hall of Fame
            </Link>
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-2">
            <SearchToggle />
            <UserMenu user={user} />
          </div>
        </div>

        {/* Mobile: Lupe + Profil + Burger (ganz rechts) */}
        <div className="flex shrink-0 items-center justify-end gap-1 pt-2 sm:hidden">
          <SearchToggle />
          <UserMenu user={user} />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-md bg-anthracite-light p-2 text-muted-light transition hover:bg-anthracite hover:text-white"
            aria-label="Menü öffnen"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile Burger-Overlay – per Portal in body, damit kein backdrop-blur/transparenz vom Nav erbt */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] bg-black/60 sm:hidden"
              aria-hidden
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="fixed top-0 right-0 z-[9999] w-full sm:hidden"
              style={{
                backgroundColor: '#121212',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
                borderLeft: '1px solid #2d2d2d',
              }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <span className="font-semibold text-white">Menü</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md p-2 text-muted-light transition hover:bg-anthracite hover:text-white"
                  aria-label="Menü schließen"
                >
                  <X className="size-6" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <Link
                  href="/news"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-muted-light transition hover:bg-anthracite hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  News
                </Link>
                <Link
                  href="/warehouse"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-muted-light transition hover:bg-anthracite hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Warehouse
                </Link>
                <Link
                  href="/events"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-muted-light transition hover:bg-anthracite hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  href="/fighters"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-muted-light transition hover:bg-anthracite hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Kämpfer
                </Link>
                <Link
                  href="/rankings"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-muted-light transition hover:bg-anthracite hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Gewichtsklassen
                </Link>
                <Link
                  href="/hall-of-fame"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-muted-light transition hover:bg-anthracite hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Hall of Fame
                </Link>
              </div>
            </div>
          </>,
          document.body,
        )}
    </nav>
  )
}
