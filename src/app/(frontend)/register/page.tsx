'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          role: 'editor',
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.errors?.[0]?.message ?? data.message ?? 'Registrierung fehlgeschlagen.')
        setLoading(false)
        return
      }

      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      if (!loginRes.ok) {
        setError('Konto erstellt, aber Anmeldung fehlgeschlagen. Bitte melde dich manuell an.')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Netzwerkfehler. Bitte später erneut versuchen.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-white transition hover:text-accent"
          >
            ← Zurück
          </Link>
          <h1 className="mt-4 font-bold text-3xl text-white sm:text-4xl">
            Partner werden
          </h1>
          <p className="mt-2 text-white/90">
            Registriere dich als Partner und erhalte Zugang zum Dashboard.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-anthracite-card p-6 sm:p-8"
        >
          {error && (
            <div
              className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-white">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border bg-anthracite-light px-3 py-2.5 text-white placeholder:text-muted-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Dein Name"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-white">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-anthracite-light px-3 py-2.5 text-white placeholder:text-muted-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="deine@email.de"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-white">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-anthracite-light px-3 py-2.5 text-white placeholder:text-muted-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Mind. 8 Zeichen"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Wird angelegt …' : 'Registrieren'}
            </button>
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-white transition hover:text-accent"
            >
              Bereits Konto? Anmelden
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}
