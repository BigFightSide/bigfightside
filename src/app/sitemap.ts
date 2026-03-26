import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const baseUrl = 'https://bigfightside.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/warehouse',
    '/news',
    '/events',
    '/fighters',
    '/hall-of-fame',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.9,
  }))

  try {
    const payload = await getPayload({ config: configPromise })

    const [{ docs: fighters }, { docs: events }, { docs: news }] = await Promise.all([
      payload.find({
        collection: 'fighters',
        limit: 1000,
        depth: 0,
      }),
      payload.find({
        collection: 'events',
        limit: 1000,
        depth: 0,
      }),
      payload.find({
        collection: 'news',
        limit: 1000,
        depth: 0,
        where: {
          status: { equals: 'published' },
        },
      }),
    ])

    const fighterRoutes: MetadataRoute.Sitemap = fighters
      .filter((fighter) => Boolean(fighter.slug))
      .map((fighter) => ({
        url: `${baseUrl}/fighters/${fighter.slug}`,
        lastModified: new Date(fighter.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

    const eventRoutes: MetadataRoute.Sitemap = events
      .filter((event) => Boolean(event.slug))
      .map((event) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

    const newsRoutes: MetadataRoute.Sitemap = news
      .filter((entry) => Boolean(entry.slug))
      .map((entry) => ({
        url: `${baseUrl}/news/${entry.slug}`,
        lastModified: new Date(entry.updatedAt),
        changeFrequency: 'daily',
        priority: 0.7,
      }))

    return [...staticRoutes, ...fighterRoutes, ...eventRoutes, ...newsRoutes]
  } catch {
    // Falls CMS/DB temporär nicht erreichbar ist, bleibt die Sitemap valide.
    return staticRoutes
  }
}
