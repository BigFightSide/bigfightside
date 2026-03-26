import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import { headers } from 'next/headers'
import React from 'react'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Big Fight Side – MMA-Plattform',
  description: 'MMA-Plattform – Kämpfer, Gyms, Events',
  icons: {
    icon: '/logo.png?v=20260326',
    shortcut: '/logo.png?v=20260326',
    apple: '/logo.png?v=20260326',
  },
  openGraph: {
    images: ['/logo.png?v=20260326'],
  },
  twitter: {
    images: ['/logo.png?v=20260326'],
  },
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  // Payload (Admin, API, GraphQL) bringt eigenes <html>/<body> im (payload)-Route-Group mit.
  // Für alle diese Routen darf hier KEIN zusätzliches <html>/<body> gerendert werden,
  // sonst entsteht der Fehler "In HTML, <html> cannot be a child of <body>".
  const isPayloadRoute =
    pathname.startsWith('/(payload)') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/graphql')

  if (isPayloadRoute) {
    return <>{children}</>
  }

  return (
    <html lang="de" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
