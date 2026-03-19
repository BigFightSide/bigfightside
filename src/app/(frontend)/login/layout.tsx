import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anmelden | Big Fight Side',
  description: 'Melde dich mit deinem Konto an.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
