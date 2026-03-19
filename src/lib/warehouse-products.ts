/**
 * MMA Warehouse – Produktdaten
 * Einfach neue Produkte hier hinzufügen.
 */

export type ProductCategory = 'Gloves' | 'Equipment' | 'Nutrition' | 'Clothing'

export interface Product {
  id: number
  category: ProductCategory
  name: string
  description: string
  price: string
  link: string
  image: string | null
}

export const products: Product[] = [
  {
    id: 1,
    category: 'Gloves',
    name: 'Venum Challenger 3.0 Boxhandschuhe',
    description: 'Perfekt für Sparring und Sandsacktraining. Von Profis getestet.',
    price: '49,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 2,
    category: 'Gloves',
    name: 'Hayabusa T3 Boxhandschuhe',
    description: 'Premium-Qualität für intensives Training. Anatomisch geformt.',
    price: '129,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 3,
    category: 'Equipment',
    name: 'Fairtex Thai Pad Set',
    description: 'Robuste Pads für Kickboxen und Muay Thai. Ideal für Partnerübungen.',
    price: '89,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 4,
    category: 'Equipment',
    name: 'Venum MMA Hand wraps',
    description: 'Schützt deine Hände beim Training. Atmungsaktiv und langlebig.',
    price: '14,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 5,
    category: 'Nutrition',
    name: 'Optimum Nutrition Gold Standard Whey',
    description: '24g Protein pro Portion. Ideal für Muskelaufbau nach dem Training.',
    price: '34,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 6,
    category: 'Nutrition',
    name: 'Creatin Monohydrat',
    description: 'Für mehr Kraft und Ausdauer im Training. Laborgeprüft.',
    price: '19,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 7,
    category: 'Clothing',
    name: 'Venum Elite Rashguard',
    description: 'Atmungsaktives Rashguard für BJJ und MMA. Schnelltrocknend.',
    price: '59,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
  {
    id: 8,
    category: 'Clothing',
    name: 'Hayabusa Fight Shorts',
    description: 'Leicht und flexibel. Perfekt für Sparring und Wettkampf.',
    price: '79,99€',
    link: 'https://www.amazon.de/dp/DEIN_AFFILIATE_LINK',
    image: null,
  },
]

/** Kategorie-Labels für die Filter-Buttons */
export const categoryLabels: Record<ProductCategory, string> = {
  Gloves: 'Handschuhe',
  Equipment: 'Equipment',
  Nutrition: 'Nutrition',
  Clothing: 'Bekleidung',
}
