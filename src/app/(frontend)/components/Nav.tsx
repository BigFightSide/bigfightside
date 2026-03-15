import Link from 'next/link'
import Image from 'next/image'
import { FightersMenu } from './FightersMenu'
import { SearchToggle } from './SearchToggle'
import { UserMenu } from './UserMenu'
import type { User } from '@/payload-types'

type NavProps = {
  user?: User | null
}

export function Nav({ user = null }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-anthracite/95 backdrop-blur supports-[backdrop-filter]:bg-anthracite/80">
      <div className="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center transition opacity-90 hover:opacity-100"
          aria-label="Big Fight Side – Startseite"
        >
          <Image
            src="/logo.png"
            alt="Big Fight Side MMA"
            width={180}
            height={48}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>
        <div className="flex min-w-0 shrink items-center justify-end gap-1 sm:gap-2">
          <div className="nav-links-scroll flex min-w-0 overflow-x-auto overflow-y-hidden sm:overflow-visible">
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white sm:px-3"
              >
                Home
              </Link>
              <Link
                href="/news"
                className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white sm:px-3"
              >
                News
              </Link>
              <Link
                href="/events"
                className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white sm:px-3"
              >
                Events
              </Link>
              <FightersMenu />
            </div>
          </div>
          <div className="ml-1 flex shrink-0 items-center gap-1 sm:ml-2 sm:gap-2">
            <SearchToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </nav>
  )
}
