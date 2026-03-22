import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import type { Fighter, Media, Gym } from '@/payload-types'
import { FightHistoryChart, type FightHistoryChartPoint } from '../../components/FightHistoryChart'
import { MediaImageWithFallback } from '../../components/MediaImageWithFallback'
import { getMediaDisplayUrl } from '@/lib/media-url'
import { FavoriteButton } from '@/components/FavoriteButton'

export const dynamic = 'force-dynamic'

// Dark Mode, edel: #101010 bg, #1A1A1A cards, Dunkelgold Akzent, #F3F4F6 text
const BG_DARK = '#101010'
const CARD_BG = '#1A1A1A'
const ACCENT = '#B8860B'
const TEXT_MAIN = '#F3F4F6'
const BORDER = 'rgb(31 41 55)' // gray-800

function getProfileImageUrl(profileImage: Fighter['profileImage']): string | null {
  if (!profileImage || typeof profileImage === 'number') return null
  const media = profileImage as Media
  return media?.url ?? null
}

function getGym(gym: Fighter['gym']): Gym | null {
  if (!gym || typeof gym === 'number') return null
  return gym as Gym
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '–'
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '–'
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getAge(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  const birth = new Date(dateStr)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function getCountryFlag(code: string | null | undefined): string | null {
  if (!code || typeof code !== 'string') return null
  const trimmed = code.trim().toUpperCase()
  if (trimmed.length !== 2) return null
  const a = 0x1f1e6
  const charCode = (c: string) => c.charCodeAt(0) - 65
  if (charCode(trimmed[0]) < 0 || charCode(trimmed[0]) > 25) return null
  if (charCode(trimmed[1]) < 0 || charCode(trimmed[1]) > 25) return null
  return String.fromCodePoint(a + charCode(trimmed[0]), a + charCode(trimmed[1]))
}

const NATION_LABELS: Record<string, string> = {
  DE: 'DEUTSCHLAND',
  AT: 'ÖSTERREICH',
  CH: 'SCHWEIZ',
  US: 'USA',
  NL: 'NIEDERLANDE',
  PL: 'POLEN',
  FR: 'FRANKREICH',
  GB: 'GROSSBRITANNIEN',
  IT: 'ITALIEN',
  ES: 'SPANIEN',
  BE: 'BELGIEN',
}

function getNationLabel(nationality: string | null | undefined): string | null {
  if (!nationality?.trim()) return null
  const code = nationality.trim().toUpperCase()
  if (code.length === 2) return NATION_LABELS[code] ?? code
  return code.toUpperCase()
}

/** Vorname (erstes Wort) + Nachname (Rest) für UFC-Header */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length <= 1) return { firstName: '', lastName: fullName }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

type FightResult = 'win' | 'loss' | 'draw' | 'no_contest'
const RESULT_LABELS: Record<FightResult, string> = {
  win: 'Sieg',
  loss: 'Niederlage',
  draw: 'Unentschieden',
  no_contest: 'No Contest',
}

function getInstagramHandle(fighter: Fighter): string | null {
  const fromGroup = fighter.socialMedia?.instagram?.trim()
  if (fromGroup) return fromGroup
  return fighter.instagramHandle?.trim() ?? null
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'fighters',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const fighter = result.docs[0]
  if (!fighter) return { title: 'Kämpfer nicht gefunden' }
  const title = fighter.metaTitle ?? `${fighter.name} | Big Fight Side`
  const description = fighter.metaDescription ?? undefined
  return { title, description }
}

export default async function FighterDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user: currentUser } = await payload.auth({ headers: headersList })

  const result = await payload.find({
    collection: 'fighters',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const fighter = result.docs[0]
  if (!fighter) notFound()

  let isFavorite = false
  if (currentUser) {
    const userWithFavorites = await payload.findByID({
      collection: 'users',
      id: currentUser.id,
      depth: 0,
      overrideAccess: true,
    })
    const favoriteIds = ((userWithFavorites.favorites ?? []) as (number | Fighter)[]).map(
      (f) => (typeof f === 'number' ? f : f.id),
    )
    isFavorite = favoriteIds.includes(fighter.id)
  }

  const imageUrl = getMediaDisplayUrl(getProfileImageUrl(fighter.profileImage))
  const gym = getGym(fighter.gym)
  const teamLabel = gym?.name ?? fighter.team ?? null
  const recordW = fighter.wins
  const recordL = fighter.losses
  const recordD = fighter.draws
  const flag = getCountryFlag(fighter.nationality)
  const nationLabel = getNationLabel(fighter.nationality) ?? (flag ? (fighter.nationality ?? '').toUpperCase() : null)
  const { firstName, lastName } = splitName(fighter.name)
  const fights = (fighter.fightHistory ?? []).filter(
    (f) => f && typeof f.opponent === 'string' && f.result,
  )
  // Kampfhistorie chronologisch (ältester zuerst) für die Statistik-Kurve: Sieg +1, Niederlage -1
  const sortedFights = [...fights].sort((a, b) => {
    const tA = a.date ? new Date(a.date).getTime() : 0
    const tB = b.date ? new Date(b.date).getTime() : 0
    return tA - tB
  })
  const chartData: FightHistoryChartPoint[] = []
  if (sortedFights.length > 0) {
    chartData.push({ dateLabel: 'Beginn', score: 0 })
    let score = 0
    for (const f of sortedFights) {
      score += f.result === 'win' ? 1 : f.result === 'loss' ? -1 : 0
      chartData.push({
        dateLabel: formatDateShort(f.date) ?? '',
        score,
        result: f.result,
        opponent: f.opponent,
      })
    }
  }
  const instagram = getInstagramHandle(fighter)
  const twitter = fighter.socialMedia?.twitter?.trim() ?? null
  const youtube = fighter.socialMedia?.youtube?.trim() ?? null
  const hasSocial = instagram || twitter || youtube
  const stats = fighter.stats
  const status = fighter.status ?? 'active'
  const birthDate = formatDate(fighter.dateOfBirth)
  const age = getAge(fighter.dateOfBirth)

  return (
    <main
      className="min-h-screen font-sans"
      style={{ background: BG_DARK, color: TEXT_MAIN }}
    >
      {/* Back link */}
      <header
        className="border-b"
        style={{ borderColor: BORDER, background: BG_DARK }}
      >
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Link
            href="/fighters"
            className="text-sm font-semibold uppercase tracking-wider transition hover:opacity-90"
            style={{ color: ACCENT }}
          >
            ← Alle Kämpfer
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* ─── A. Header (UFC-Style): Nation links | Name Mitte | Gewichtsklasse rechts ─── */}
        <section
          className="rounded-lg border p-6 sm:p-8"
          style={{ background: CARD_BG, borderColor: BORDER }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Links: Flagge + Nation */}
            <div className="flex items-center gap-3">
              {flag && (
                <span className="text-3xl" title={fighter.nationality ?? undefined} aria-hidden>
                  {flag}
                </span>
              )}
              {(nationLabel || flag) && (
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: 'rgb(156 163 175)' }}
                >
                  {nationLabel ?? (fighter.nationality ?? '').toUpperCase()}
                </span>
              )}
            </div>

            {/* Mitte: Vorname (grau) + Nachname (fett, groß) + Spitzname */}
            <div className="flex-1 text-center sm:text-center">
              {firstName && (
                <p
                  className="text-sm font-medium uppercase tracking-wider sm:text-base"
                  style={{ color: 'rgb(156 163 175)' }}
                >
                  {firstName}
                </p>
              )}
              <h1
                className="mt-1 font-bold uppercase tracking-tight sm:mt-0"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: TEXT_MAIN }}
              >
                {lastName}
              </h1>
              {fighter.nickname && (
                <p
                  className="mt-1 text-sm font-medium uppercase tracking-wide"
                  style={{ color: 'rgb(156 163 175)' }}
                >
                  &quot;{fighter.nickname}&quot;
                </p>
              )}
            </div>

            {/* Rechts: Gewichtsklasse + Favoriten-Button */}
            <div className="flex flex-col items-end gap-3">
              {fighter.weightClass && (
                <span
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ color: 'rgb(156 163 175)' }}
                >
                  {fighter.weightClass.toUpperCase()}
                </span>
              )}
              {currentUser && (
                <FavoriteButton
                  fighterId={fighter.id}
                  fighterName={fighter.name}
                  initialIsFavorite={isFavorite}
                  size="lg"
                />
              )}
            </div>
          </div>
        </section>

        {/* Trennlinie */}
        <div className="my-6 border-t" style={{ borderColor: BORDER }} />

        {/* ─── B. Hero: Bild links | Rekord Mitte (große Zahlen rot) | Status rechts ─── */}
        <section
          className="rounded-lg border p-6 sm:p-8"
          style={{ background: CARD_BG, borderColor: BORDER }}
        >
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
            {/* Links: Profilbild */}
            <div className="flex justify-center sm:block">
              <div
                className="h-48 w-48 overflow-hidden rounded-lg border sm:h-56 sm:w-56"
                style={{ borderColor: BORDER }}
              >
                {imageUrl ? (
                  <MediaImageWithFallback
                    src={imageUrl}
                    alt={fighter.name}
                    fallbackSrc="/fighter-placeholder.png"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <img
                    src="/fighter-placeholder.png"
                    alt="Platzhalter-Kämpfer"
                    className="h-full w-full object-cover object-top opacity-80"
                  />
                )}
              </div>
            </div>

            {/* Mitte: Rekord in drei Spalten (Zahl Gold, Label Grau, zentriert) */}
            <div className="flex flex-1">
              <div className="grid w-full grid-cols-3">
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <span
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                      color: ACCENT,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {recordW}
                  </span>
                  <span
                    className="mt-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'rgb(156 163 175)' }}
                  >
                    Siege
                  </span>
                </div>
                <div
                  className="flex flex-col items-center justify-center border-l py-2 text-center"
                  style={{ borderColor: BORDER }}
                >
                  <span
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                      color: ACCENT,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {recordL}
                  </span>
                  <span
                    className="mt-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'rgb(156 163 175)' }}
                  >
                    Niederlagen
                  </span>
                </div>
                <div
                  className="flex flex-col items-center justify-center border-l py-2 text-center"
                  style={{ borderColor: BORDER }}
                >
                  <span
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                      color: ACCENT,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {recordD}
                  </span>
                  <span
                    className="mt-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'rgb(156 163 175)' }}
                  >
                    Unentschieden
                  </span>
                </div>
              </div>
            </div>

            {/* Rechts: Status-Block (AKTIV / Titel) */}
            <div className="flex justify-center sm:block">
              <div
                className="rounded-lg border px-6 py-4 text-center"
                style={{ borderColor: BORDER, background: BG_DARK }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: 'rgb(156 163 175)' }}
                >
                  Status
                </p>
                <p
                  className="mt-2 font-bold uppercase tracking-wider"
                  style={{ color: status === 'active' ? ACCENT : 'rgb(156 163 175)' }}
                >
                  {status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trennlinie */}
        <div className="my-6 border-t" style={{ borderColor: BORDER }} />

        {/* ─── C. Info-Grid: STATUS | GEBOREN | GRÖSSE | REICHWEITE | LEG REACH ─── */}
        <section
          className="rounded-lg border overflow-hidden"
          style={{ background: CARD_BG, borderColor: BORDER }}
        >
          <div className="grid grid-cols-2 divide-x divide-y sm:grid-cols-5 sm:divide-y-0" style={{ borderColor: BORDER }}>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(107 114 128)' }}>
                Status
              </p>
              <p className="mt-1 font-semibold" style={{ color: TEXT_MAIN }}>
                {status === 'active' ? 'Aktiv' : 'Inaktiv'}
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(107 114 128)' }}>
                Geboren
              </p>
              <p className="mt-1 font-semibold" style={{ color: TEXT_MAIN }}>
                {birthDate !== '–' && age != null ? `${birthDate} (${age})` : birthDate}
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(107 114 128)' }}>
                Größe
              </p>
              <p className="mt-1 font-semibold" style={{ color: TEXT_MAIN }}>
                {stats?.height ?? '–'}
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(107 114 128)' }}>
                Reichweite
              </p>
              <p className="mt-1 font-semibold" style={{ color: TEXT_MAIN }}>
                {stats?.reach ?? '–'}
              </p>
            </div>
            <div className="p-4 sm:p-5 col-span-2 sm:col-span-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(107 114 128)' }}>
                Leg Reach
              </p>
              <p className="mt-1 font-semibold" style={{ color: TEXT_MAIN }}>
                {stats?.legReach ?? '–'}
              </p>
            </div>
          </div>
        </section>

        {/* Trennlinie */}
        <div className="my-6 border-t" style={{ borderColor: BORDER }} />

        {/* ─── Statistik-Kurve (Kampfverlauf: Sieg ↑, Niederlage ↓) ─── */}
        {chartData.length > 1 && (
          <>
            <section
              className="rounded-lg border overflow-hidden"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <h2
                className="border-b px-6 py-4 text-xs font-bold uppercase tracking-wider"
                style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}
              >
                Kampfverlauf
              </h2>
              <div className="px-4 py-4 sm:px-6 sm:py-5">
                <FightHistoryChart data={chartData} />
              </div>
            </section>
            <div className="my-6 border-t" style={{ borderColor: BORDER }} />
          </>
        )}

        {/* ─── D. Letzte Kämpfe (Fight History) ─── */}
        {fights.length > 0 && (
          <>
            <section
              className="rounded-lg border overflow-hidden"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <h2
                className="border-b px-6 py-4 text-xs font-bold uppercase tracking-wider"
                style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}
              >
                Letzte Kämpfe
              </h2>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="text-left" style={{ borderColor: BORDER }}>
                      <th className="border-b py-3 pl-6 pr-4 font-semibold uppercase tracking-wider" style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}>Datum</th>
                      <th className="border-b py-3 pr-4 font-semibold uppercase tracking-wider" style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}>Gegner</th>
                      <th className="border-b py-3 pr-4 font-semibold uppercase tracking-wider" style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}>Event</th>
                      <th className="border-b py-3 pr-4 font-semibold uppercase tracking-wider" style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}>Ergebnis</th>
                      <th className="border-b py-3 pr-4 font-semibold uppercase tracking-wider" style={{ borderColor: BORDER, color: 'rgb(107 114 128)' }}>Methode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fights.map((f, i) => {
                      const isWin = f.result === 'win'
                      const isLoss = f.result === 'loss'
                      const rowBg = isWin
                        ? 'bg-emerald-500/10'
                        : isLoss
                          ? 'bg-red-500/10'
                          : ''
                      const resultColor = isWin ? 'text-emerald-400' : isLoss ? 'text-red-400' : ''
                      return (
                        <tr
                          key={f.id ?? i}
                          className={`border-b ${rowBg}`}
                          style={{ borderColor: BORDER }}
                        >
                          <td className="whitespace-nowrap py-3 pl-6 pr-4 font-medium" style={{ color: TEXT_MAIN }}>
                            {formatDateShort(f.date)}
                          </td>
                          <td className="py-3 pr-4 font-medium" style={{ color: TEXT_MAIN }}>{f.opponent}</td>
                          <td className="py-3 pr-4" style={{ color: 'rgb(209 213 219)' }}>{f.event ?? '–'}</td>
                          <td className={`py-3 pr-4 font-semibold ${resultColor}`}>
                            {RESULT_LABELS[f.result as FightResult]}
                          </td>
                          <td className="py-3 pr-4" style={{ color: 'rgb(209 213 219)' }}>{f.method ?? '–'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {/* Mobile: Karten (statt Tabelle) */}
              <div className="space-y-3 p-4 md:hidden">
                {fights.map((f, i) => {
                  const isWin = f.result === 'win'
                  const isLoss = f.result === 'loss'
                  const cardBg = isWin ? 'border-emerald-500/40 bg-emerald-500/10' : isLoss ? 'border-red-500/40 bg-red-500/10' : 'border-gray-700 bg-gray-800/50'
                  const resultColor = isWin ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-gray-400'
                  return (
                    <div key={f.id ?? i} className={`rounded-lg border p-4 ${cardBg}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold" style={{ color: TEXT_MAIN }}>{f.opponent}</span>
                        <span className={`text-sm font-bold ${resultColor}`}>
                          {RESULT_LABELS[f.result as FightResult]}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: 'rgb(156 163 175)' }}>
                        <span>{formatDateShort(f.date)}</span>
                        {f.event && <span>{f.event}</span>}
                        {f.method && <span>{f.method}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
            <div className="my-6 border-t" style={{ borderColor: BORDER }} />
          </>
        )}

        {/* Social Media (dezente Icons) */}
        {hasSocial && (
          <section
            className="rounded-lg border p-6"
            style={{ background: CARD_BG, borderColor: BORDER }}
          >
            <h2
              className="mb-4 text-xs font-bold uppercase tracking-wider"
              style={{ color: 'rgb(107 114 128)' }}
            >
              Social Media
            </h2>
            <div className="flex flex-wrap gap-4">
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{ borderColor: BORDER, color: 'rgb(209 213 219)' }}
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
              )}
              {twitter && (
                <a
                  href={`https://x.com/${twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{ borderColor: BORDER, color: 'rgb(209 213 219)' }}
                  aria-label="Twitter / X"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </a>
              )}
              {youtube && (
                <a
                  href={youtube.startsWith('http') ? youtube : `https://youtube.com/${youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{ borderColor: BORDER, color: 'rgb(209 213 219)' }}
                  aria-label="YouTube"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
              )}
            </div>
          </section>
        )}

        {/* Bio (optional) */}
        {fighter.bio && (
          <>
            <div className="my-6 border-t" style={{ borderColor: BORDER }} />
            <section
              className="rounded-lg border p-6"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <h2
                className="mb-4 text-xs font-bold uppercase tracking-wider"
                style={{ color: 'rgb(107 114 128)' }}
              >
                Über den Kämpfer
              </h2>
              <p className="whitespace-pre-wrap font-medium leading-relaxed" style={{ color: 'rgb(209 213 219)' }}>
                {fighter.bio}
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
