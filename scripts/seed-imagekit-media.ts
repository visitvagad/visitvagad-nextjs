/**
 * Seed ImageKit Media — Populates rich galleries, OG images, and captions
 * for all tourism collections using ImageKit assets.
 *
 * This script is designed to run AFTER sync-imagekit.ts has mapped hero images.
 * It enriches records with curated gallery captions, storytelling alt text,
 * and ensures every published record has complete media coverage.
 *
 * Usage:
 *   npx tsx scripts/seed-imagekit-media.ts
 *   npx tsx scripts/seed-imagekit-media.ts --dry-run
 *   npx tsx scripts/seed-imagekit-media.ts --verbose
 */
import 'dotenv/config';
import { Client, Databases, Query, ID } from 'node-appwrite';

const DATABASE_ID = '6a047889002003689732';
const COLLECTIONS = {
  DESTINATIONS: 'destinations',
  EVENTS: 'events',
  FOOD: 'food',
  EXPERIENCES: 'experiences',
  ITINERARIES: 'itineraries',
  STAYS: 'stays',
  GALLERIES: 'galleries',
} as const;

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const db = new Databases(client);

// ─── ImageKit API ────────────────────────────────────────────────────────────

interface IKFile { name: string; filePath: string; url: string; fileId: string; }

const authHeader = IMAGEKIT_PRIVATE_KEY
  ? `Basic ${Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64')}`
  : '';

async function fetchAllFiles(): Promise<IKFile[]> {
  if (!authHeader) return [];
  const all: IKFile[] = [];
  const paths = ['/', '/destinations', '/events', '/food', '/experiences', '/stays', '/itineraries', '/instagram', '/creatives', '/social', '/tourism', '/vagad'];
  for (const p of paths) {
    try {
      const res = await fetch(`https://api.imagekit.io/v1/files?path=${encodeURIComponent(p)}&limit=1000&type=file`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const files: IKFile[] = await res.json();
        all.push(...files.filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f.name)));
      }
    } catch { /* skip */ }
  }
  return all;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) { console.log(msg); }
function verbose(msg: string) { if (VERBOSE) console.log(`    ${msg}`); }
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function buildUrl(path: string) { return `${IMAGEKIT_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`; }

/** Curated caption templates for tourism storytelling */
const CAPTION_TEMPLATES: Record<string, string[]> = {
  destinations: [
    'A cinematic view of {title}',
    '{title} at golden hour',
    'The timeless beauty of {title}',
    'Heritage and nature converge at {title}',
    '{title} — where stories live in stone',
    'Sunrise over {title}',
    'The sacred landscape of {title}',
    'Exploring the depths of {title}',
  ],
  events: [
    'The vibrant energy of {title}',
    'Colors and celebration at {title}',
    'Community spirit during {title}',
    'Traditional performances at {title}',
  ],
  food: [
    'Authentic {title} — a taste of Vagad',
    'Traditional preparation of {title}',
    '{title} served with love',
    'The flavors of {title}',
  ],
};

function generateCaption(title: string, category: string, index: number): string {
  const templates = CAPTION_TEMPLATES[category] || CAPTION_TEMPLATES.destinations;
  const template = templates[index % templates.length];
  return template.replace('{title}', title);
}

function generateAlt(title: string, district: string, index: number): string {
  const suffixes = ['landscape view', 'heritage detail', 'cultural scene', 'panoramic vista', 'architectural beauty', 'natural setting', 'aerial perspective', 'close-up detail'];
  return `${title}, ${district} — ${suffixes[index % suffixes.length]}`;
}

// ─── Matching ────────────────────────────────────────────────────────────────

function findMatchesForRecord(slug: string, title: string, files: IKFile[]): IKFile[] {
  const s = slug.toLowerCase();
  const words = title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

  return files.filter((f) => {
    const fname = slugify(f.name.replace(/\.[^.]+$/, ''));
    const fpath = f.filePath.toLowerCase();
    if (fname === s || fname.includes(s) || fpath.includes(s)) return true;
    if (words.length > 0 && words.filter((w) => fname.includes(w) || fpath.includes(w)).length >= 2) return true;
    return false;
  });
}

// ─── Seeding Logic ───────────────────────────────────────────────────────────

let stats = { destinations: 0, events: 0, food: 0, experiences: 0, itineraries: 0, stays: 0, galleryDocs: 0 };

async function seedDestinationGalleries(files: IKFile[]) {
  log('\n📍 Seeding Destination Galleries...');
  const docs = await db.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(100)]);

  for (const doc of docs.documents) {
    const slug = doc.slug as string;
    const title = doc.title as string;
    const district = (doc.district as string) || 'Vagad';
    const matches = findMatchesForRecord(slug, title, files);

    if (matches.length === 0) {
      verbose(`⊘ ${slug} — no images found`);
      continue;
    }

    const galleryFiles = matches.slice(0, 8);
    const updates: Record<string, unknown> = {};

    // Hero image (if not set)
    if (!(doc.heroImage as string)?.includes('imagekit.io')) {
      updates.heroImage = galleryFiles[0].url || buildUrl(galleryFiles[0].filePath);
    }

    // OG image
    if (!(doc.seoOgImage as string)?.includes('imagekit.io')) {
      updates.seoOgImage = galleryFiles[0].url || buildUrl(galleryFiles[0].filePath);
    }

    // Gallery JSON
    const gallery = galleryFiles.map((f, i) => ({
      src: f.url || buildUrl(f.filePath),
      alt: generateAlt(title, district, i),
      caption: generateCaption(title, 'destinations', i),
    }));
    updates.gallery = JSON.stringify(gallery);

    log(`  ✓ ${slug} → ${galleryFiles.length} images (hero + gallery + OG)`);
    stats.destinations++;

    if (!DRY_RUN) {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.DESTINATIONS, doc.$id, updates);

      // Populate galleries collection (relational)
      const existing = await db.listDocuments(DATABASE_ID, COLLECTIONS.GALLERIES, [
        Query.equal('parentId', doc.$id), Query.equal('parentType', 'destination'), Query.limit(1),
      ]);
      if (existing.total === 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const f = galleryFiles[i];
          await db.createDocument(DATABASE_ID, COLLECTIONS.GALLERIES, ID.unique(), {
            fileId: f.fileId || slugify(f.name),
            url: f.url || buildUrl(f.filePath),
            alt: generateAlt(title, district, i),
            caption: generateCaption(title, 'destinations', i),
            order: i,
            parentId: doc.$id,
            parentType: 'destination',
          });
          stats.galleryDocs++;
        }
      }
    }
  }
}

async function seedCollectionImages(
  collectionId: string,
  label: string,
  imageField: string,
  files: IKFile[],
  statKey: keyof typeof stats
) {
  log(`\n🏷️  Seeding ${label}...`);
  const docs = await db.listDocuments(DATABASE_ID, collectionId, [Query.limit(100)]);

  for (const doc of docs.documents) {
    const slug = (doc.slug || doc.name || '') as string;
    const title = (doc.title || doc.name || '') as string;
    const current = doc[imageField] as string;

    if (current?.includes('imagekit.io')) {
      verbose(`⊘ ${slug} — already has ImageKit image`);
      continue;
    }

    const matches = findMatchesForRecord(slugify(slug), title, files);
    if (matches.length === 0) {
      verbose(`⊘ ${slug} — no match`);
      continue;
    }

    const url = matches[0].url || buildUrl(matches[0].filePath);
    log(`  ✓ ${slug} → ${matches[0].name}`);
    (stats[statKey] as number)++;

    if (!DRY_RUN) {
      await db.updateDocument(DATABASE_ID, collectionId, doc.$id, { [imageField]: url });
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  log('🌄 VisitVagad — ImageKit Media Seeding');
  if (DRY_RUN) log('   ⚡ DRY RUN mode');
  if (VERBOSE) log('   📝 VERBOSE mode');
  log('');

  if (!IMAGEKIT_URL) { console.error('✗ NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT not set'); process.exit(1); }

  log('Fetching ImageKit assets...');
  const files = await fetchAllFiles();
  log(`Found ${files.length} image files\n`);

  if (files.length === 0 && !authHeader) {
    log('⚠ No IMAGEKIT_PRIVATE_KEY set. Cannot fetch files from ImageKit API.');
    log('  Set IMAGEKIT_PRIVATE_KEY in .env.local to enable media seeding.');
    process.exit(0);
  }

  await seedDestinationGalleries(files);
  await seedCollectionImages(COLLECTIONS.EVENTS, 'Events', 'image', files, 'events');
  await seedCollectionImages(COLLECTIONS.FOOD, 'Food', 'image', files, 'food');
  await seedCollectionImages(COLLECTIONS.EXPERIENCES, 'Experiences', 'image', files, 'experiences');
  await seedCollectionImages(COLLECTIONS.ITINERARIES, 'Itineraries', 'heroImage', files, 'itineraries');
  await seedCollectionImages(COLLECTIONS.STAYS, 'Stays', 'image', files, 'stays');

  log(`\n${'─'.repeat(50)}`);
  log(`${DRY_RUN ? '🔍 DRY RUN' : '✓'} Media seeding complete`);
  log(`  Destinations: ${stats.destinations} (with galleries)`);
  log(`  Events: ${stats.events}`);
  log(`  Food: ${stats.food}`);
  log(`  Experiences: ${stats.experiences}`);
  log(`  Itineraries: ${stats.itineraries}`);
  log(`  Stays: ${stats.stays}`);
  log(`  Gallery docs: ${stats.galleryDocs}`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
