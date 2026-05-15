/**
 * Image utilities for VisitVagad
 * Provides fallback images, responsive sizing, and ImageKit-optimized delivery.
 */
import { imagePresets } from './imagekit';

// Curated fallback images (used when DB has no image and ImageKit has no match)
export const PLACEHOLDER_IMAGES = {
  // Destinations
  'mangarh-hill': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  'beneshwar-dham': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
  'gaib-sagar-lake': 'https://images.unsplash.com/photo-1583309219338-a582f1f9ca6b?w=1200&q=80',
  'kagdi-pick-up-weir': 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=1200&q=80',
  'mahi-dam': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
  'arthuna-temples': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
  'tripura-sundari-temple': 'https://images.unsplash.com/photo-1564804955013-e02ad9516982?w=1200&q=80',
  'juna-mahal': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
  'udai-bilas-palace': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
  'anand-sagar-lake': 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=80',

  // Events
  'beneshwar-fair': 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=1200&q=80',
  'vagad-festival': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=80',
  'tribal-art-fair': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1200&q=80',
  'ghoomar-dance-festival': 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200&q=80',
  'mahi-monsoon-festival': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
  'temple-heritage-walk': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',

  // Food
  'dal-baati-churma': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80',
  'mahua-ladoo': 'https://images.unsplash.com/photo-1666190020955-5c3a4b1c6c8e?w=800&q=80',
  'ker-sangri': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
  'chaach': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
  'rabdi': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
  'tribal-smoked-fish': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'makki-ki-roti': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
  'amla-murabba': 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=800&q=80',

  // Experiences
  'tribal-heritage-walk': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
  'mahi-river-boating': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  'temple-trail': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
  'photography-tour': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80',
  'eco-nature-trail': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
  'waterfall-exploration': 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=1200&q=80',
  'tribal-food-trail': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  'sunrise-trekking': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  'eco-tour': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
  'boating': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  'food-trail': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  'trekking': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  'cultural-immersion': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',

  // Regions
  'banswara': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
  'dungarpur': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',

  // Generic fallbacks
  hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  cta: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
  culture: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1200&q=80',
  fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
} as const;

/** Get image URL with fallback */
export function getImageUrl(slug: string | undefined, fallbackKey: keyof typeof PLACEHOLDER_IMAGES = 'fallback'): string {
  if (!slug) return PLACEHOLDER_IMAGES[fallbackKey];
  return PLACEHOLDER_IMAGES[slug as keyof typeof PLACEHOLDER_IMAGES] || PLACEHOLDER_IMAGES[fallbackKey];
}

/**
 * Get optimized image URL — applies ImageKit transforms if the source is an ImageKit URL,
 * otherwise returns the URL as-is. Use this for rendering DB-sourced images.
 */
export function getOptimizedUrl(
  imageUrl: string | undefined | null,
  preset: keyof typeof imagePresets = 'card',
  fallbackKey: keyof typeof PLACEHOLDER_IMAGES = 'fallback'
): string {
  if (!imageUrl) return PLACEHOLDER_IMAGES[fallbackKey];
  if (imageUrl.includes('imagekit.io') || imageUrl.includes('ik.imagekit.io')) {
    return imagePresets[preset](imageUrl);
  }
  return imageUrl;
}

/** Get responsive image sizes string for Next.js Image */
export function getImageSizes(variant: 'hero' | 'card' | 'thumbnail' | 'full'): string {
  switch (variant) {
    case 'hero': return '100vw';
    case 'card': return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'thumbnail': return '(max-width: 640px) 25vw, 128px';
    case 'full': return '100vw';
  }
}
