'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'

const WEIGHT_CLASSES = [
  'Strawweight (bis 52 kg)',
  'Flyweight (bis 57 kg)',
  'Bantamweight (bis 61 kg)',
  'Featherweight (bis 66 kg)',
  'Lightweight (bis 70 kg)',
  'Welterweight (bis 77 kg)',
  'Middleweight (bis 84 kg)',
  'Light Heavyweight (bis 93 kg)',
  'Heavyweight (bis 120 kg)',
] as const

const FIGHTING_STYLES = [
  { value: 'striker', label: 'Striker' },
  { value: 'grappler', label: 'Grappler' },
  { value: 'wrestler', label: 'Wrestler' },
  { value: 'boxer', label: 'Boxer' },
  { value: 'bjj', label: 'BJJ' },
  { value: 'muay thai', label: 'Muay Thai' },
  { value: 'mma', label: 'MMA' },
] as const

export interface FightersFilterState {
  weightClass: string
  fightingStyles: string[]
  nationality: string
  undefeatedOnly: boolean
}

const initialFilters: FightersFilterState = {
  weightClass: '',
  fightingStyles: [],
  nationality: '',
  undefeatedOnly: false,
}

function hasActiveFilters(f: FightersFilterState): boolean {
  return (
    !!f.weightClass ||
    f.fightingStyles.length > 0 ||
    !!f.nationality.trim() ||
    f.undefeatedOnly
  )
}

interface FightersFiltersProps {
  filterState: FightersFilterState
  onFilterChange: (f: FightersFilterState) => void
  nationalities: string[]
  /** Wird auf Mobile neben dem Filter-Toggle angezeigt (z.B. Tabs) */
  children?: React.ReactNode
}

export function FightersFilters({
  filterState,
  onFilterChange,
  nationalities,
  children,
}: FightersFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const update = (patch: Partial<FightersFilterState>) => {
    onFilterChange({ ...filterState, ...patch })
  }

  const toggleFightingStyle = (value: string) => {
    const next = filterState.fightingStyles.includes(value)
      ? filterState.fightingStyles.filter((s) => s !== value)
      : [...filterState.fightingStyles, value]
    update({ fightingStyles: next })
  }

  const reset = () => {
    onFilterChange(initialFilters)
    setMobileOpen(false)
  }

  const activeCount = [
    filterState.weightClass ? 1 : 0,
    filterState.fightingStyles.length,
    filterState.nationality.trim() ? 1 : 0,
    filterState.undefeatedOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Filter</h3>
        {hasActiveFilters(filterState) && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-light transition-colors hover:bg-anthracite-light hover:text-accent"
          >
            <X className="h-3.5 w-3.5" />
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Gewichtsklasse */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-light">
          Gewichtsklasse
        </label>
        <select
          value={filterState.weightClass}
          onChange={(e) => update({ weightClass: e.target.value })}
          className={`w-full rounded-lg border bg-anthracite px-3 py-2.5 text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 ${
            filterState.weightClass
              ? 'border-accent/60 bg-accent/5 text-accent'
              : 'border-border hover:border-accent/30'
          }`}
        >
          <option value="">Alle</option>
          {WEIGHT_CLASSES.map((wc) => (
            <option key={wc} value={wc}>
              {wc.replace(' (bis ', ' – ').replace(' kg)', ' kg')}
            </option>
          ))}
        </select>
      </div>

      {/* Kampfstil */}
      <div>
        <label className="mb-2 block text-sm font-medium text-muted-light">
          Kampfstil
        </label>
        <div className="flex flex-wrap gap-2">
          {FIGHTING_STYLES.map(({ value, label }) => {
            const active = filterState.fightingStyles.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleFightingStyle(value)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border bg-anthracite text-muted-light hover:border-accent/40 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Nationalität */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-light">
          Nationalität
        </label>
        <input
          type="text"
          value={filterState.nationality}
          onChange={(e) => update({ nationality: e.target.value })}
          placeholder="z.B. DE, USA, Brasilien"
          className={`w-full rounded-lg border bg-anthracite px-3 py-2.5 text-sm text-white placeholder:text-muted-light/60 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 ${
            filterState.nationality.trim()
              ? 'border-accent/60 bg-accent/5'
              : 'border-border hover:border-accent/30'
          }`}
        />
        {nationalities.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {nationalities.slice(0, 12).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  update({
                    nationality: filterState.nationality === n ? '' : n,
                  })
                }
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  filterState.nationality === n
                    ? 'bg-accent/20 text-accent'
                    : 'bg-anthracite-light text-muted-light hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Unbesiegt */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={filterState.undefeatedOnly}
          onClick={() => update({ undefeatedOnly: !filterState.undefeatedOnly })}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
            filterState.undefeatedOnly
              ? 'border-accent bg-accent/20 text-accent'
              : 'border-border bg-anthracite hover:border-accent/40'
          }`}
        >
          {filterState.undefeatedOnly && (
            <span className="text-xs font-bold">✓</span>
          )}
        </button>
        <span className="text-sm text-muted-light">
          Nur unbesiegte Kämpfer
        </span>
      </div>

      {/* Mobile: Anwenden */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="w-full rounded-lg border border-accent bg-accent/15 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
        >
          Filter anwenden
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile: Toggle-Button + Slot für Tabs etc. */}
      <div className="flex flex-wrap items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-border bg-anthracite-card px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent/50"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
              {activeCount}
            </span>
          )}
        </button>
        {children}
      </div>

      {/* Mobile: Ausklappbares Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 h-full w-[min(320px,85vw)] overflow-y-auto border-l border-border bg-anthracite-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">Filter</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded p-2 text-muted-light hover:bg-anthracite hover:text-white"
                aria-label="Schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop: Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-6 rounded-xl border border-border bg-anthracite-card p-5">
          <FilterContent />
        </div>
      </aside>
    </>
  )
}

export { initialFilters, hasActiveFilters }
export type { FightersFilterState }
