/** Core tourism data schemas for VisitVagad */

export interface SeoMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface NearbyPlace {
  slug: string;
  title: string;
  distance: string;
  image: string;
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'adventure' | 'culture' | 'nature' | 'spiritual' | 'food';
}

export interface Destination {
  slug: string;
  title: string;
  district: 'Banswara' | 'Dungarpur';
  heroImage: string;
  summary: string;
  story: string;
  highlights: Highlight[];
  gallery: GalleryImage[];
  experiences: string[];
  bestTime: string;
  coordinates: Coordinates;
  nearbyPlaces: NearbyPlace[];
  seo: SeoMeta;
  featured: boolean;
}

export interface Event {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  endDate?: string;
  location: string;
  district: 'Banswara' | 'Dungarpur';
  category: 'festival' | 'fair' | 'cultural' | 'religious';
  seo: SeoMeta;
}

export interface FoodItem {
  slug: string;
  title: string;
  description: string;
  image: string;
  origin: string;
  type: 'dish' | 'sweet' | 'beverage' | 'snack';
  seo: SeoMeta;
}

export interface Region {
  id: string;
  name: string;
  tagline: string;
  image: string;
  destinationCount: number;
}

/** Itinerary day stop */
export interface ItineraryStop {
  destination: string; // slug
  time: string;
  note: string;
}

/** Itinerary day */
export interface ItineraryDay {
  day: number;
  title: string;
  stops: ItineraryStop[];
}

/** Itinerary */
export interface Itinerary {
  id: string;
  slug: string;
  title: string;
  duration: string;
  category: 'day-trip' | 'weekend' | 'pilgrimage' | 'eco' | 'photography' | 'cultural';
  summary: string;
  heroImage: string;
  days: ItineraryDay[];
  district: 'Banswara' | 'Dungarpur';
  season: string;
  seo: SeoMeta;
  featured: boolean;
}

/** Stay */
export interface Stay {
  id: string;
  slug: string;
  name: string;
  type: 'hotel' | 'guesthouse' | 'eco-stay' | 'heritage' | 'homestay';
  description: string;
  image: string;
  district: 'Banswara' | 'Dungarpur';
  location: string;
  priceRange: string;
  amenities: string[];
  contact: string;
  nearbyAttractions: string[];
}

/** Local Guide */
export interface Guide {
  id: string;
  slug: string;
  name: string;
  specialty: 'heritage' | 'nature' | 'tribal' | 'photography' | 'spiritual';
  district: 'Banswara' | 'Dungarpur';
  languages: string;
  bio: string;
  image: string;
  experience: string;
  contact: string;
}
