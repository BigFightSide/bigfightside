'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { MediaImageWithFallback } from '../components/MediaImageWithFallback'
import {
  FightersFilters,
  initialFilters,
  type FightersFilterState,
} from './FightersFilters'
import { FavoriteButton } from '@/components/FavoriteButton'
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

function getFightingStyle(fighter: Fighter): string {
  const style = fighter.stats?.fightingStyle
  return typeof style === 'string' ? style.toLowerCase() : ''
}

function matchesSearch(fighter: Fighter, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  const name = (fighter.name ?? '').toLowerCase()
  const nickname = (fighter.nickname ?? '').toLowerCase()
  const slug = (fighter.slug ?? '').toLowerCase()
  return name.includes(q) || nickname.includes(q) || slug.includes(q)
}

function matchesFilters(fighter: Fighter, f: FightersFilterState): boolean {
  if (f.weightClass && fighter.weightClass !== f.weightClass) return false
  if (f.nationality.trim()) {
    const nat = (fighter.nationality ?? '').toLowerCase()
    const search = f.nationality.trim().toLowerCase()
    if (!nat.includes(search)) return false
  }
  if (f.undefeatedOnly && (fighter.losses ?? 0) > 0) return false
  if (f.fightingStyles.length > 0) {
    const style = getFightingStyle(fighter)
    const matches = f.fightingStyles.some((s) => style.includes(s.toLowerCase()))
    if (!matches) return false
  }
  return true
}

type TabId = 'male' | 'female'

interface FightersListProps {
  fightersMen: Fighter[]
  fightersWomen: Fighter[]
  initialFavoriteIds?: number[]
  isLoggedIn?: boolean
}

export function FightersList({
  fightersMen,
  fightersWomen,
  initialFavoriteIds = [],
  isLoggedIn = false,
}: FightersListProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('male')
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [filterState, setFilterState] = useState<FightersFilterState>(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')

  const allFighters = activeTab === 'male' ? fightersMen : fightersWomen
  const filteredFighters = useMemo(
    () =>
      allFighters.filter(
        (f) => matchesSearch(f, searchQuery) && matchesFilters(f, filterState)
      ),
    [allFighters, filterState, searchQuery]
  )
  const visibleFighters = filteredFighters.slice(0, visibleCount)
  const hasMore = visibleCount < filteredFighters.length

  const nationalities = useMemo(() => {
    const set = new Set<string>()
    fightersMen.forEach((f) => {
      const n = f.nationality?.trim()
      if (n) set.add(n)
    })
    fightersWomen.forEach((f) => {
      const n = f.nationality?.trim()
      if (n) set.add(n)
    })
    return Array.from(set).sort()
  }, [fightersMen, fightersWomen])

  const loadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
  }

  const switchTab = (tab: TabId) => {
    setActiveTab(tab)
    setVisibleCount(INITIAL_COUNT)
  }

  const handleFilterChange = (f: FightersFilterState) => {
    setFilterState(f)
    setVisibleCount(INITIAL_COUNT)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setVisibleCount(INITIAL_COUNT)
  }

  const tabs = (
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
  )

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Filter-Sidebar (Desktop) / Toggle + Tabs (Mobile) */}
      <FightersFilters
        filterState={filterState}
        onFilterChange={handleFilterChange}
        nationalities={nationalities}
      >
        {tabs}
      </FightersFilters>

      {/* Hauptinhalt */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Tabs + Suchfeld (Desktop) */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">
          {tabs}
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-light" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Kämpfer suchen..."
              className="w-64 rounded-lg border border-border bg-anthracite pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-muted-light/70 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
              aria-label="Kämpfer suchen"
            />
          </div>
        </div>
        {/* Suchfeld (Mobile – unter Filter/Tabs) */}
        <div className="lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-light" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Kämpfer suchen..."
              className="w-full rounded-lg border border-border bg-anthracite pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-muted-light/70 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
              aria-label="Kämpfer suchen"
            />
          </div>
        </div>

        {/* Anzahl gefundener Kämpfer */}
        <p className="text-sm font-medium text-muted-light">
          {filteredFighters.length === 1
            ? '1 Kämpfer gefunden'
            : `${filteredFighters.length} Kämpfer gefunden`}
        </p>

        {/* Empty State */}
        {filteredFighters.length === 0 ? (
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
                    <div className="flex flex-1 flex-col min-h-0">
                      <div className="relative mb-4 aspect-[4/3] shrink-0 overflow-hidden rounded-lg bg-anthracite-light">
                        {imageUrl ? (
                          <MediaImageWithFallback
                            src={imageUrl}
                            alt={fighter.name}
                            fallbackSrc="/fighter-placeholder.png"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src="/fighter-placeholder.png"
                            alt="Platzhalter-Kämpfer"
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover object-top opacity-80"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 to-transparent opacity-60" />
                        {/* Favoriten-Button oben rechts auf dem Bild */}
                        {isLoggedIn && (
                          <div className="absolute right-2 top-2">
                            <FavoriteButton
                              fighterId={fighter.id}
                              fighterName={fighter.name}
                              initialIsFavorite={initialFavoriteIds.includes(fighter.id)}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                      <h2 className="font-bold text-xl text-white transition-colors group-hover:text-accent">
                        {fighter.name}
                        {fighter.nickname && (
                          <span className="ml-1 font-medium text-muted-light">
                            &quot;{fighter.nickname}&quot;
                          </span>
                        )}
                      </h2>
                      {gymName && (
                        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-muted-light">
                          <span className="text-gold">▸</span>
                          {gymName}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                        <span className="opacity-90">RECORD</span>
                        <span>{record}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          router.push(`/fighters/${fighter.slug}`)
                        }}
                        className="shrink-0 rounded-md border border-accent/60 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20 hover:border-accent"
                      >
                        Profil
                      </button>
                    </div>
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
    </div>
  )
}
