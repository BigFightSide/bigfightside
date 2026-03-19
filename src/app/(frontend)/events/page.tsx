import { EventCards } from '@/components/EventCards'

export const dynamic = 'force-dynamic'

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="font-bold text-3xl text-white sm:text-4xl">
            Events
          </h1>
          <p className="mt-2 text-muted-light">
            Kommende MMA-Kämpfe – The Odds API
          </p>
        </div>
      </section>

      <section className="bg-anthracite">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <EventCards />
        </div>
      </section>
    </main>
  )
}
