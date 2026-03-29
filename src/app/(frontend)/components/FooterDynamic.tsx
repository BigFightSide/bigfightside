'use client'

import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('./Footer').then((m) => ({ default: m.Footer })), {
  ssr: false,
  loading: () => <div className="h-28 w-full shrink-0 bg-anthracite-light" aria-hidden />,
})

export function FooterDynamic() {
  return <Footer />
}
