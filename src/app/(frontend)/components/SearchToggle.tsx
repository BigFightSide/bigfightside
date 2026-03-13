'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchToggle() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      // Beim Öffnen direkt den Fokus setzen
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }
    // Einfache Weiterleitung auf Fighters-Seite mit Query-Parameter
    router.push(`/fighters?q=${encodeURIComponent(trimmed)}`)
    setOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-light transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-anthracite"
        aria-label="Suche öffnen"
        aria-expanded={open}
      >
        <Search className="size-5" strokeWidth={1.75} />
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 top-full z-40 mt-2 flex min-w-[220px] max-w-xs items-center gap-2 rounded-xl border border-border bg-anthracite-card px-3 py-2 shadow-lg shadow-black/40"
        >
          <Search className="size-4 text-muted-light" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kämpfer suchen..."
            className="w-full bg-transparent text-sm text-white placeholder:text-muted-light outline-none"
          />
        </form>
      )}
    </div>
  )
}

