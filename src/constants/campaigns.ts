/**
 * Seasonal Campaigns — Curated tourism collections for VisitVagad
 * Static campaign definitions that can be extended via CMS later.
 */

export interface SeasonalCampaign {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  season: string;
  heroImage: string;
  /** Destination slugs to feature */
  destinations: string[];
  /** Itinerary slugs to feature */
  itineraries: string[];
  /** Tags for filtering */
  tags: string[];
  active: boolean;
}

export const SEASONAL_CAMPAIGNS: SeasonalCampaign[] = [
  {
    slug: 'monsoon-in-vagad',
    title: 'Monsoon in Vagad',
    subtitle: 'When the land comes alive',
    description: 'Experience the Vagad region transformed by monsoon rains — cascading waterfalls, lush green hills, overflowing lakes, and the earthy fragrance of tribal villages.',
    season: 'Jul – Sep',
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
    destinations: ['mahi-dam', 'kagdi-pick-up-weir', 'gaib-sagar-lake'],
    itineraries: [],
    tags: ['monsoon', 'nature', 'waterfalls', 'photography'],
    active: true,
  },
  {
    slug: 'festival-season',
    title: 'Festival Season',
    subtitle: 'Celebrate with the tribes',
    description: 'Join the vibrant tribal festivals of Vagad — from the sacred Beneshwar Fair to Ghoomar dance celebrations. Witness centuries-old traditions come alive.',
    season: 'Oct – Mar',
    heroImage: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=1920&q=80',
    destinations: ['beneshwar-dham', 'mangarh-hill'],
    itineraries: [],
    tags: ['festivals', 'culture', 'tribal', 'heritage'],
    active: true,
  },
  {
    slug: 'weekend-escapes',
    title: 'Weekend Escapes',
    subtitle: '48 hours of discovery',
    description: 'Perfect two-day itineraries for exploring Vagad — heritage palaces, serene lakes, ancient temples, and authentic tribal cuisine.',
    season: 'Year-round',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    destinations: ['juna-mahal', 'udai-bilas-palace', 'arthuna-temples'],
    itineraries: [],
    tags: ['weekend', 'short-trip', 'heritage', 'relaxation'],
    active: true,
  },
  {
    slug: 'spiritual-trails',
    title: 'Spiritual Trails',
    subtitle: 'Sacred journeys of Vagad',
    description: 'Follow ancient pilgrimage routes through sacred temples, holy confluences, and spiritual sites that have drawn devotees for centuries.',
    season: 'Oct – Feb',
    heroImage: 'https://images.unsplash.com/photo-1564804955013-e02ad9516982?w=1920&q=80',
    destinations: ['tripura-sundari-temple', 'beneshwar-dham', 'arthuna-temples'],
    itineraries: [],
    tags: ['spiritual', 'temples', 'pilgrimage', 'sacred'],
    active: true,
  },
  {
    slug: 'photography-routes',
    title: 'Photography Routes',
    subtitle: 'Frame the untold',
    description: 'Curated routes for photographers — golden hour at ancient forts, misty mornings over lakes, vibrant tribal markets, and dramatic monsoon landscapes.',
    season: 'Year-round',
    heroImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920&q=80',
    destinations: ['juna-mahal', 'gaib-sagar-lake', 'mangarh-hill'],
    itineraries: [],
    tags: ['photography', 'landscape', 'heritage', 'nature'],
    active: true,
  },
];

export function getCampaignBySlug(slug: string): SeasonalCampaign | undefined {
  return SEASONAL_CAMPAIGNS.find(c => c.slug === slug);
}

export function getActiveCampaigns(): SeasonalCampaign[] {
  return SEASONAL_CAMPAIGNS.filter(c => c.active);
}
