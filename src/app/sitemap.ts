import type { MetadataRoute } from 'next';
import { getAllDestinationSlugs, getPublishedEvents, getPublishedFood, getPublishedItineraries, getPublishedStays } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://visitvagad.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destSlugs, events, food, itineraries, stays] = await Promise.all([
    getAllDestinationSlugs(),
    getPublishedEvents(),
    getPublishedFood(),
    getPublishedItineraries(),
    getPublishedStays(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/food`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/itineraries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/stays`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/culture`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/plan-your-trip`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const destRoutes: MetadataRoute.Sitemap = destSlugs.map((slug) => ({
    url: `${SITE_URL}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/events/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const foodRoutes: MetadataRoute.Sitemap = food.map((f) => ({
    url: `${SITE_URL}/food/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const itineraryRoutes: MetadataRoute.Sitemap = itineraries.map((i) => ({
    url: `${SITE_URL}/itineraries/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const stayRoutes: MetadataRoute.Sitemap = stays.map((s) => ({
    url: `${SITE_URL}/stays`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...destRoutes, ...eventRoutes, ...foodRoutes, ...itineraryRoutes, ...stayRoutes];
}
