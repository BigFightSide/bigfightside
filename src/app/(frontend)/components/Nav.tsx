import Link from 'next/link'
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white transition hover:text-accent sm:text-xl"
        >
          Big Fight Side
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/news"
            className="rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
          >
            News
          </Link>
          <Link
            href="/events"
            className="rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
          >
            Events
          </Link>
          <FightersMenu />
          <div className="ml-2 flex items-center gap-1 sm:gap-2">
            <SearchToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </nav>
  )
}
