import Link from 'next/link'

export function Nav() {
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
            href="/fighters"
            className="rounded-md px-3 py-2 text-sm font-semibold text-muted-light transition hover:bg-anthracite-light hover:text-white"
          >
            Kämpfer
          </Link>
          <Link
            href="/fighters"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            Alle Kämpfer
          </Link>
          <a
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:text-gold"
          >
            Admin
          </a>
        </div>
      </div>
    </nav>
  )
}
