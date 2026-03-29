'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { NewsDataArticle } from '@/lib/newsdata'

type SpotlightHeroProps = {
  newsItems: NewsDataArticle[]
}

export function SpotlightHero({ newsItems }: SpotlightHeroProps) {
  const slides = useMemo(() => newsItems.slice(0, 5), [newsItems])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const hasSlides = slides.length > 0

  const goPrev = () => {
    if (!hasSlides) return
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goNext = () => {
    if (!hasSlides) return
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  useEffect(() => {
    if (!hasSlides || isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => {
      window.clearInterval(timer)
    }
  }, [hasSlides, isPaused, slides.length, activeIndex])

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_3fr] lg:items-stretch">
        <div
          className="relative min-h-[340px] overflow-hidden rounded-lg border border-border bg-anthracite-light sm:min-h-[420px] lg:min-h-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {hasSlides ? (
            <>
              {slides.map((slide, idx) => (
                <a
                  key={slide.article_id}
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group absolute inset-0 block h-full w-full transition-opacity duration-500 ${
                    idx === activeIndex ? 'z-[1] opacity-100' : 'z-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={slide.image_url ?? '/hero-bg.png'}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="line-clamp-2 text-lg font-bold leading-snug text-white sm:text-2xl">
                      {slide.title}
                    </p>
                  </div>
                </a>
              ))}

              <div
                className="pointer-events-none absolute right-3 top-3 z-[5] h-16 w-[200px] opacity-[0.38] sm:h-20 sm:w-[240px] sm:opacity-[0.42] lg:h-28 lg:w-[300px]"
                aria-hidden
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={300}
                  height={112}
                  className="h-full w-full object-contain object-right"
                  loading="lazy"
                />
              </div>

              <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-md bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                {slides.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      idx === activeIndex ? 'bg-accent' : 'bg-zinc-400/80 hover:bg-zinc-300'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                    aria-current={idx === activeIndex}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-500/70 bg-zinc-700/60 p-2 text-zinc-100 transition hover:bg-zinc-600/80"
                aria-label="Vorherige News"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-500/70 bg-zinc-700/60 p-2 text-zinc-100 transition hover:bg-zinc-600/80"
                aria-label="Nächste News"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-muted-light">
              Keine News verfügbar.
            </div>
          )}
        </div>

        <aside className="relative overflow-hidden rounded-lg border border-border bg-anthracite-light">
          <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200">
            Werbung
          </span>
          <div className="relative h-full min-h-[220px]">
            <Image
              src="/hero-bg.png"
              alt="Werbepartner Südhessen"
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">Partner</p>
              <p className="mt-1 text-xl font-bold text-gold">bet365</p>
              <p className="mt-1 text-sm text-zinc-200">Offizieller Werbepartner in Europa</p>
              <Link
                href="/kontakt"
                className="mt-3 inline-flex items-center rounded-md border border-accent/70 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-white"
              >
                Partner werden
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
