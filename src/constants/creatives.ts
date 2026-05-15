/**
 * Instagram & promotional creative assets configuration.
 * These are separate from destination galleries — used for CTAs, banners, campaigns.
 *
 * Paths are relative to ImageKit URL endpoint.
 * When IMAGEKIT_URL is set, these resolve to optimized CDN URLs.
 */

export interface PromoCreative {
  /** ImageKit path or full URL */
  src: string;
  alt: string;
  /** Where this creative is used */
  placement: 'cta' | 'banner' | 'seasonal' | 'social-preview' | 'campaign';
  /** Optional campaign/season tag */
  tag?: string;
}

/**
 * Promotional creatives from ImageKit.
 * Update these paths when new Instagram/social assets are uploaded.
 */
export const PROMO_CREATIVES: PromoCreative[] = [
  { src: '/instagram/cta-explore-vagad.jpg', alt: 'Explore Vagad — tourism campaign', placement: 'cta', tag: 'evergreen' },
  { src: '/instagram/banner-heritage-trail.jpg', alt: 'Heritage Trail campaign banner', placement: 'banner', tag: 'heritage' },
  { src: '/instagram/seasonal-monsoon.jpg', alt: 'Monsoon season in Vagad', placement: 'seasonal', tag: 'monsoon' },
  { src: '/instagram/seasonal-winter.jpg', alt: 'Winter tourism in Vagad', placement: 'seasonal', tag: 'winter' },
  { src: '/instagram/social-preview-vagad.jpg', alt: 'VisitVagad social media preview', placement: 'social-preview' },
  { src: '/instagram/campaign-tribal-culture.jpg', alt: 'Tribal culture campaign', placement: 'campaign', tag: 'tribal' },
];

/** Get creatives by placement type */
export function getCreativesByPlacement(placement: PromoCreative['placement']): PromoCreative[] {
  return PROMO_CREATIVES.filter((c) => c.placement === placement);
}

/** Get a single creative for a placement (first match) */
export function getCreative(placement: PromoCreative['placement'], tag?: string): PromoCreative | undefined {
  if (tag) return PROMO_CREATIVES.find((c) => c.placement === placement && c.tag === tag);
  return PROMO_CREATIVES.find((c) => c.placement === placement);
}
