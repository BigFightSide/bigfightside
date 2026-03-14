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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center transition opacity-90 hover:opacity-100"
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
