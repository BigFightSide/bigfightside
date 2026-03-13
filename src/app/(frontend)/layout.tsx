import React from 'react'
import { Nav } from './components/Nav'
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
  return (
    <>
      <Nav />
      {children}
    </>
  )
}
