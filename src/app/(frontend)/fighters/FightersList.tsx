'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from '../components/MediaImageWithFallback'
import type { Fighter, Media, Gym } from '@/payload-types'

const INITIAL_COUNT = 6
const LOAD_MORE_COUNT = 6

function getProfileImageUrl(profileImage: Fighter['profileImage']): string | null {
  if (!profileImage || typeof profileImage === 'number') return null
  const media = profileImage as Media
  return media?.url ?? null
}

function getGymName(gym: Fighter['gym']): string | null {
  if (!gym || typeof gym === 'number') return null
  return (gym as Gym).name ?? null
}

type TabId = 'male' | 'female'

interface FightersListProps {
  fightersMen: Fighter[]
  fightersWomen: Fighter[]
}

export function FightersList({ fightersMen, fightersWomen }: FightersListProps) {
  const [activeTab, setActiveTab] = useState<TabId>('male')
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  const fighters = activeTab === 'male' ? fightersMen : fightersWomen
  const visibleFighters = fighters.slice(0, visibleCount)
  const hasMore = visibleCount < fighters.length

  const loadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
  }

  const switchTab = (tab: TabId) => {
    setActiveTab(tab)
    setVisibleCount(INITIAL_COUNT)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchTab('male')}
          className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'male'
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border bg-anthracite-card text-muted-light hover:border-accent/50 hover:text-white'
          }`}
        >
          Männer
        </button>
        <button
          type="button"
          onClick={() => switchTab('female')}
          className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'female'
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border bg-anthracite-card text-muted-light hover:border-accent/50 hover:text-white'
          }`}
        >
          Frauen
        </button>
      </div>

      {/* Empty State */}
      {fighters.length === 0 ? (
        <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
          <p className="text-muted-light">
            Aktuell keine Kämpfer in dieser Kategorie gelistet
          </p>
        </div>
      ) : (
        <>
          {/* Grid: 1 col mobile, 3 cols desktop; einheitliche Card-Höhe durch h-full */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {visibleFighters.map((fighter) => {
              const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
              const gymName = getGymName(fighter.gym)
              const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`

              return (
                <Link
                  key={fighter.id}
                  href={`/fighters/${fighter.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(184,134,11,0.3)]"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex flex-1 flex-col p-5 pl-6">
                    <div className="relative mb-4 aspect-[4/3] shrink-0 overflow-hidden rounded-lg bg-anthracite-light">
                      {imageUrl ? (
                        <MediaImageWithFallback
                          src={imageUrl}
                          alt={fighter.name}
                          fallbackSrc="/fighter-placeholder.png"
                          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src="/fighter-placeholder.png"
                          alt="Platzhalter-Kämpfer"
                          className="h-full w-full object-cover object-top opacity-80"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 to-transparent opacity-60" />
                    </div>
                    <h2 className="font-bold text-xl text-white transition-colors group-hover:text-accent">
                      {fighter.name}
                      {fighter.nickname && (
                        <span className="ml-1 font-medium text-muted-light">
                          &quot;{fighter.nickname}&quot;
                        </span>
                      )}
                    </h2>
                    <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                      <span className="opacity-90">RECORD</span>
                      <span>{record}</span>
                    </div>
                    {gymName && (
                      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-muted-light">
                        <span className="text-gold">▸</span>
                        {gymName}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Mehr laden */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={loadMore}
                className="rounded-lg border border-accent bg-anthracite px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
              >
                Mehr laden
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
