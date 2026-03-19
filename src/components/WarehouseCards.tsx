'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, Package } from 'lucide-react'
import {
  products,
  categoryLabels,
  type Product,
  type ProductCategory,
} from '@/lib/warehouse-products'

type Filter = 'all' | ProductCategory

export function WarehouseCards() {
  const [filter, setFilter] = useState<Filter>('all')

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products
    return products.filter((p) => p.category === filter)
  }, [filter])

  const categories: Filter[] = ['all', 'Gloves', 'Equipment', 'Nutrition', 'Clothing']

  return (
    <div className="flex flex-col gap-6">
      {/* Kategorien-Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
              filter === cat
                ? 'border-2 border-accent bg-accent/20 text-accent'
                : 'border border-border bg-anthracite-card text-muted-light hover:border-accent hover:text-accent'
            }`}
          >
            {cat === 'all' ? 'Alle' : categoryLabels[cat as ProductCategory]}
          </button>
        ))}
      </div>

      {/* Produkt-Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-xl border border-border bg-anthracite-card p-12 text-center">
          <p className="text-muted">Keine Produkte in dieser Kategorie.</p>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-anthracite-card transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_-5px_rgba(184,134,11,0.3)]">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold opacity-90 transition-opacity group-hover:opacity-100" />
      <div className="flex flex-1 flex-col p-4 pl-5">
        {/* Produktbild */}
        <div className="relative mb-4 aspect-square shrink-0 overflow-hidden rounded-lg bg-anthracite-light">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-anthracite text-4xl text-muted">
              <Package className="size-16 opacity-50" aria-hidden />
            </div>
          )}
        </div>

        {/* Titel */}
        <h2 className="font-bold text-base text-white transition-colors group-hover:text-accent sm:text-lg">
          {product.name}
        </h2>

        {/* Kurzbeschreibung */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-light">
          {product.description}
        </p>

        {/* Preis-Badge */}
        <div className="mt-3 inline-flex w-fit items-center rounded-md border border-accent bg-accent/15 px-2.5 py-1 text-sm font-bold text-accent">
          {product.price}
        </div>

        {/* Affiliate-Button – immer unten fixiert */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-accent bg-accent px-4 py-2.5 text-sm font-bold text-black transition hover:bg-accent-hover hover:border-accent-hover"
        >
          Bei Amazon prüfen
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </div>
    </article>
  )
}
