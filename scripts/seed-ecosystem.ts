/**
 * Seed itineraries, stays, and guides into Appwrite.
 * Run: npx tsx scripts/seed-ecosystem.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Client, Databases, ID, Query } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS } from '../src/lib/appwrite-schema';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);
const db = new Databases(client);

const ITINERARIES = [
  {
    title: 'Sacred Rivers & Temples Weekend',
    slug: 'sacred-rivers-temples-weekend',
    duration: '2 days',
    category: 'pilgrimage',
    district: 'Dungarpur',
    season: 'October–March',
    summary: 'A spiritual journey through the sacred confluences and ancient temples of Dungarpur, connecting Beneshwar Dham, Gaib Sagar, and the heritage palaces.',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
    days: JSON.stringify([
      { day: 1, title: 'Sacred Waters', stops: [
        { destination: 'beneshwar-dham', time: '6:00 AM', note: 'Sunrise at the triveni sangam. Watch morning aarti rituals.' },
        { destination: 'gaib-sagar-lake', time: '11:00 AM', note: 'Explore lakeside temples and Badal Mahal.' },
        { destination: 'udai-bilas-palace', time: '4:00 PM', note: 'Heritage walk through pareva stone architecture. Sunset from the lake terrace.' },
      ]},
      { day: 2, title: 'Royal Heritage', stops: [
        { destination: 'juna-mahal', time: '8:00 AM', note: 'Early access to the seven-story fortress. Photography of original frescoes.' },
        { destination: 'gaib-sagar-lake', time: '12:00 PM', note: 'Lunch at lakeside. Birdwatching from the ghats.' },
      ]},
    ]),
    seoTitle: 'Sacred Rivers & Temples Weekend — 2-Day Dungarpur Itinerary',
    seoDescription: 'Plan a spiritual weekend in Dungarpur visiting Beneshwar Dham, Gaib Sagar Lake, and heritage palaces.',
    featured: true,
    status: 'published',
  },
  {
    title: 'Tribal Heritage Day Trip',
    slug: 'tribal-heritage-day-trip',
    duration: '1 day',
    category: 'cultural',
    district: 'Banswara',
    season: 'Year-round',
    summary: 'A single-day immersion into Bhil tribal culture — from the Mangarh Hill memorial to village art workshops and traditional cuisine.',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    days: JSON.stringify([
      { day: 1, title: 'Tribal Immersion', stops: [
        { destination: 'mangarh-hill', time: '6:30 AM', note: 'Sunrise trek to the martyrs memorial. Panoramic views of Vagad.' },
        { destination: 'arthuna-temples', time: '10:00 AM', note: 'Explore 11th-century Paramara-era stone carvings.' },
        { destination: 'tripura-sundari-temple', time: '3:00 PM', note: 'Visit the Shakti Peetha. Evening aarti if timing allows.' },
      ]},
    ]),
    seoTitle: 'Tribal Heritage Day Trip — Banswara Cultural Itinerary',
    seoDescription: 'Explore Bhil tribal heritage in a single day — Mangarh Hill, Arthuna Temples, and Tripura Sundari.',
    featured: true,
    status: 'published',
  },
  {
    title: 'Monsoon Lakes & Waterfalls',
    slug: 'monsoon-lakes-waterfalls',
    duration: '2 days',
    category: 'eco',
    district: 'Banswara',
    season: 'July–September',
    summary: 'Chase monsoon waterfalls and explore the hundred islands of Mahi Dam when the landscape transforms into lush green terrain.',
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    days: JSON.stringify([
      { day: 1, title: 'Waterfall Chase', stops: [
        { destination: 'kagdi-pick-up-weir', time: '7:00 AM', note: 'Monsoon overflow at its peak. Bring waterproof gear for photography.' },
        { destination: 'mahi-dam', time: '11:00 AM', note: 'Boat ride through the islands. Reservoir at full capacity.' },
        { destination: 'anand-sagar-lake', time: '5:00 PM', note: 'Evening musical fountain show. Gardens in full bloom.' },
      ]},
      { day: 2, title: 'Green Trails', stops: [
        { destination: 'mangarh-hill', time: '6:00 AM', note: 'Misty morning trek. Monsoon clouds create dramatic landscapes.' },
        { destination: 'tripura-sundari-temple', time: '10:00 AM', note: 'Forest trail to the hilltop temple through monsoon greenery.' },
      ]},
    ]),
    seoTitle: 'Monsoon Lakes & Waterfalls — 2-Day Eco Itinerary in Banswara',
    seoDescription: 'Experience monsoon magic in Banswara — waterfalls, island-dotted lakes, and lush green trails.',
    featured: false,
    status: 'published',
  },
  {
    title: 'Photography Trail: Light & Stone',
    slug: 'photography-trail-light-stone',
    duration: '3 days',
    category: 'photography',
    district: 'Dungarpur',
    season: 'October–February',
    summary: 'A photographer\'s journey through Vagad\'s most photogenic locations — from ancient frescoes to golden hour lake reflections.',
    heroImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80',
    days: JSON.stringify([
      { day: 1, title: 'Heritage Light', stops: [
        { destination: 'juna-mahal', time: '7:00 AM', note: 'Morning light through stained glass onto 700-year-old frescoes.' },
        { destination: 'gaib-sagar-lake', time: '4:30 PM', note: 'Golden hour reflections. Badal Mahal silhouette shots.' },
      ]},
      { day: 2, title: 'Sacred Geometry', stops: [
        { destination: 'beneshwar-dham', time: '5:30 AM', note: 'Pre-dawn river mist. Devotees at the sangam.' },
        { destination: 'udai-bilas-palace', time: '3:00 PM', note: 'Pareva stone details. Architectural symmetry in afternoon light.' },
      ]},
      { day: 3, title: 'Tribal Portraits', stops: [
        { destination: 'mangarh-hill', time: '5:45 AM', note: 'Sunrise panorama. Memorial in golden light.' },
        { destination: 'arthuna-temples', time: '10:00 AM', note: 'Stone carving details. Play of shadow on ancient sculpture.' },
      ]},
    ]),
    seoTitle: 'Photography Trail — 3-Day Visual Journey Through Vagad',
    seoDescription: 'A photographer\'s guide to Vagad — best light, locations, and timing for heritage and landscape photography.',
    featured: true,
    status: 'published',
  },
];

const STAYS = [
  {
    name: 'Udai Bilas Palace Heritage Hotel',
    slug: 'udai-bilas-palace-hotel',
    type: 'heritage',
    district: 'Dungarpur',
    location: 'Gaib Sagar Lake, Dungarpur',
    description: 'A 19th-century lakeside palace converted into a heritage hotel. Original frescoes, pareva stone architecture, and royal Vagad hospitality. Rooms overlook Gaib Sagar Lake with views of the Badal Mahal at sunset.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
    priceRange: '₹4,000–₹12,000/night',
    amenities: JSON.stringify(['Lake views', 'Heritage rooms', 'Restaurant', 'Garden', 'Cultural evenings', 'Guided tours']),
    contact: '+91 2964 230808',
    nearbyAttractions: JSON.stringify(['gaib-sagar-lake', 'juna-mahal', 'beneshwar-dham']),
    status: 'published',
  },
  {
    name: 'Mahi River Eco Lodge',
    slug: 'mahi-river-eco-lodge',
    type: 'eco-stay',
    district: 'Banswara',
    location: 'Near Mahi Dam, Banswara',
    description: 'Sustainable eco-lodge built with local materials, overlooking the Mahi reservoir. Solar-powered cottages with organic farm-to-table dining. Perfect base for island exploration and birdwatching.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    priceRange: '₹2,500–₹5,000/night',
    amenities: JSON.stringify(['Solar power', 'Organic meals', 'Boating', 'Birdwatching', 'Nature trails', 'Bonfire']),
    contact: '+91 9876543210',
    nearbyAttractions: JSON.stringify(['mahi-dam', 'mangarh-hill', 'tripura-sundari-temple']),
    status: 'published',
  },
  {
    name: 'Vagad Village Homestay',
    slug: 'vagad-village-homestay',
    type: 'homestay',
    district: 'Dungarpur',
    location: 'Sagwara Road, Dungarpur',
    description: 'Authentic tribal homestay experience with a Bhil family. Learn Pithora painting, cook traditional meals, and experience village rhythms. Simple, clean rooms with warm hospitality.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    priceRange: '₹800–₹1,500/night',
    amenities: JSON.stringify(['Home-cooked meals', 'Art workshops', 'Village walks', 'Cultural immersion', 'Tribal music']),
    contact: '+91 9876543211',
    nearbyAttractions: JSON.stringify(['beneshwar-dham', 'gaib-sagar-lake']),
    status: 'published',
  },
  {
    name: 'Hotel Banswara Inn',
    slug: 'hotel-banswara-inn',
    type: 'hotel',
    district: 'Banswara',
    location: 'City Center, Banswara',
    description: 'Modern comfort in the heart of Banswara city. Clean rooms, reliable amenities, and easy access to all major attractions. Ideal for travelers seeking a convenient base.',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=80',
    priceRange: '₹1,200–₹3,000/night',
    amenities: JSON.stringify(['AC rooms', 'Restaurant', 'Parking', 'WiFi', 'Room service', '24hr reception']),
    contact: '+91 2962 242424',
    nearbyAttractions: JSON.stringify(['anand-sagar-lake', 'tripura-sundari-temple', 'mahi-dam']),
    status: 'published',
  },
  {
    name: 'Arthuna Heritage Guest House',
    slug: 'arthuna-heritage-guesthouse',
    type: 'guesthouse',
    district: 'Banswara',
    location: 'Arthuna Village, Banswara',
    description: 'A quiet guest house near the ancient Arthuna temple complex. Run by a local family with deep knowledge of the temple history. Simple rooms, home-cooked Vagad meals, and guided temple walks.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    priceRange: '₹600–₹1,200/night',
    amenities: JSON.stringify(['Home meals', 'Temple guides', 'Quiet location', 'Garden', 'Bicycle rental']),
    contact: '+91 9876543212',
    nearbyAttractions: JSON.stringify(['arthuna-temples', 'mangarh-hill']),
    status: 'published',
  },
];

const GUIDES = [
  {
    name: 'Ramesh Bhil',
    slug: 'ramesh-bhil',
    specialty: 'tribal',
    district: 'Banswara',
    languages: 'Hindi, Vagadi, English (basic)',
    bio: 'Born in a Bhil village near Mangarh Hill, Ramesh has spent 15 years sharing his community\'s heritage with visitors. He leads tribal village walks, explains Pithora art traditions, and shares oral histories of the Bhil resistance movement.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    experience: '15 years',
    contact: '+91 9876543220',
    status: 'published',
  },
  {
    name: 'Priya Sharma',
    slug: 'priya-sharma',
    specialty: 'heritage',
    district: 'Dungarpur',
    languages: 'Hindi, English, French',
    bio: 'Art historian and certified heritage guide specializing in Vagad school architecture and miniature paintings. Priya leads detailed tours of Juna Mahal, Udai Bilas Palace, and the temple complexes of Dungarpur.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    experience: '8 years',
    contact: '+91 9876543221',
    status: 'published',
  },
  {
    name: 'Kailash Meena',
    slug: 'kailash-meena',
    specialty: 'nature',
    district: 'Banswara',
    languages: 'Hindi, Vagadi',
    bio: 'Naturalist and birdwatcher who knows every trail around Mahi Dam and the Aravalli foothills. Kailash identifies medicinal plants, tracks wildlife, and leads monsoon waterfall expeditions.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    experience: '12 years',
    contact: '+91 9876543222',
    status: 'published',
  },
  {
    name: 'Sunita Damor',
    slug: 'sunita-damor',
    specialty: 'spiritual',
    district: 'Dungarpur',
    languages: 'Hindi, Vagadi, Gujarati',
    bio: 'Temple priestess and spiritual guide who leads pilgrimage journeys to Beneshwar Dham, Tripura Sundari, and the sacred river confluences. Sunita explains rituals, mythology, and the living spiritual traditions of Vagad.',
    image: 'https://images.unsplash.com/photo-1564804955013-e02ad9516982?w=800&q=80',
    experience: '20 years',
    contact: '+91 9876543223',
    status: 'published',
  },
];

async function main() {
  console.log('🌱 Seeding tourism ecosystem\n');
  await seedCollection(COLLECTIONS.ITINERARIES, ITINERARIES, 'slug');
  await seedCollection(COLLECTIONS.STAYS, STAYS, 'slug');
  await seedCollection(COLLECTIONS.GUIDES, GUIDES, 'slug');
  console.log('\n✅ Ecosystem seeding complete.');
}

async function seedCollection(collectionId: string, items: Record<string, any>[], dedupeKey: string) {
  console.log(`\n📦 ${collectionId} (${items.length} items):`);
  for (const item of items) {
    try {
      const res = await db.listDocuments(DATABASE_ID, collectionId, [Query.equal(dedupeKey, item[dedupeKey]), Query.limit(1)]);
      if (res.total > 0) { console.log(`  ⊘ "${item[dedupeKey]}" exists`); continue; }
      await db.createDocument(DATABASE_ID, collectionId, ID.unique(), item);
      console.log(`  ✓ "${item[dedupeKey]}"`);
    } catch (e: any) { console.log(`  ✗ "${item[dedupeKey]}": ${e?.message}`); }
    await new Promise(r => setTimeout(r, 200));
  }
}

main().catch(e => { console.error('Failed:', e.message); process.exit(1); });
