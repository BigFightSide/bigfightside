'use client'

import { useState } from 'react'

type Props = {
  src: string
  alt: string
  fallbackSrc: string
  className?: string
}

/**
 * Zeigt ein Bild; bei Ladefehler (z. B. 404/500) wird fallbackSrc angezeigt.
 * Vermeidet kaputte Bilder, wenn CMS-Medien auf dem Server fehlen (z. B. Vercel).
 */
export function MediaImageWithFallback({ src, alt, fallbackSrc, className }: Props) {
  const [failed, setFailed] = useState(false)
  const effectiveSrc = failed ? fallbackSrc : src

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
