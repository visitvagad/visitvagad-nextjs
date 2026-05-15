/**
 * Server-side data fetching utilities for all Appwrite collections.
 * Uses node-appwrite admin SDK for server components with Next.js caching.
 */
import { Query } from 'node-appwrite';
import { unstable_cache } from 'next/cache';
import { adminDb } from './appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from './appwrite-schema';
import type { Destination, Experience, Event, FoodItem, Region, GalleryImage, Highlight, NearbyPlace } from '@/types';
import type { DestinationDoc, EventDoc, FoodDoc } from '@/types/cms';

// ─── HELPERS ────────────────────────────────────────────────────────────────

function parseJson<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

function toDestination(doc: DestinationDoc): Destination {
  return {
    slug: doc.slug,
    title: doc.title,
    district: doc.district,
    heroImage: doc.heroImage || '',
    summary: doc.summary,
    story: doc.story || '',
    highlights: parseJson<Highlight[]>(doc.highlights, []),
    gallery: parseJson<Array<{ src?: string; url?: string; alt?: string; caption?: string }>>(doc.gallery, []).map(g => ({
      src: g.src || g.url || '',
      alt: g.alt || '',
      caption: g.caption,
    })),
    experiences: parseJson<string[]>(doc.experiences, []),
    bestTime: doc.bestTime || '',
    coordinates: { lat: doc.lat || 0, lng: doc.lng || 0 },
    nearbyPlaces: parseJson<NearbyPlace[]>(doc.nearbyPlaces, []),
    seo: {
      title: doc.seoTitle || `${doc.title} | VisitVagad`,
      description: doc.seoDescription || doc.summary,
      ogImage: doc.seoOgImage || doc.heroImage || undefined,
    },
    featured: doc.featured || false,
  };
}

function toEvent(doc: EventDoc): Event {
  return {
    slug: doc.slug, title: doc.title, description: doc.description,
    image: doc.image || '', date: doc.date, endDate: doc.endDate || undefined,
    location: doc.location, district: doc.district, category: doc.category,
    seo: { title: doc.seoTitle || `${doc.title} | VisitVagad`, description: doc.seoDescription || doc.description },
  };
}

function toFoodItem(doc: FoodDoc): FoodItem {
  return {
    slug: doc.slug, title: doc.title, description: doc.description,
    image: doc.image || '', origin: doc.origin || '', type: doc.type,
    seo: { title: doc.seoTitle || `${doc.title} | VisitVagad`, description: doc.seoDescription || doc.description },
  };
}

function toExperience(doc: Record<string, unknown>): Experience {
  return {
    id: doc.$id as string, title: doc.title as string,
    description: doc.description as string, image: (doc.image as string) || '',
    category: doc.category as Experience['category'],
  };
}

function toRegion(doc: Record<string, unknown>): Region {
  return {
    id: doc.$id as string, name: doc.name as string,
    tagline: doc.tagline as string, image: (doc.image as string) || '',
    destinationCount: (doc.destinationCount as number) || 0,
  };
}

// ─── DESTINATIONS ───────────────────────────────────────────────────────────

export const getPublishedDestinations = unstable_cache(async (): Promise<Destination[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
      Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(100),
    ]);
    return res.documents.map((d) => toDestination(d as unknown as DestinationDoc));
  } catch { return []; }
}, ['destinations-published'], { revalidate: 60, tags: ['destinations'] });

export const getFeaturedDestinationsFromDb = unstable_cache(async (): Promise<Destination[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
      Query.equal('featured', true), Query.equal('status', 'published'), Query.limit(6),
    ]);
    return res.documents.map((d) => toDestination(d as unknown as DestinationDoc));
  } catch { return []; }
}, ['destinations-featured'], { revalidate: 60, tags: ['destinations'] });

export const getDestinationBySlugFromDb = unstable_cache(async (slug: string): Promise<Destination | null> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
      Query.equal('slug', slug), Query.equal('status', 'published'), Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return toDestination(res.documents[0] as unknown as DestinationDoc);
  } catch { return null; }
}, ['destination-by-slug'], { revalidate: 60, tags: ['destinations'] });

export const getAllDestinationSlugs = unstable_cache(async (): Promise<string[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
      Query.equal('status', 'published'), Query.select(['slug']), Query.limit(200),
    ]);
    return res.documents.map((d) => d.slug as string);
  } catch { return []; }
}, ['destination-slugs'], { revalidate: 300, tags: ['destinations'] });

// ─── EVENTS ─────────────────────────────────────────────────────────────────

export const getPublishedEvents = unstable_cache(async (): Promise<Event[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
      Query.equal('status', 'published'), Query.orderAsc('date'), Query.limit(50),
    ]);
    return res.documents.map((d) => toEvent(d as unknown as EventDoc));
  } catch { return []; }
}, ['events-published'], { revalidate: 60, tags: ['events'] });

export const getEventBySlug = unstable_cache(async (slug: string): Promise<Event | null> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
      Query.equal('slug', slug), Query.equal('status', 'published'), Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return toEvent(res.documents[0] as unknown as EventDoc);
  } catch { return null; }
}, ['event-by-slug'], { revalidate: 60, tags: ['events'] });

// ─── FOOD ───────────────────────────────────────────────────────────────────

export const getPublishedFood = unstable_cache(async (): Promise<FoodItem[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [
      Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(50),
    ]);
    return res.documents.map((d) => toFoodItem(d as unknown as FoodDoc));
  } catch { return []; }
}, ['food-published'], { revalidate: 60, tags: ['food'] });

export const getFoodBySlug = unstable_cache(async (slug: string): Promise<FoodItem | null> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [
      Query.equal('slug', slug), Query.equal('status', 'published'), Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return toFoodItem(res.documents[0] as unknown as FoodDoc);
  } catch { return null; }
}, ['food-by-slug'], { revalidate: 60, tags: ['food'] });

// ─── EXPERIENCES ────────────────────────────────────────────────────────────

export const getPublishedExperiences = unstable_cache(async (): Promise<Experience[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EXPERIENCES, [
      Query.equal('status', 'published'), Query.limit(50),
    ]);
    return res.documents.map((d) => toExperience(d as unknown as Record<string, unknown>));
  } catch { return []; }
}, ['experiences-published'], { revalidate: 60, tags: ['experiences'] });

// ─── REGIONS ────────────────────────────────────────────────────────────────

export const getRegions = unstable_cache(async (): Promise<Region[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.REGIONS, [Query.limit(10)]);
    return res.documents.map((d) => toRegion(d as unknown as Record<string, unknown>));
  } catch { return []; }
}, ['regions'], { revalidate: 300, tags: ['regions'] });

// ─── GALLERIES ──────────────────────────────────────────────────────────────

export const getGalleryImages = unstable_cache(async (parentId?: string): Promise<GalleryImage[]> => {
  try {
    const queries = parentId
      ? [Query.equal('parentId', parentId), Query.orderAsc('order'), Query.limit(50)]
      : [Query.orderDesc('$createdAt'), Query.limit(20)];
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.GALLERIES, queries);
    return res.documents.map((d) => ({
      src: (d as Record<string, unknown>).url as string || '',
      alt: (d as Record<string, unknown>).alt as string || '',
      caption: (d as Record<string, unknown>).caption as string | undefined,
    }));
  } catch { return []; }
}, ['gallery-images'], { revalidate: 60, tags: ['galleries'] });

// ─── ITINERARIES ────────────────────────────────────────────────────────────

function toItinerary(doc: Record<string, unknown>): import('@/types').Itinerary {
  return {
    id: doc.$id as string,
    slug: doc.slug as string,
    title: doc.title as string,
    duration: doc.duration as string,
    category: doc.category as import('@/types').Itinerary['category'],
    summary: doc.summary as string,
    heroImage: (doc.heroImage as string) || '',
    days: parseJson(doc.days as string, []),
    district: doc.district as 'Banswara' | 'Dungarpur',
    season: (doc.season as string) || '',
    seo: { title: (doc.seoTitle as string) || `${doc.title} | VisitVagad`, description: (doc.seoDescription as string) || (doc.summary as string) },
    featured: (doc.featured as boolean) || false,
  };
}

export const getPublishedItineraries = unstable_cache(async (): Promise<import('@/types').Itinerary[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.ITINERARIES, [
      Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(50),
    ]);
    return res.documents.map((d) => toItinerary(d as unknown as Record<string, unknown>));
  } catch { return []; }
}, ['itineraries-published'], { revalidate: 60, tags: ['itineraries'] });

export const getItineraryBySlug = unstable_cache(async (slug: string): Promise<import('@/types').Itinerary | null> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.ITINERARIES, [
      Query.equal('slug', slug), Query.equal('status', 'published'), Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return toItinerary(res.documents[0] as unknown as Record<string, unknown>);
  } catch { return null; }
}, ['itinerary-by-slug'], { revalidate: 60, tags: ['itineraries'] });

// ─── STAYS ──────────────────────────────────────────────────────────────────

function toStay(doc: Record<string, unknown>): import('@/types').Stay {
  return {
    id: doc.$id as string,
    slug: doc.slug as string,
    name: doc.name as string,
    type: doc.type as import('@/types').Stay['type'],
    description: doc.description as string,
    image: (doc.image as string) || '',
    district: doc.district as 'Banswara' | 'Dungarpur',
    location: doc.location as string,
    priceRange: (doc.priceRange as string) || '',
    amenities: parseJson(doc.amenities as string, []),
    contact: (doc.contact as string) || '',
    nearbyAttractions: parseJson(doc.nearbyAttractions as string, []),
  };
}

export const getPublishedStays = unstable_cache(async (): Promise<import('@/types').Stay[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.STAYS, [
      Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(50),
    ]);
    return res.documents.map((d) => toStay(d as unknown as Record<string, unknown>));
  } catch { return []; }
}, ['stays-published'], { revalidate: 60, tags: ['stays'] });

export const getStayBySlug = unstable_cache(async (slug: string): Promise<import('@/types').Stay | null> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.STAYS, [
      Query.equal('slug', slug), Query.equal('status', 'published'), Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return toStay(res.documents[0] as unknown as Record<string, unknown>);
  } catch { return null; }
}, ['stay-by-slug'], { revalidate: 60, tags: ['stays'] });

// ─── GUIDES ─────────────────────────────────────────────────────────────────

function toGuide(doc: Record<string, unknown>): import('@/types').Guide {
  return {
    id: doc.$id as string,
    slug: doc.slug as string,
    name: doc.name as string,
    specialty: doc.specialty as import('@/types').Guide['specialty'],
    district: doc.district as 'Banswara' | 'Dungarpur',
    languages: doc.languages as string,
    bio: doc.bio as string,
    image: (doc.image as string) || '',
    experience: (doc.experience as string) || '',
    contact: (doc.contact as string) || '',
  };
}

export const getPublishedGuides = unstable_cache(async (): Promise<import('@/types').Guide[]> => {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.GUIDES, [
      Query.equal('status', 'published'), Query.orderDesc('$createdAt'), Query.limit(50),
    ]);
    return res.documents.map((d) => toGuide(d as unknown as Record<string, unknown>));
  } catch { return []; }
}, ['guides-published'], { revalidate: 60, tags: ['guides'] });

// ─── SEARCH ─────────────────────────────────────────────────────────────────

export async function searchAll(query: string): Promise<{ destinations: Destination[]; events: Event[]; itineraries: import('@/types').Itinerary[] }> {
  if (!query || query.length < 2) return { destinations: [], events: [], itineraries: [] };
  try {
    const [dests, evts, itin] = await Promise.all([
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.search('title', query), Query.equal('status', 'published'), Query.limit(5)]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.search('title', query), Query.equal('status', 'published'), Query.limit(5)]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.ITINERARIES, [Query.search('title', query), Query.equal('status', 'published'), Query.limit(5)]),
    ]);
    return {
      destinations: dests.documents.map((d) => toDestination(d as unknown as DestinationDoc)),
      events: evts.documents.map((d) => toEvent(d as unknown as EventDoc)),
      itineraries: itin.documents.map((d) => toItinerary(d as unknown as Record<string, unknown>)),
    };
  } catch { return { destinations: [], events: [], itineraries: [] }; }
}
