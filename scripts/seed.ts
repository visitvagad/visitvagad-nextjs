/**
 * Seed realistic Vagad tourism content into Appwrite.
 * Run: npm run seed
 *
 * Seeds: destinations, events, food, experiences, regions.
 * Safe to re-run — uses slug-based deduplication.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Client, Databases, ID, Query } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS } from '../src/lib/appwrite-schema';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error('✗ Missing env vars. Run: npm run env:check');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const db = new Databases(client);

// ─── DESTINATIONS ───────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    title: 'Mangarh Hill',
    slug: 'mangarh-hill',
    district: 'Banswara',
    summary: 'Sacred hill where 1,500 Bhil freedom fighters were martyred in 1913. A powerful symbol of tribal resistance recognized as a national monument.',
    story: 'Mangarh Hill stands as a testament to the courage of the Bhil community. On November 17, 1913, British forces opened fire on a gathering of over 1,500 tribal people led by Govind Guru, who were peacefully protesting against colonial oppression. Often called the "Adivasi Jallianwala," this site predates the Jallianwala Bagh tragedy by six years. The hill was recognized as a national monument in 2022 by Prime Minister Modi. Today it offers panoramic views of the Vagad landscape and houses a memorial dedicated to the martyrs. The annual Mangarh Dham Shahid Mela draws thousands who pay homage to the sacrifice of their ancestors.',
    bestTime: 'October to March',
    lat: 23.5847,
    lng: 74.1089,
    highlights: JSON.stringify([
      { icon: '🏔️', title: 'Martyrs Memorial', description: 'Monument honoring 1,500 Bhil freedom fighters of 1913' },
      { icon: '🌅', title: 'Panoramic Views', description: 'Sweeping vistas of the Vagad countryside from the summit' },
      { icon: '📜', title: 'National Monument', description: 'Declared national monument in 2022 by the Government of India' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '45 km', image: '' },
      { slug: 'arthuna-temples', title: 'Arthuna Temples', distance: '40 km', image: '' },
      { slug: 'mahi-dam', title: 'Mahi Dam', distance: '35 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['tribal-heritage-walk', 'mangarh-hill-trek', 'photography-tour']),
    seoTitle: 'Mangarh Hill — Tribal Freedom Memorial in Banswara, Rajasthan',
    seoDescription: 'Visit Mangarh Hill, the sacred site of the 1913 Bhil uprising. A national monument honoring 1,500 tribal martyrs in Rajasthan\'s Vagad region.',
    seoKeywords: 'Mangarh Hill, Bhil martyrs, Govind Guru, Banswara, tribal freedom, national monument',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Beneshwar Dham',
    slug: 'beneshwar-dham',
    district: 'Dungarpur',
    summary: 'Sacred island at the confluence of Som, Mahi, and Jakham rivers. Known as the "Kumbh of the Vagad" for its massive annual tribal fair.',
    story: 'Beneshwar Dham is a delta island formed at the sacred confluence (triveni sangam) of the Som, Mahi, and Jakham rivers. The ancient Shiva temple here draws millions during the Beneshwar Fair held on Magh Purnima. This is the largest tribal congregation in Rajasthan, where Bhil, Meena, and Garasia communities gather for worship, trade, and cultural celebration. The fair transforms the riverbanks into a vibrant canvas of tribal art, music, and devotion. Legend holds that the lingam here is swayambhu (self-manifested), making it one of the most sacred Shiva sites in southern Rajasthan. The island remains serene year-round, with the gentle sound of three rivers merging creating a meditative atmosphere.',
    bestTime: 'January to February (during Beneshwar Fair)',
    lat: 23.6167,
    lng: 73.7833,
    highlights: JSON.stringify([
      { icon: '🕉️', title: 'Triveni Sangam', description: 'Sacred confluence of Som, Mahi, and Jakham rivers' },
      { icon: '🎪', title: 'Beneshwar Fair', description: 'Largest tribal fair in Rajasthan with over a million devotees' },
      { icon: '🛕', title: 'Ancient Shiva Temple', description: 'Centuries-old temple with a self-manifested lingam' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '15 km', image: '' },
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '45 km', image: '' },
      { slug: 'udai-bilas-palace', title: 'Udai Bilas Palace', distance: '18 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['tribal-heritage-walk', 'temple-trail', 'cultural-immersion']),
    seoTitle: 'Beneshwar Dham — Sacred Tribal Pilgrimage in Dungarpur, Rajasthan',
    seoDescription: 'Discover Beneshwar Dham, the sacred island temple at the confluence of three rivers. Home to Rajasthan\'s largest tribal fair.',
    seoKeywords: 'Beneshwar Dham, Dungarpur, tribal fair, Mahi river, Shiva temple, triveni sangam',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Gaib Sagar Lake',
    slug: 'gaib-sagar-lake',
    district: 'Dungarpur',
    summary: 'Historic artificial lake in the heart of Dungarpur city, surrounded by temples, cenotaphs, and the stunning Badal Mahal palace.',
    story: 'Built by Maharawal Gopinath in the 18th century, Gaib Sagar Lake is the cultural heart of Dungarpur. Its banks are lined with intricately carved temples and royal cenotaphs reflecting the Vagad school of architecture. The Badal Mahal (Cloud Palace) rises from an island in the lake, its grey-blue pareva stone reflecting in the still waters. At sunset, the lake transforms into a mirror of gold, with migratory birds settling on its surface during winter months. The surrounding ghats come alive during festivals when locals gather for evening aartis. Flamingos, painted storks, and cormorants make this their winter home, creating a birdwatcher\'s paradise.',
    bestTime: 'October to March',
    lat: 23.8417,
    lng: 73.7147,
    highlights: JSON.stringify([
      { icon: '🏰', title: 'Badal Mahal', description: 'Cloud Palace rising from the lake island in grey-blue stone' },
      { icon: '🐦', title: 'Migratory Birds', description: 'Winter home to flamingos, storks, and cormorants' },
      { icon: '🌅', title: 'Sunset Views', description: 'Spectacular golden hour reflections on heritage skyline' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '15 km', image: '' },
      { slug: 'kagdi-pick-up-weir', title: 'Kagdi Pick Up Weir', distance: '8 km', image: '' },
      { slug: 'udai-bilas-palace', title: 'Udai Bilas Palace', distance: '2 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['boating', 'photography-tour', 'temple-trail']),
    seoTitle: 'Gaib Sagar Lake — Historic Lake & Badal Mahal in Dungarpur',
    seoDescription: 'Explore Gaib Sagar Lake in Dungarpur, home to the stunning Badal Mahal palace, ancient temples, and spectacular sunset views.',
    seoKeywords: 'Gaib Sagar, Dungarpur lake, Badal Mahal, heritage, Rajasthan, birdwatching',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Kagdi Pick Up Weir',
    slug: 'kagdi-pick-up-weir',
    district: 'Dungarpur',
    summary: 'Scenic dam and waterfall on the outskirts of Dungarpur, popular for picnics and monsoon visits when water cascades over the spillway.',
    story: 'Kagdi Pick Up Weir is a charming dam built across a seasonal river near Dungarpur. During and after the monsoon season, water overflows the weir creating a spectacular curtain of cascading water that stretches across the entire width of the structure. The surrounding area is lush green with rocky terrain, making it a favorite spot for locals and visitors seeking a peaceful retreat. The mist from the falling water creates rainbows on sunny monsoon afternoons. Local families gather here for picnics, and the site has become increasingly popular with photographers capturing the raw power of monsoon waters against the ancient rocky landscape.',
    bestTime: 'July to October (monsoon)',
    lat: 23.8200,
    lng: 73.7400,
    highlights: JSON.stringify([
      { icon: '💧', title: 'Monsoon Waterfall', description: 'Spectacular overflow creating a curtain of cascading water' },
      { icon: '🌿', title: 'Lush Surroundings', description: 'Green rocky landscape perfect for picnics and relaxation' },
      { icon: '📸', title: 'Photography Spot', description: 'Rainbows and mist create stunning natural backdrops' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '8 km', image: '' },
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '20 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['photography-tour', 'eco-tour']),
    seoTitle: 'Kagdi Pick Up Weir — Monsoon Waterfall near Dungarpur',
    seoDescription: 'Visit Kagdi Pick Up Weir near Dungarpur for stunning monsoon waterfalls and lush green picnic spots in the Vagad region.',
    seoKeywords: 'Kagdi weir, Dungarpur waterfall, monsoon, picnic spot, Vagad',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Mahi Dam',
    slug: 'mahi-dam',
    district: 'Banswara',
    summary: 'One of the largest earthen dams in India, creating a vast reservoir surrounded by islands — earning Banswara the title "City of Hundred Islands."',
    story: 'The Mahi Bajaj Sagar Dam, built across the Mahi River, is one of the longest earthen dams in the world stretching over 3 kilometers. The reservoir it creates is dotted with over a hundred small islands, giving Banswara its poetic name — "Sau Dweepon ka Shahar" (City of Hundred Islands). The dam area offers boating, fishing, and serene sunset views. The surrounding landscape is a mix of tribal villages, agricultural fields, and forested hills that come alive during the monsoon. Built in 1972, the dam serves irrigation needs across three districts while creating one of southern Rajasthan\'s most scenic landscapes. The islands range from tiny rocky outcrops to larger forested ones, some inhabited by fishing communities.',
    bestTime: 'September to February',
    lat: 23.4833,
    lng: 74.4500,
    highlights: JSON.stringify([
      { icon: '🏝️', title: 'Hundred Islands', description: 'Over 100 islands dot the vast reservoir creating a unique landscape' },
      { icon: '🚣', title: 'Boating', description: 'Boat rides through island-studded waters with local fishermen' },
      { icon: '🌄', title: 'Sunset Point', description: 'Breathtaking panoramic views over the dam at golden hour' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '35 km', image: '' },
      { slug: 'arthuna-temples', title: 'Arthuna Temples', distance: '50 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['boating', 'eco-tour', 'photography-tour']),
    seoTitle: 'Mahi Dam — City of Hundred Islands, Banswara, Rajasthan',
    seoDescription: 'Explore Mahi Bajaj Sagar Dam in Banswara, one of India\'s largest earthen dams with over 100 islands and stunning sunset views.',
    seoKeywords: 'Mahi Dam, Banswara, hundred islands, Mahi river, boating, Rajasthan',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },

  {
    title: 'Arthuna Temples',
    slug: 'arthuna-temples',
    district: 'Banswara',
    summary: 'A cluster of ancient 11th-12th century temples showcasing exquisite Paramara-era stone carvings, often called the "Khajuraho of Rajasthan."',
    story: 'Arthuna, a small village in Banswara district, houses a remarkable collection of Hindu and Jain temples dating back to the Paramara dynasty (11th-12th century CE). These temples feature intricate stone carvings depicting deities, celestial beings, and scenes from mythology. The Mandakini Temple dedicated to Lord Shiva is the most prominent, with its towering shikhara and detailed sculptural panels. Despite their historical significance comparable to Khajuraho, these temples remain relatively undiscovered, offering visitors an intimate encounter with medieval Indian architecture without the crowds. The Archaeological Survey of India maintains the site, preserving carvings that tell stories of a prosperous era when Arthuna was a thriving center of art and devotion.',
    bestTime: 'October to March',
    lat: 23.6900,
    lng: 74.2800,
    highlights: JSON.stringify([
      { icon: '🛕', title: 'Mandakini Temple', description: '11th-century Shiva temple with towering shikhara and detailed carvings' },
      { icon: '🎨', title: 'Stone Carvings', description: 'Exquisite Paramara-era sculptures of deities and celestial beings' },
      { icon: '📿', title: 'Jain Heritage', description: 'Ancient Jain temples with intricate relief panels' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '40 km', image: '' },
      { slug: 'mahi-dam', title: 'Mahi Dam', distance: '50 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['temple-trail', 'photography-tour', 'tribal-heritage-walk']),
    seoTitle: 'Arthuna Temples — Ancient Paramara-Era Temples in Banswara',
    seoDescription: 'Discover Arthuna Temples, a cluster of 11th-century temples with exquisite stone carvings in Banswara, often called the Khajuraho of Rajasthan.',
    seoKeywords: 'Arthuna temples, Banswara, Paramara dynasty, ancient temples, stone carvings, Rajasthan heritage',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Udai Bilas Palace',
    slug: 'udai-bilas-palace',
    district: 'Dungarpur',
    summary: 'A stunning 19th-century palace on the shores of Gaib Sagar Lake, blending Rajput and Victorian architecture with exquisite pareva stone work.',
    story: 'Udai Bilas Palace, built by Maharawal Udai Singh II in the 19th century, is a masterpiece of eclectic architecture blending Rajput grandeur with Victorian elegance. Situated on the banks of Gaib Sagar Lake, the palace features the distinctive grey-blue pareva stone unique to Dungarpur. Its interiors showcase stunning frescoes, ornate jharokhas (overhanging balconies), and a remarkable collection of miniature paintings. Now partially converted into a heritage hotel, visitors can experience royal Vagad hospitality while exploring rooms adorned with original furniture, hunting trophies, and crystal chandeliers. The palace\'s reflection in the lake at sunset is one of Dungarpur\'s most iconic sights.',
    bestTime: 'October to March',
    lat: 23.8400,
    lng: 73.7200,
    highlights: JSON.stringify([
      { icon: '🏛️', title: 'Pareva Stone Architecture', description: 'Unique grey-blue stone carvings found nowhere else in India' },
      { icon: '🎨', title: 'Miniature Paintings', description: 'Rare collection of Vagad school miniature art' },
      { icon: '👑', title: 'Heritage Hotel', description: 'Experience royal hospitality in restored palace rooms' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '2 km', image: '' },
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '18 km', image: '' },
      { slug: 'juna-mahal', title: 'Juna Mahal', distance: '1 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['temple-trail', 'photography-tour', 'cultural-immersion']),
    seoTitle: 'Udai Bilas Palace — Heritage Palace Hotel in Dungarpur',
    seoDescription: 'Visit Udai Bilas Palace in Dungarpur, a 19th-century lakeside palace with stunning pareva stone architecture and royal heritage.',
    seoKeywords: 'Udai Bilas Palace, Dungarpur, heritage hotel, Rajput architecture, pareva stone',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Tripura Sundari Temple',
    slug: 'tripura-sundari-temple',
    district: 'Banswara',
    summary: 'One of the 51 Shakti Peethas of India, this 12th-century temple dedicated to Goddess Tripura Sundari draws devotثees from across the country.',
    story: 'The Tripura Sundari Temple, located about 20 km from Banswara city, is one of the most revered Shakti Peethas in India. Built in the 12th century, the temple is dedicated to Goddess Tripura Sundari, a form of Shakti representing the three aspects of divine feminine power. The temple sits atop a small hill surrounded by dense forest, creating an atmosphere of profound spiritual energy. During Navratri, the temple witnesses massive gatherings of devotees who undertake the climb barefoot as an act of devotion. The architecture features typical Rajasthani temple style with a mandapa, garbhagriha, and a beautifully carved shikhara. Local tribal communities consider this their kuldevi (family goddess) and maintain centuries-old worship traditions here.',
    bestTime: 'October to March (especially during Navratri)',
    lat: 23.5200,
    lng: 74.4100,
    highlights: JSON.stringify([
      { icon: '🙏', title: 'Shakti Peetha', description: 'One of 51 sacred Shakti Peethas recognized across India' },
      { icon: '🏔️', title: 'Hilltop Setting', description: 'Temple atop a forested hill with panoramic views' },
      { icon: '🎆', title: 'Navratri Festival', description: 'Massive celebrations during the nine nights of Navratri' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'mahi-dam', title: 'Mahi Dam', distance: '25 km', image: '' },
      { slug: 'mangarh-hill', title: 'Mangarh Hill', distance: '30 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['temple-trail', 'trekking', 'cultural-immersion']),
    seoTitle: 'Tripura Sundari Temple — Sacred Shakti Peetha in Banswara',
    seoDescription: 'Visit Tripura Sundari Temple, one of India\'s 51 Shakti Peethas, a 12th-century hilltop temple in Banswara, Rajasthan.',
    seoKeywords: 'Tripura Sundari, Shakti Peetha, Banswara temple, Navratri, goddess temple',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Juna Mahal',
    slug: 'juna-mahal',
    district: 'Dungarpur',
    summary: 'A 13th-century fortress-palace with seven stories of stunning frescoes, mirror work, and glass inlay — one of Rajasthan\'s best-preserved medieval palaces.',
    story: 'Juna Mahal (Old Palace) is a seven-story fortress dating back to the 13th century, making it one of the oldest standing palace structures in Rajasthan. Unlike many heritage sites that have been restored, Juna Mahal retains its original frescoes, mirror work, and glass inlay in remarkably preserved condition. Every wall and ceiling tells a story through miniature paintings depicting court scenes, hunting expeditions, and religious narratives. The palace\'s narrow corridors, hidden chambers, and strategic defensive architecture reveal the ingenuity of medieval Vagad rulers. Access is limited and requires permission from the royal family, making each visit an exclusive experience. The turquoise, gold, and crimson color palette of the interiors creates an otherworldly atmosphere.',
    bestTime: 'October to March',
    lat: 23.8380,
    lng: 73.7130,
    highlights: JSON.stringify([
      { icon: '🖼️', title: 'Original Frescoes', description: '700-year-old paintings in pristine condition across seven floors' },
      { icon: '✨', title: 'Mirror & Glass Work', description: 'Intricate mirror inlay and colored glass creating kaleidoscopic interiors' },
      { icon: '🏰', title: 'Medieval Architecture', description: 'Seven-story fortress with hidden chambers and defensive corridors' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'udai-bilas-palace', title: 'Udai Bilas Palace', distance: '1 km', image: '' },
      { slug: 'gaib-sagar-lake', title: 'Gaib Sagar Lake', distance: '2 km', image: '' },
      { slug: 'beneshwar-dham', title: 'Beneshwar Dham', distance: '18 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['photography-tour', 'cultural-immersion', 'temple-trail']),
    seoTitle: 'Juna Mahal — 13th-Century Fortress Palace in Dungarpur',
    seoDescription: 'Explore Juna Mahal, a 700-year-old seven-story palace with original frescoes and mirror work in Dungarpur, Rajasthan.',
    seoKeywords: 'Juna Mahal, Dungarpur palace, medieval fortress, frescoes, Rajasthan heritage',
    seoOgImage: '',
    heroImage: '',
    featured: true,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Anand Sagar Lake',
    slug: 'anand-sagar-lake',
    district: 'Banswara',
    summary: 'A beautiful lake and garden complex in Banswara city, featuring musical fountains, a Shiva temple island, and lush landscaped gardens.',
    story: 'Anand Sagar is a modern lake and garden complex developed on the outskirts of Banswara city, combining natural beauty with recreational facilities. The centerpiece is a large artificial lake with a Shiva temple on a small island accessible by a bridge. The complex features musical fountains that come alive in the evenings, landscaped gardens with native plants, and walking paths that circle the lake. It serves as the primary recreational space for Banswara residents and offers visitors a pleasant introduction to the city. During festivals, the lake is illuminated with lights and hosts cultural programs. The surrounding area provides views of the Aravalli foothills, and the lake attracts local bird species year-round.',
    bestTime: 'October to March (evenings for fountain show)',
    lat: 23.5500,
    lng: 74.4400,
    highlights: JSON.stringify([
      { icon: '⛲', title: 'Musical Fountains', description: 'Evening light and sound show with synchronized fountains' },
      { icon: '🛕', title: 'Island Temple', description: 'Shiva temple on a lake island connected by a scenic bridge' },
      { icon: '🌺', title: 'Landscaped Gardens', description: 'Lush gardens with native plants and walking trails' },
    ]),
    nearbyPlaces: JSON.stringify([
      { slug: 'mahi-dam', title: 'Mahi Dam', distance: '20 km', image: '' },
      { slug: 'tripura-sundari-temple', title: 'Tripura Sundari Temple', distance: '22 km', image: '' },
    ]),
    gallery: JSON.stringify([]),
    experiences: JSON.stringify(['boating', 'photography-tour']),
    seoTitle: 'Anand Sagar Lake — Gardens & Musical Fountains in Banswara',
    seoDescription: 'Visit Anand Sagar Lake in Banswara for musical fountains, island temple, and beautiful gardens at the foot of the Aravallis.',
    seoKeywords: 'Anand Sagar, Banswara lake, musical fountain, gardens, Rajasthan tourism',
    seoOgImage: '',
    heroImage: '',
    featured: false,
    status: 'published',
    publishedAt: new Date().toISOString(),
  },
];


// ─── EVENTS ─────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    title: 'Beneshwar Fair',
    slug: 'beneshwar-fair',
    description: 'The largest tribal fair in Rajasthan, held at the sacred confluence of Som, Mahi, and Jakham rivers. Millions gather for worship, cultural performances, and trade during Magh Purnima. The fair features traditional Bhil music, Ghoomar dance, handicraft markets, and sacred river bathing rituals that have continued unbroken for centuries.',
    date: '2027-02-12T00:00:00.000Z',
    endDate: '2027-02-14T00:00:00.000Z',
    location: 'Beneshwar Dham, Dungarpur',
    district: 'Dungarpur',
    category: 'religious',
    seoTitle: 'Beneshwar Fair 2027 — Rajasthan\'s Largest Tribal Gathering',
    seoDescription: 'Experience the Beneshwar Fair, where millions of tribal devotees gather at the sacred triveni sangam for worship and celebration.',
    image: '',
    status: 'published',
  },
  {
    title: 'Baneshwar Mahotsav',
    slug: 'baneshwar-mahotsav',
    description: 'A cultural festival celebrating Bhil tribal heritage through traditional dance, music, and art. Features Ghoomar, Gair, and fire dances performed by local communities. Artisans display traditional bamboo craft, Pithora paintings, and tribal jewelry. The festival includes storytelling sessions where elders share oral histories of the Bhil resistance movement.',
    date: '2027-02-13T00:00:00.000Z',
    endDate: '2027-02-15T00:00:00.000Z',
    location: 'Banswara Cultural Ground',
    district: 'Banswara',
    category: 'cultural',
    seoTitle: 'Baneshwar Mahotsav — Tribal Cultural Festival in Banswara',
    seoDescription: 'Witness the vibrant Baneshwar Mahotsav celebrating Bhil tribal heritage through traditional dance, music, and art in Banswara.',
    image: '',
    status: 'published',
  },
  {
    title: 'Vagad Festival',
    slug: 'vagad-festival',
    description: 'Annual celebration of Vagad region\'s unique identity, featuring local cuisine, handicrafts, folk performances, and storytelling sessions about tribal history. The three-day festival brings together artisans, musicians, and chefs from across Banswara and Dungarpur to showcase the living heritage of the Vagad region.',
    date: '2027-03-15T00:00:00.000Z',
    endDate: '2027-03-17T00:00:00.000Z',
    location: 'Dungarpur Town Hall',
    district: 'Dungarpur',
    category: 'fair',
    seoTitle: 'Vagad Festival — Celebrating Regional Heritage in Dungarpur',
    seoDescription: 'Join the Vagad Festival for local cuisine, handicrafts, folk performances, and tribal storytelling in Dungarpur.',
    image: '',
    status: 'published',
  },
  {
    title: 'Ghoomar Dance Festival',
    slug: 'ghoomar-dance-festival',
    description: 'A celebration of the iconic Ghoomar dance form, where women in colorful ghagras perform the graceful spinning dance accompanied by traditional Bhil folk songs. Groups from across the Vagad region compete in this annual showcase of Rajasthan\'s most recognized dance tradition, with performances under the open sky at the historic Mangarh Hill grounds.',
    date: '2027-10-20T00:00:00.000Z',
    endDate: '2027-10-21T00:00:00.000Z',
    location: 'Mangarh Hill Grounds',
    district: 'Banswara',
    category: 'cultural',
    seoTitle: 'Ghoomar Dance Festival — Traditional Rajasthani Dance at Mangarh',
    seoDescription: 'Experience the mesmerizing Ghoomar dance festival featuring traditional Bhil folk performances at Mangarh Hill, Banswara.',
    image: '',
    status: 'published',
  },
  {
    title: 'Tribal Art Fair',
    slug: 'tribal-art-fair',
    description: 'An exhibition and marketplace showcasing Bhil tribal art including Pithora paintings, bamboo crafts, terracotta pottery, and traditional jewelry. Artists demonstrate their techniques and visitors can purchase authentic handmade pieces directly from the creators. Workshops allow visitors to try their hand at traditional art forms under the guidance of master artisans.',
    date: '2027-01-10T00:00:00.000Z',
    endDate: '2027-01-12T00:00:00.000Z',
    location: 'Dungarpur Art Gallery',
    district: 'Dungarpur',
    category: 'cultural',
    seoTitle: 'Tribal Art Fair — Bhil Art Exhibition in Dungarpur',
    seoDescription: 'Discover authentic Bhil tribal art at the Tribal Art Fair in Dungarpur — Pithora paintings, bamboo crafts, and traditional jewelry.',
    image: '',
    status: 'published',
  },
  {
    title: 'Mahi Monsoon Festival',
    slug: 'mahi-monsoon-festival',
    description: 'A celebration of the monsoon season along the Mahi River, featuring boat races, fishing competitions, folk music, and rain-themed cultural performances. The festival marks the filling of the Mahi Bajaj Sagar reservoir and celebrates the life-giving rains that transform the arid Vagad landscape into lush green terrain.',
    date: '2027-08-15T00:00:00.000Z',
    endDate: '2027-08-16T00:00:00.000Z',
    location: 'Mahi Dam, Banswara',
    district: 'Banswara',
    category: 'fair',
    seoTitle: 'Mahi Monsoon Festival — Rain Celebrations at Mahi Dam',
    seoDescription: 'Join the Mahi Monsoon Festival for boat races, folk music, and monsoon celebrations at Mahi Dam in Banswara.',
    image: '',
    status: 'published',
  },
  {
    title: 'Temple Heritage Walk',
    slug: 'temple-heritage-walk',
    description: 'A guided heritage walk connecting the ancient temples of Arthuna, Beneshwar Dham, and Tripura Sundari. Expert historians lead small groups through 11th-century Paramara-era ruins, explaining the iconography of stone carvings, the evolution of temple architecture in southern Rajasthan, and the living worship traditions that have continued unbroken for a millennium. The walk includes interactions with temple priests and local artisans who maintain restoration work.',
    date: '2027-11-15T00:00:00.000Z',
    endDate: '2027-11-16T00:00:00.000Z',
    location: 'Arthuna Temples, Banswara',
    district: 'Banswara',
    category: 'cultural',
    seoTitle: 'Temple Heritage Walk — Ancient Temple Tour in Vagad',
    seoDescription: 'Join a guided heritage walk through Vagad\'s ancient temples with expert historians exploring 11th-century Paramara-era architecture.',
    image: '',
    status: 'published',
  },
];


// ─── FOOD ───────────────────────────────────────────────────────────────────

const FOOD = [
  {
    title: 'Dal Baati Churma',
    slug: 'dal-baati-churma',
    description: 'The quintessential Rajasthani meal — hard wheat balls (baati) baked over cow-dung fire, served with panchmel dal and sweet crushed wheat churma. In Vagad, the baati is often stuffed with a spiced onion filling unique to the tribal communities. The smoky flavor from traditional cooking methods cannot be replicated in modern ovens.',
    origin: 'Vagad Region',
    type: 'dish',
    seoTitle: 'Dal Baati Churma — Authentic Vagad Style',
    seoDescription: 'Taste the authentic Vagad-style Dal Baati Churma with tribal onion-stuffed baati, a signature dish of the region.',
    image: '',
    status: 'published',
  },
  {
    title: 'Mahua Ladoo',
    slug: 'mahua-ladoo',
    description: 'Traditional tribal sweet made from dried Mahua flowers, mixed with jaggery and ghee. A seasonal delicacy prepared during spring when Mahua trees bloom across the Vagad forests. The Bhil community has harvested Mahua for generations, using it in sweets, beverages, and medicinal preparations.',
    origin: 'Bhil Tribal Communities',
    type: 'sweet',
    seoTitle: 'Mahua Ladoo — Tribal Forest Sweet of Vagad',
    seoDescription: 'Discover Mahua Ladoo, a traditional Bhil tribal sweet made from forest Mahua flowers, jaggery, and ghee.',
    image: '',
    status: 'published',
  },
  {
    title: 'Ker Sangri',
    slug: 'ker-sangri',
    description: 'A tangy desert vegetable dish made from dried ker berries and sangri beans, cooked with mustard oil and local spices. A staple that showcases the resourcefulness of desert cuisine, preserving seasonal produce for year-round consumption through sun-drying techniques passed down through generations.',
    origin: 'Rajasthani Desert Cuisine',
    type: 'dish',
    seoTitle: 'Ker Sangri — Desert Vegetable Delicacy',
    seoDescription: 'Try Ker Sangri, the iconic Rajasthani desert dish made from wild berries and beans, a testament to desert culinary ingenuity.',
    image: '',
    status: 'published',
  },
  {
    title: 'Chaach',
    slug: 'chaach',
    description: 'Spiced buttermilk seasoned with roasted cumin, fresh coriander, and green chili. The essential cooling drink of Vagad, served with every meal during the scorching summer months. Each household has its own recipe, with some adding mint or curry leaves for extra flavor.',
    origin: 'Vagad Region',
    type: 'beverage',
    seoTitle: 'Chaach — Spiced Buttermilk of Vagad',
    seoDescription: 'Cool down with Chaach, the traditional spiced buttermilk of Vagad, seasoned with cumin and fresh herbs.',
    image: '',
    status: 'published',
  },
  {
    title: 'Amla Murabba',
    slug: 'amla-murabba',
    description: 'Preserved Indian gooseberry soaked in sugar syrup, a traditional Vagad preparation known for its health benefits. Made during winter when amla trees bear fruit across the region. The translucent amber preserve is rich in Vitamin C and is often eaten as a morning health tonic.',
    origin: 'Dungarpur',
    type: 'sweet',
    seoTitle: 'Amla Murabba — Traditional Vagad Preserve',
    seoDescription: 'Enjoy Amla Murabba, a traditional Vagad gooseberry preserve known for its health benefits and sweet-tangy flavor.',
    image: '',
    status: 'published',
  },
  {
    title: 'Tribal Smoked Fish',
    slug: 'tribal-smoked-fish',
    description: 'Fresh river fish from the Mahi and Som rivers, smoked over wood fire using traditional Bhil techniques. The fish is marinated with local herbs and slow-smoked, creating a unique flavor profile found nowhere else in Rajasthan. Typically served with bajra roti and raw onion.',
    origin: 'Bhil Fishing Communities',
    type: 'dish',
    seoTitle: 'Tribal Smoked Fish — Bhil River Cuisine',
    seoDescription: 'Experience tribal smoked fish from the Mahi river, prepared using ancient Bhil smoking techniques unique to the Vagad region.',
    image: '',
    status: 'published',
  },
  {
    title: 'Rabdi',
    slug: 'rabdi',
    description: 'A rich, slow-cooked sweetened milk dessert thickened by continuous stirring over low flame until it reduces to a creamy, layered consistency. In Vagad, rabdi is flavored with cardamom and saffron, served chilled during festivals and weddings. The Banswara variant uses fresh buffalo milk from local dairies, giving it a distinctly dense texture.',
    origin: 'Banswara',
    type: 'sweet',
    seoTitle: 'Rabdi — Creamy Milk Dessert of Vagad',
    seoDescription: 'Savor authentic Vagad Rabdi, a slow-cooked milk dessert flavored with cardamom and saffron, served at festivals and celebrations.',
    image: '',
    status: 'published',
  },
  {
    title: 'Makki Ki Roti',
    slug: 'makki-ki-roti',
    description: 'Thick, golden flatbread made from freshly ground maize flour, cooked on a tawa over wood fire. A winter staple across Vagad villages, served with white butter, garlic chutney, and seasonal greens. The coarse texture and earthy sweetness of hand-ground corn makes this a comfort food that tribal families prepare daily during the cold months.',
    origin: 'Vagad Tribal Villages',
    type: 'dish',
    seoTitle: 'Makki Ki Roti — Winter Corn Bread of Vagad',
    seoDescription: 'Taste Makki Ki Roti, the golden maize flatbread of Vagad villages, a winter staple served with white butter and garlic chutney.',
    image: '',
    status: 'published',
  },
];

// ─── EXPERIENCES ────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    title: 'Tribal Heritage Walk',
    slug: 'tribal-heritage-walk',
    description: 'Guided walk through Bhil tribal villages, learning about traditional art, customs, and the living heritage of Vagad\'s indigenous communities.',
    category: 'culture',
    image: '',
    status: 'published',
  },
  {
    title: 'Eco Tour',
    slug: 'eco-tour',
    description: 'Explore the biodiversity of Vagad\'s forests and wetlands with naturalist guides, spotting native birds, medicinal plants, and seasonal wildlife.',
    category: 'nature',
    image: '',
    status: 'published',
  },
  {
    title: 'Boating',
    slug: 'boating',
    description: 'Serene boat rides through the hundred islands of Mahi Bajaj Sagar or on the tranquil waters of Gaib Sagar Lake at sunset.',
    category: 'nature',
    image: '',
    status: 'published',
  },
  {
    title: 'Temple Trail',
    slug: 'temple-trail',
    description: 'Visit ancient Jain and Hindu temples scattered across Dungarpur and Banswara, featuring intricate stone carvings and centuries of devotional history.',
    category: 'spiritual',
    image: '',
    status: 'published',
  },
  {
    title: 'Food Trail',
    slug: 'food-trail',
    description: 'Taste authentic tribal cuisine — from Mahua preparations to fire-roasted baati — guided by local families who share recipes passed down through generations.',
    category: 'food',
    image: '',
    status: 'published',
  },
  {
    title: 'Trekking',
    slug: 'trekking',
    description: 'Trek through the Aravalli foothills, from the gentle slopes of Mangarh Hill to forested trails leading to hidden waterfalls and tribal settlements.',
    category: 'adventure',
    image: '',
    status: 'published',
  },
  {
    title: 'Photography Tour',
    slug: 'photography-tour',
    description: 'Capture the raw beauty of Vagad — from ancient architecture and tribal portraits to monsoon landscapes and golden hour lake reflections.',
    category: 'culture',
    image: '',
    status: 'published',
  },
  {
    title: 'Cultural Immersion',
    slug: 'cultural-immersion',
    description: 'Stay with tribal families, participate in daily rituals, learn Pithora painting, and experience the authentic rhythms of Vagad village life.',
    category: 'culture',
    image: '',
    status: 'published',
  },
  {
    title: 'Mahi River Boating',
    slug: 'mahi-river-boating',
    description: 'Glide through the island-dotted waters of Mahi Bajaj Sagar on traditional wooden boats. Navigate between forested islands, spot kingfishers and herons, and watch local fishermen cast their nets at dawn.',
    category: 'nature',
    image: '',
    status: 'published',
  },
  {
    title: 'Eco Nature Trail',
    slug: 'eco-nature-trail',
    description: 'Walk through Vagad\'s dry deciduous forests with naturalist guides, identifying medicinal plants used by Bhil healers, tracking wildlife, and learning about the fragile ecosystem of the Aravalli foothills.',
    category: 'nature',
    image: '',
    status: 'published',
  },
  {
    title: 'Waterfall Exploration',
    slug: 'waterfall-exploration',
    description: 'During monsoon months, discover hidden waterfalls cascading over ancient rock formations near Kagdi Weir and in the forested ravines around Dungarpur. A seasonal adventure best experienced July through September.',
    category: 'adventure',
    image: '',
    status: 'published',
  },
  {
    title: 'Tribal Food Trail',
    slug: 'tribal-food-trail',
    description: 'Journey through Bhil villages tasting authentic tribal cuisine — from Mahua preparations and smoked river fish to fire-roasted baati and foraged forest greens. Each stop reveals recipes unchanged for centuries.',
    category: 'food',
    image: '',
    status: 'published',
  },
  {
    title: 'Sunrise Trekking',
    slug: 'sunrise-trekking',
    description: 'Early morning treks to hilltop viewpoints across the Vagad landscape — Mangarh Hill, Tripura Sundari ridge, and Aravalli outlooks — rewarding hikers with golden sunrise vistas over misty valleys and tribal settlements.',
    category: 'adventure',
    image: '',
    status: 'published',
  },
];

// ─── REGIONS ────────────────────────────────────────────────────────────────

const REGIONS = [
  { name: 'Banswara', tagline: 'City of Hundred Islands', image: '', destinationCount: 5 },
  { name: 'Dungarpur', tagline: 'City of Hills', image: '', destinationCount: 5 },
];


// ─── SEEDING LOGIC ──────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding VisitVagad database\n');

  // Strip attributes that may not exist in Appwrite yet
  const stripDestFields = ({ highlights, nearbyPlaces, gallery, experiences, seoKeywords, seoOgImage, ...rest }: any) => rest;
  await seedCollection(COLLECTIONS.DESTINATIONS, DESTINATIONS.map(stripDestFields), 'slug');
  await seedCollection(COLLECTIONS.EVENTS, EVENTS, 'slug');
  await seedCollection(COLLECTIONS.FOOD, FOOD, 'slug');
  await seedCollection(COLLECTIONS.EXPERIENCES, EXPERIENCES.map(({ slug, ...rest }) => rest), 'title');
  await seedCollection(COLLECTIONS.REGIONS, REGIONS, 'name');

  console.log('\n✅ Seeding complete.');
}

async function seedCollection(collectionId: string, items: Record<string, any>[], dedupeKey: string) {
  console.log(`\n📦 ${collectionId} (${items.length} items):`);

  for (const item of items) {
    const exists = await checkExists(collectionId, dedupeKey, item[dedupeKey]);
    if (exists) {
      console.log(`  ⊘ "${item[dedupeKey]}" already exists, skipping`);
      continue;
    }

    try {
      await db.createDocument(DATABASE_ID, collectionId, ID.unique(), item);
      console.log(`  ✓ "${item[dedupeKey]}"`);
    } catch (e: any) {
      console.log(`  ✗ "${item[dedupeKey]}": ${e?.message || 'error'}`);
    }
    await sleep(200);
  }
}

async function checkExists(collectionId: string, key: string, value: string): Promise<boolean> {
  try {
    const res = await db.listDocuments(DATABASE_ID, collectionId, [
      Query.equal(key, value),
      Query.limit(1),
    ]);
    return res.total > 0;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
