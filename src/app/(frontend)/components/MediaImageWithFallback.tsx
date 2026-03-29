'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'

type Props = {
  src: string
  alt: string
  fallbackSrc: string
  className?: string
  /** Eltern-Element mit `relative` und fester Größe (oder `fill`-Layout) */
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
}

export function MediaImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className,
  fill = true,
  width,
  height,
  sizes = '200px',
  priority,
  loading,
}: Props) {
  const [failed, setFailed] = useState(false)
  const effectiveSrc = failed ? fallbackSrc : src

  const onError = useCallback(() => setFailed(true), [])

  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy')

  if (fill) {
    return (
      <Image
        src={effectiveSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        onError={onError}
        priority={priority}
        loading={resolvedLoading}
      />
    )
  }

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      className={className}
      sizes={sizes}
      onError={onError}
      priority={priority}
      loading={resolvedLoading}
    />
  )
}
