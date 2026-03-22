'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  fighterId: number
  fighterName: string
  initialIsFavorite: boolean
  /** 'sm' = dezent auf Karten, 'lg' = prominent auf Profilseite */
  size?: 'sm' | 'lg'
}

export function FavoriteButton({
  fighterId,
  fighterName,
  initialIsFavorite,
  size = 'sm',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, startTransition] = useTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      try {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ fighterId }),
        })
        if (res.ok) {
          const data = await res.json()
          setIsFavorite(data.isFavorite)
        } else if (res.status === 401) {
          window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`
        }
      } catch {
        // Netzwerkfehler ignorieren
      }
    })
  }

  if (size === 'lg') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isFavorite ? `${fighterName} aus Favoriten entfernen` : `${fighterName} zu Favoriten hinzufügen`}
        aria-pressed={isFavorite}
        className={`inline-flex items-center gap-2.5 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 ${
          isFavorite
            ? 'border-red-500/60 bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:border-red-500/80'
            : 'border-border bg-anthracite-card text-muted-light hover:border-red-500/50 hover:text-red-400'
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-all duration-200 ${isFavorite ? 'fill-red-400 text-red-400' : ''} ${isPending ? 'animate-pulse' : ''}`}
          strokeWidth={2}
        />
        {isFavorite ? 'Favorit' : 'Favorit werden'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? `${fighterName} aus Favoriten entfernen` : `${fighterName} zu Favoriten hinzufügen`}
      aria-pressed={isFavorite}
      className={`rounded-md border p-1.5 transition-all duration-200 disabled:opacity-60 ${
        isFavorite
          ? 'border-red-500/50 bg-red-500/15 text-red-400 hover:bg-red-500/25'
          : 'border-border bg-anthracite-light/50 text-muted-light hover:border-red-500/40 hover:text-red-400'
      }`}
    >
      <Heart
        className={`h-3.5 w-3.5 transition-all duration-200 ${isFavorite ? 'fill-red-400 text-red-400' : ''} ${isPending ? 'animate-pulse' : ''}`}
        strokeWidth={2}
      />
    </button>
  )
}
