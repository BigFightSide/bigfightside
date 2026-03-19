import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import type { User } from '@/payload-types'
import { ROLES, ROLE_LABELS } from '@/access/roles'
import { Settings2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user: currentUser } = await payload.auth({ headers: headersList })

  const result = await payload.find({
    collection: 'users',
    where: { username: { equals: username } },
    limit: 1,
  })

  const profileUser = result.docs[0] as User | undefined
  if (!profileUser) notFound()

  const isOwner = currentUser?.id === profileUser.id
  const isAdmin = currentUser?.role === ROLES.admin
  const roleLabel = ROLE_LABELS[profileUser.role] ?? profileUser.role

  return (
    <main className="min-h-screen bg-anthracite text-white">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <h1 className="font-bold text-4xl tracking-tight text-white sm:text-5xl">
            {profileUser.name}
          </h1>
          <p className="mt-2 text-gold text-lg font-medium">@{profileUser.username}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5">
            <span className="text-sm font-semibold text-gold">{roleLabel}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="space-y-6 rounded-xl border border-border bg-anthracite-card p-6 sm:p-8">
          {isOwner && (
            <div className="rounded-lg border border-border bg-anthracite-light p-4">
              <p className="text-sm font-semibold text-muted-light">E-Mail</p>
              <p className="mt-1 text-white">{profileUser.email}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-anthracite-light p-4">
            <p className="text-sm font-semibold text-muted-light">Status / Rolle</p>
            <p className="mt-1 text-white">{roleLabel}</p>
          </div>

          {isAdmin && (
            <div className="mt-8 border-t border-border pt-6">
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/15 px-4 py-2.5 text-sm font-bold text-gold transition hover:bg-gold/25 hover:border-gold/70"
              >
                <Settings2 className="size-4" strokeWidth={2} />
                Admin-Portal aufrufen
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
