import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Nav } from './components/Nav'
import { FooterDynamic } from './components/FooterDynamic'
import './styles.css'

export const metadata = {
  title: 'Big Fight Side – MMA-Plattform',
  description: 'MMA-Plattform – Kämpfer, Gyms, Events. Expansion nach Europa.',
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-anthracite">
      <Nav user={user} />
      <main className="min-w-0 flex-1 bg-anthracite">
        {children}
      </main>
      <FooterDynamic />
    </div>
  )
}
