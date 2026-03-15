import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
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
    <div className="min-w-0 overflow-x-hidden">
      <Nav user={user} />
      <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-anthracite">
        {children}
      </main>
      <Footer />
    </div>
  )
}
