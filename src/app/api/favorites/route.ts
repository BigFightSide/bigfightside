import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import type { Fighter } from '@/payload-types'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  let fighterId: number
  try {
    const body = await req.json()
    fighterId = Number(body.fighterId)
    if (!fighterId || isNaN(fighterId)) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Ungültige Kämpfer-ID' }, { status: 400 })
  }

  const currentUser = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 0,
    overrideAccess: true,
  })

  const currentFavorites: number[] = ((currentUser.favorites ?? []) as (number | Fighter)[]).map(
    (f) => (typeof f === 'number' ? f : f.id),
  )

  const alreadyFavorite = currentFavorites.includes(fighterId)
  const updatedFavorites = alreadyFavorite
    ? currentFavorites.filter((id) => id !== fighterId)
    : [...currentFavorites, fighterId]

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { favorites: updatedFavorites },
    overrideAccess: true,
  })

  return NextResponse.json({
    isFavorite: !alreadyFavorite,
    favorites: updatedFavorites,
  })
}
