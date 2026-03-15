import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registrieren | Big Fight Side',
  description: 'Als Partner registrieren und Zugang zum Dashboard erhalten.',
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
