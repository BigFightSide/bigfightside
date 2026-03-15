import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Fighter } from '@/payload-types'
import { FightersList } from './FightersList'

export const dynamic = 'force-dynamic'

export default async function FightersPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: allFighters } = await payload.find({
    collection: 'fighters',
    limit: 500,
    sort: 'name',
    depth: 2,
  })

  const fightersMen = (allFighters as Fighter[]).filter(
    (f) => f.gender === 'male' || (f as Fighter & { gender?: string }).gender == null
  )
  const fightersWomen = (allFighters as Fighter[]).filter((f) => f.gender === 'female')

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      {/* Header */}
      <header className="border-b border-border bg-anthracite/95 backdrop-blur supports-[backdrop-filter]:bg-anthracite/90">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-wider text-muted-light transition hover:text-accent"
          >
            ← Zurück
          </Link>
          <h1 className="mt-4 font-bold text-4xl tracking-tight text-white sm:text-5xl">
            Kämpfer
          </h1>
          <p className="mt-2 font-medium text-muted-light">
            Die Fighter von Big Fight Side – alle Athleten im Überblick.
          </p>
        </div>
      </header>

      {/* Tabs + Grid + Mehr laden (Client-Komponente) */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <FightersList fightersMen={fightersMen} fightersWomen={fightersWomen} />
      </div>
    </main>
  )
}
