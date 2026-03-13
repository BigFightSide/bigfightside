import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import { headers } from 'next/headers'
import React from 'react'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Big Fight Side – MMA-Plattform',
  description: 'MMA-Plattform – Kämpfer, Gyms, Events',
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

  // Payload Admin rendert eigenes <html>/<body> – kein doppeltes Wrapping
  if (pathname.startsWith('/admin')) {
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
