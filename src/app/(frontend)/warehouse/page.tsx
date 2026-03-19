import { WarehouseCards } from '@/components/WarehouseCards'

export const dynamic = 'force-dynamic'

export default function WarehousePage() {
  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      {/* Header */}
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h1 className="font-bold text-3xl text-white sm:text-4xl md:text-5xl">
            MMA WAREHOUSE
          </h1>
          <p className="mt-3 text-lg text-muted-light">
            Von Profis getestetes Equipment für dein Training in Südhessen
          </p>
        </div>
      </section>

      {/* Produkt-Grid mit Filter */}
      <section className="bg-anthracite">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <WarehouseCards />
        </div>
      </section>
    </main>
  )
}
