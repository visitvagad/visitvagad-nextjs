/**
 * SEO-Optimized Content Seed Script
 * Updates all existing content with high-quality images and full SEO fields.
 * Run: npx tsx scripts/seed-seo-content.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Client, Databases, Query } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS } from '../src/lib/appwrite-schema';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);
const db = new Databases(client);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── CURATED UNSPLASH IMAGES ────────────────────────────────────────────────
// High-quality, relevant images for each content type

const DESTINATION_IMAGES: Record<string, { hero: string; gallery: string[]; og: string }> = {
  'mangarh-hill': {
    hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&q=85',
  },
  'beneshwar-dham': {
    hero: 'https://images.unsplash.com/photo-1545126178-862cdb469856?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
      'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1545126178-862cdb469856?w=1200&h=630&fit=crop&q=85',
  },
  'gaib-sagar-lake': {
    hero: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1200&h=630&fit=crop&q=85',
  },
  'kagdi-pick-up-weir': {
    hero: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=800&q=80',
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=1200&h=630&fit=crop&q=85',
  },
  'mahi-dam': {
    hero: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=630&fit=crop&q=85',
  },
  'arthuna-temples': {
    hero: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=630&fit=crop&q=85',
  },
  'udai-bilas-palace': {
    hero: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=630&fit=crop&q=85',
  },
  'tripura-sundari-temple': {
    hero: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1f?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80',
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1f?w=1200&h=630&fit=crop&q=85',
  },
  'juna-mahal': {
    hero: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&h=630&fit=crop&q=85',
  },
  'anand-sagar-lake': {
    hero: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    ],
    og: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=630&fit=crop&q=85',
  },
};

const EVENT_IMAGES: Record<string, string> = {
  'beneshwar-fair': 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=1200&q=80',
  'baneshwar-mahotsav': 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&q=80',
  'vagad-festival': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
  'ghoomar-dance-festival': 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&q=80',
  'tribal-art-fair': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80',
  'mahi-monsoon-festival': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
  'temple-heritage-walk': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
};

const FOOD_IMAGES: Record<string, string> = {
  'dal-baati-churma': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80',
  'mahua-ladoo': 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=1200&q=80',
  'ker-sangri': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200&q=80',
  'chaach': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80',
  'amla-murabba': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80',
  'tribal-smoked-fish': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  'rabdi': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80',
  'makki-ki-roti': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80',
};

const EXPERIENCE_IMAGES: Record<string, string> = {
  'Tribal Heritage Walk': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
  'Eco Tour': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
  'Boating': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
  'Temple Trail': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
  'Food Trail': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200&q=80',
  'Trekking': 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80',
  'Photography Tour': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80',
  'Cultural Immersion': 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&q=80',
  'Mahi River Boating': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
  'Eco Nature Trail': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
  'Waterfall Exploration': 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=1200&q=80',
  'Tribal Food Trail': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80',
  'Sunrise Trekking': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
};


// ─── DESTINATION SEO ENRICHMENT DATA ────────────────────────────────────────

const DESTINATION_SEO: Record<string, {
  highlights: string;
  gallery: string;
  seoKeywords: string;
  seoOgImage: string;
}> = {
  'mangarh-hill': {
    highlights: JSON.stringify([
      { icon: '🏔️', title: 'National Monument', description: 'Declared national monument in 2022 honoring 1,500 Bhil martyrs' },
      { icon: '🌅', title: 'Panoramic Views', description: '360° views of the Vagad landscape from the hilltop memorial' },
      { icon: '📜', title: 'Freedom History', description: 'Site of the 1913 Bhil uprising — India\'s first tribal freedom movement' },
      { icon: '🚶', title: 'Hilltop Trek', description: 'Moderate 2km trek through scrubland to the summit memorial' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', alt: 'Mangarh Hill panoramic landscape view at sunrise' },
      { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', alt: 'Hilltop memorial monument at Mangarh' },
      { src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80', alt: 'Trekking trail to Mangarh Hill summit' },
    ]),
    seoKeywords: 'Mangarh Hill, Mangarh Dham, Bhil freedom fighters, Govind Guru, tribal uprising 1913, Banswara tourism, national monument Rajasthan, places to visit Banswara, Adivasi Jallianwala',
    seoOgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&q=85',
  },
  'beneshwar-dham': {
    highlights: JSON.stringify([
      { icon: '🕉️', title: 'Triveni Sangam', description: 'Sacred confluence of Som, Mahi, and Jakham rivers' },
      { icon: '🎪', title: 'Largest Tribal Fair', description: 'Over 1 million devotees gather during Magh Purnima' },
      { icon: '🛕', title: 'Ancient Shiva Temple', description: 'Self-manifested (swayambhu) lingam on a river island' },
      { icon: '🎶', title: 'Cultural Performances', description: 'Traditional Bhil music, Ghoomar dance during the fair' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', alt: 'Beneshwar Dham temple at the river confluence' },
      { src: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80', alt: 'Devotees at the sacred triveni sangam during Beneshwar Fair' },
      { src: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', alt: 'Aerial view of the river island temple complex' },
    ]),
    seoKeywords: 'Beneshwar Dham, Beneshwar Fair, triveni sangam Dungarpur, tribal fair Rajasthan, Mahi river confluence, Shiva temple Dungarpur, places to visit Dungarpur, Kumbh of Vagad',
    seoOgImage: 'https://images.unsplash.com/photo-1545126178-862cdb469856?w=1200&h=630&fit=crop&q=85',
  },
  'gaib-sagar-lake': {
    highlights: JSON.stringify([
      { icon: '🏰', title: 'Badal Mahal', description: 'Cloud Palace rising from the lake in grey-blue pareva stone' },
      { icon: '🐦', title: 'Birdwatching', description: 'Winter home to flamingos, painted storks, and cormorants' },
      { icon: '🌅', title: 'Golden Sunsets', description: 'Spectacular reflections of heritage skyline at golden hour' },
      { icon: '🛕', title: 'Lakeside Temples', description: 'Ancient temples and royal cenotaphs lining the ghats' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', alt: 'Gaib Sagar Lake sunset with Badal Mahal reflection' },
      { src: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80', alt: 'Heritage temples along Gaib Sagar Lake ghats' },
      { src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80', alt: 'Migratory birds at Gaib Sagar Lake in winter' },
    ]),
    seoKeywords: 'Gaib Sagar Lake, Dungarpur lake, Badal Mahal palace, birdwatching Rajasthan, sunset Dungarpur, heritage lake, places to visit Dungarpur, Vagad tourism',
    seoOgImage: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1200&h=630&fit=crop&q=85',
  },
  'kagdi-pick-up-weir': {
    highlights: JSON.stringify([
      { icon: '💧', title: 'Monsoon Waterfall', description: 'Spectacular overflow creating a curtain of cascading water' },
      { icon: '🌿', title: 'Lush Greenery', description: 'Rocky landscape transforms into green paradise in monsoon' },
      { icon: '📸', title: 'Photography Spot', description: 'Rainbows and mist create stunning natural backdrops' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=800&q=80', alt: 'Kagdi Weir waterfall during monsoon overflow' },
      { src: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80', alt: 'Lush green surroundings at Kagdi Pick Up Weir' },
    ]),
    seoKeywords: 'Kagdi Pick Up Weir, Dungarpur waterfall, monsoon Rajasthan, waterfall near Dungarpur, picnic spot Dungarpur, monsoon tourism Vagad',
    seoOgImage: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=1200&h=630&fit=crop&q=85',
  },
  'mahi-dam': {
    highlights: JSON.stringify([
      { icon: '🏝️', title: 'Hundred Islands', description: 'Over 100 islands dot the vast reservoir — unique in India' },
      { icon: '🚣', title: 'Island Boating', description: 'Boat rides through island-studded waters with local fishermen' },
      { icon: '🌄', title: 'Sunset Point', description: 'Breathtaking panoramic views over the dam at golden hour' },
      { icon: '🎣', title: 'Fishing', description: 'Traditional fishing with local Bhil communities' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', alt: 'Mahi Bajaj Sagar Dam panoramic view with islands' },
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', alt: 'Boating through the hundred islands of Mahi Dam' },
      { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', alt: 'Sunset over Mahi Dam reservoir in Banswara' },
    ]),
    seoKeywords: 'Mahi Dam, Mahi Bajaj Sagar, Banswara hundred islands, City of Hundred Islands, boating Banswara, largest earthen dam India, places to visit Banswara, Rajasthan lakes',
    seoOgImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=630&fit=crop&q=85',
  },
  'arthuna-temples': {
    highlights: JSON.stringify([
      { icon: '🛕', title: 'Mandakini Temple', description: '11th-century Shiva temple with towering shikhara' },
      { icon: '🎨', title: 'Paramara Carvings', description: 'Exquisite stone sculptures of deities and celestial beings' },
      { icon: '📿', title: 'Jain Heritage', description: 'Ancient Jain temples with intricate relief panels' },
      { icon: '🏛️', title: 'ASI Protected', description: 'Archaeological Survey of India maintained heritage site' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', alt: 'Arthuna temple stone carvings from 11th century' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', alt: 'Mandakini Temple shikhara at Arthuna' },
      { src: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=80', alt: 'Detailed Paramara-era sculptural panels' },
    ]),
    seoKeywords: 'Arthuna Temples, Paramara dynasty temples, Khajuraho of Rajasthan, ancient temples Banswara, 11th century temples, stone carvings Rajasthan, ASI monuments Vagad',
    seoOgImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=630&fit=crop&q=85',
  },
  'udai-bilas-palace': {
    highlights: JSON.stringify([
      { icon: '🏛️', title: 'Pareva Stone', description: 'Unique grey-blue stone architecture found nowhere else in India' },
      { icon: '🎨', title: 'Miniature Paintings', description: 'Rare collection of Vagad school miniature art' },
      { icon: '👑', title: 'Heritage Hotel', description: 'Stay in restored royal palace rooms with lake views' },
      { icon: '🌊', title: 'Lakeside Setting', description: 'Palace reflects beautifully in Gaib Sagar at sunset' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', alt: 'Udai Bilas Palace facade with pareva stone carvings' },
      { src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80', alt: 'Palace interior with miniature paintings and jharokhas' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', alt: 'Udai Bilas Palace reflection in Gaib Sagar Lake' },
    ]),
    seoKeywords: 'Udai Bilas Palace, Dungarpur heritage hotel, pareva stone architecture, Rajput palace Rajasthan, heritage stay Dungarpur, royal palace Vagad, luxury heritage hotel',
    seoOgImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=630&fit=crop&q=85',
  },
  'tripura-sundari-temple': {
    highlights: JSON.stringify([
      { icon: '🙏', title: 'Shakti Peetha', description: 'One of 51 sacred Shakti Peethas recognized across India' },
      { icon: '🏔️', title: 'Hilltop Temple', description: 'Forested hill setting with panoramic views' },
      { icon: '🎆', title: 'Navratri Festival', description: 'Massive celebrations during the nine nights of Navratri' },
      { icon: '🌳', title: 'Forest Trail', description: 'Scenic trek through dense forest to reach the temple' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80', alt: 'Tripura Sundari Temple entrance with devotees' },
      { src: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', alt: 'Hilltop view from Tripura Sundari Temple' },
    ]),
    seoKeywords: 'Tripura Sundari Temple, Shakti Peetha Banswara, 51 Shakti Peethas, Navratri Banswara, goddess temple Rajasthan, pilgrimage Vagad, spiritual tourism Banswara',
    seoOgImage: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1f?w=1200&h=630&fit=crop&q=85',
  },
  'juna-mahal': {
    highlights: JSON.stringify([
      { icon: '🖼️', title: 'Original Frescoes', description: '700-year-old paintings in pristine condition across seven floors' },
      { icon: '✨', title: 'Mirror & Glass Work', description: 'Kaleidoscopic interiors with intricate mirror inlay' },
      { icon: '🏰', title: 'Seven Stories', description: 'Medieval fortress with hidden chambers and defensive corridors' },
      { icon: '🔒', title: 'Exclusive Access', description: 'Limited visits with permission from the royal family' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', alt: 'Juna Mahal exterior fortress walls in Dungarpur' },
      { src: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=80', alt: 'Original 13th-century frescoes inside Juna Mahal' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', alt: 'Mirror work and glass inlay in Juna Mahal chambers' },
    ]),
    seoKeywords: 'Juna Mahal, Dungarpur old palace, 13th century palace, medieval frescoes Rajasthan, mirror work palace, best preserved palace India, heritage Dungarpur, Vagad royal architecture',
    seoOgImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&h=630&fit=crop&q=85',
  },
  'anand-sagar-lake': {
    highlights: JSON.stringify([
      { icon: '⛲', title: 'Musical Fountains', description: 'Evening light and sound show with synchronized fountains' },
      { icon: '🛕', title: 'Island Temple', description: 'Shiva temple on a lake island connected by scenic bridge' },
      { icon: '🌺', title: 'Landscaped Gardens', description: 'Lush gardens with native plants and walking trails' },
    ]),
    gallery: JSON.stringify([
      { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', alt: 'Anand Sagar Lake with island temple in Banswara' },
      { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', alt: 'Gardens and walking paths around Anand Sagar' },
    ]),
    seoKeywords: 'Anand Sagar Lake, Banswara lake garden, musical fountain Banswara, island temple, things to do Banswara, family outing Rajasthan, Banswara tourism',
    seoOgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=630&fit=crop&q=85',
  },
};


// ─── UPDATE FUNCTIONS ───────────────────────────────────────────────────────

async function updateDestinations() {
  console.log('\n🏛️  Updating destinations with images + SEO...\n');
  const { documents } = await db.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(25)]);

  // First, detect which attributes exist by checking the first doc's keys
  const sampleDoc = documents[0];
  const existingKeys = new Set(Object.keys(sampleDoc || {}));
  console.log(`  ℹ Detected attributes: heroImage=${existingKeys.has('heroImage')}, highlights=${existingKeys.has('highlights')}, gallery=${existingKeys.has('gallery')}, seoKeywords=${existingKeys.has('seoKeywords')}, seoOgImage=${existingKeys.has('seoOgImage')}\n`);

  for (const doc of documents) {
    const slug = doc.slug as string;
    const images = DESTINATION_IMAGES[slug];
    const seo = DESTINATION_SEO[slug];
    if (!images && !seo) { console.log(`  ⊘ ${slug} — no data mapped`); continue; }

    const update: Record<string, any> = {};
    if (images && existingKeys.has('heroImage')) update.heroImage = images.hero;
    if (seo && existingKeys.has('highlights')) update.highlights = seo.highlights;
    if (seo && existingKeys.has('gallery')) update.gallery = seo.gallery;
    if (seo && existingKeys.has('seoKeywords')) update.seoKeywords = seo.seoKeywords;
    if (seo && existingKeys.has('seoOgImage')) update.seoOgImage = seo.seoOgImage;

    if (Object.keys(update).length === 0) {
      console.log(`  ⊘ ${slug} — no updatable attributes found in collection`);
      continue;
    }

    try {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.DESTINATIONS, doc.$id, update);
      console.log(`  ✓ ${slug} — updated: ${Object.keys(update).join(', ')}`);
    } catch (e: any) {
      // If highlights/gallery/etc don't exist, retry with just heroImage
      if (e?.message?.includes('Unknown attribute')) {
        const fallback: Record<string, any> = {};
        if (images) fallback.heroImage = images.hero;
        if (seo && existingKeys.has('seoOgImage')) fallback.seoOgImage = seo.seoOgImage;
        try {
          await db.updateDocument(DATABASE_ID, COLLECTIONS.DESTINATIONS, doc.$id, fallback);
          console.log(`  ⚠ ${slug} — partial update (heroImage only, missing attributes in collection)`);
        } catch (e2: any) {
          console.log(`  ✗ ${slug}: ${e2?.message}`);
        }
      } else {
        console.log(`  ✗ ${slug}: ${e?.message}`);
      }
    }
    await sleep(300);
  }
}

async function updateEvents() {
  console.log('\n🎪 Updating events with images...\n');
  const { documents } = await db.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(25)]);

  for (const doc of documents) {
    const slug = doc.slug as string;
    const image = EVENT_IMAGES[slug];
    if (!image) { console.log(`  ⊘ ${slug} — no image mapped`); continue; }

    try {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.EVENTS, doc.$id, { image });
      console.log(`  ✓ ${slug}`);
    } catch (e: any) {
      console.log(`  ✗ ${slug}: ${e?.message}`);
    }
    await sleep(300);
  }
}

async function updateFood() {
  console.log('\n🍛 Updating food with images...\n');
  const { documents } = await db.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [Query.limit(25)]);

  for (const doc of documents) {
    const slug = doc.slug as string;
    const image = FOOD_IMAGES[slug];
    if (!image) { console.log(`  ⊘ ${slug} — no image mapped`); continue; }

    try {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.FOOD, doc.$id, { image });
      console.log(`  ✓ ${slug}`);
    } catch (e: any) {
      console.log(`  ✗ ${slug}: ${e?.message}`);
    }
    await sleep(300);
  }
}

async function updateExperiences() {
  console.log('\n🎯 Updating experiences with images...\n');
  const { documents } = await db.listDocuments(DATABASE_ID, COLLECTIONS.EXPERIENCES, [Query.limit(25)]);

  for (const doc of documents) {
    const title = doc.title as string;
    const image = EXPERIENCE_IMAGES[title];
    if (!image) { console.log(`  ⊘ ${title} — no image mapped`); continue; }

    try {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.EXPERIENCES, doc.$id, { image });
      console.log(`  ✓ ${title}`);
    } catch (e: any) {
      console.log(`  ✗ ${title}: ${e?.message}`);
    }
    await sleep(300);
  }
}

async function updateRegions() {
  console.log('\n🗺️  Updating regions with images...\n');
  const { documents } = await db.listDocuments(DATABASE_ID, COLLECTIONS.REGIONS, [Query.limit(5)]);

  const regionImages: Record<string, string> = {
    'Banswara': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    'Dungarpur': 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=1200&q=80',
  };

  for (const doc of documents) {
    const name = doc.name as string;
    const image = regionImages[name];
    if (!image) continue;

    try {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.REGIONS, doc.$id, { image });
      console.log(`  ✓ ${name}`);
    } catch (e: any) {
      console.log(`  ✗ ${name}: ${e?.message}`);
    }
    await sleep(300);
  }
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 SEO Content Enrichment Script');
  console.log('================================\n');
  console.log('This will update ALL existing content with:');
  console.log('  • High-quality Unsplash hero images');
  console.log('  • Gallery images with SEO alt text');
  console.log('  • SEO keywords for Google ranking');
  console.log('  • OG images for social sharing');
  console.log('  • Highlights with structured data\n');

  await updateDestinations();
  await updateEvents();
  await updateFood();
  await updateExperiences();
  await updateRegions();

  console.log('\n✅ All content updated with images + SEO data!');
  console.log('📊 Next steps:');
  console.log('   1. Deploy to Vercel (git push)');
  console.log('   2. Request re-indexing in Google Search Console');
  console.log('   3. Share pages on social media to trigger OG image caching');
}

main().catch(err => {
  console.error('❌ Script failed:', err.message);
  process.exit(1);
});
