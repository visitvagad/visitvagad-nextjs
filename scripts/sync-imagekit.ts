/**
 * Enhanced ImageKit Sync — Multi-image galleries, OG enrichment, category-aware matching.
 *
 * Usage:
 *   npx tsx scripts/sync-imagekit.ts                  # normal run
 *   npx tsx scripts/sync-imagekit.ts --dry-run        # preview without writing
 *   npx tsx scripts/sync-imagekit.ts --verbose        # detailed logging
 *   npx tsx scripts/sync-imagekit.ts --dry-run --verbose
 */
import 'dotenv/config';
import { Client, Databases, Query, ID } from 'node-appwrite';

// ─── Config ──────────────────────────────────────────────────────────────────

const DATABASE_ID = '6a047889002003689732';
const COLLECTIONS = {
  DESTINATIONS: 'destinations',
  EVENTS: 'events',
  FOOD: 'food',
  EXPERIENCES: 'experiences',
  ITINERARIES: 'itineraries',
  STAYS: 'stays',
  GUIDES: 'guides',
  GALLERIES: 'galleries',
} as const;

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// ─── Appwrite ────────────────────────────────────────────────────────────────

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const db = new Databases(client);

// ─── ImageKit API ────────────────────────────────────────────────────────────

interface IKFile {
  name: string;
  filePath: string;
  url: string;
  type: 'file' | 'folder';
  fileId: string;
  tags?: string[];
}

const authHeader = IMAGEKIT_PRIVATE_KEY
  ? `Basic ${Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64')}`
  : '';

async function listImageKitFiles(path = '/', limit = 1000): Promise<IKFile[]> {
  if (!authHeader) return [];
  const res = await fetch(
    `https://api.imagekit.io/v1/files?path=${encodeURIComponent(path)}&limit=${limit}&type=file`,
    { headers: { Authorization: authHeader } }
  );
  if (!res.ok) throw new Error(`ImageKit API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function listImageKitFolders(path = '/'): Promise<string[]> {
  if (!authHeader) return [];
  const res = await fetch(
    `https://api.imagekit.io/v1/files?path=${encodeURIComponent(path)}&type=folder`,
    { headers: { Authorization: authHeader } }
  );
  if (!res.ok) return [];
  const items: IKFile[] = await res.json();
  return items.map((f) => f.filePath);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) { console.log(msg); }
function verbose(msg: string) { if (VERBOSE) console.log(`    ${msg}`); }

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildUrl(filePath: string): string {
  const base = IMAGEKIT_URL.replace(/\/$/, '');
  const clean = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${base}${clean}`;
}

function isImageFile(f: IKFile): boolean {
  return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f.name);
}

/** Tourism keyword categories for intelligent matching */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  destinations: ['temple', 'palace', 'fort', 'lake', 'dam', 'hill', 'mahal', 'dham', 'sagar', 'river', 'waterfall', 'heritage', 'monument'],
  events: ['festival', 'fair', 'mela', 'celebration', 'dance', 'ghoomar', 'holi', 'diwali', 'navratri'],
  food: ['food', 'dish', 'cuisine', 'dal', 'baati', 'churma', 'ladoo', 'sweet', 'thali', 'roti', 'chai'],
  experiences: ['trek', 'boat', 'safari', 'tour', 'walk', 'trail', 'adventure', 'nature', 'eco', 'photography'],
  stays: ['hotel', 'resort', 'homestay', 'guesthouse', 'room', 'property', 'stay'],
  instagram: ['instagram', 'insta', 'post', 'reel', 'story', 'creative', 'promo', 'banner', 'campaign', 'cta', 'social'],
};

function categorizeFile(file: IKFile): string {
  const path = file.filePath.toLowerCase();
  const name = file.name.toLowerCase();

  // Folder-based categorization first
  for (const cat of Object.keys(CATEGORY_KEYWORDS)) {
    if (path.includes(`/${cat}/`) || path.includes(`/${cat.slice(0, -1)}/`)) return cat;
  }

  // Keyword-based fallback
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => name.includes(kw) || path.includes(kw))) return cat;
  }

  return 'general';
}

/** Find ALL matching files for a slug/title (for gallery population) */
function findAllMatches(slug: string, title: string, files: IKFile[]): IKFile[] {
  const slugLower = slug.toLowerCase();
  const titleWords = title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

  return files.filter((f) => {
    const fname = slugify(f.name.replace(/\.[^.]+$/, ''));
    const fpath = f.filePath.toLowerCase();
    // Exact slug match
    if (fname === slugLower) return true;
    // Slug contained in filename or path
    if (fname.includes(slugLower) || fpath.includes(slugLower)) return true;
    // Title word match (2+ words)
    if (titleWords.length > 0 && titleWords.filter((w) => fname.includes(w) || fpath.includes(w)).length >= 2) return true;
    return false;
  });
}

/** Find single best match */
function findBestMatch(slug: string, title: string, files: IKFile[]): IKFile | null {
  const matches = findAllMatches(slug, title, files);
  return matches[0] || null;
}

/** Generate a caption from filename */
function captionFromFilename(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// ─── Sync Operations ─────────────────────────────────────────────────────────

interface SyncStats {
  heroImages: number;
  galleries: number;
  ogImages: number;
  galleryDocs: number;
}

const stats: SyncStats = { heroImages: 0, galleries: 0, ogImages: 0, galleryDocs: 0 };

async function syncDestinations(files: IKFile[]) {
  log('\n📍 Destinations:');
  const destFiles = files.filter((f) => categorizeFile(f) === 'destinations' || categorizeFile(f) === 'general');
  const docs = await db.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(100)]);

  for (const doc of docs.documents) {
    const slug = doc.slug as string;
    const title = doc.title as string;
    const matches = findAllMatches(slug, title, destFiles);

    if (matches.length === 0) {
      verbose(`⊘ ${slug} — no matches`);
      continue;
    }

    verbose(`${slug} — ${matches.length} match(es)`);
    const updates: Record<string, unknown> = {};

    // Hero image
    const currentHero = doc.heroImage as string;
    if (!currentHero?.includes('imagekit.io')) {
      updates.heroImage = matches[0].url || buildUrl(matches[0].filePath);
      stats.heroImages++;
    }

    // OG image
    const currentOg = doc.seoOgImage as string;
    if (!currentOg?.includes('imagekit.io')) {
      updates.seoOgImage = matches[0].url || buildUrl(matches[0].filePath);
      stats.ogImages++;
    }

    // Gallery (JSON array in `gallery` field)
    if (matches.length > 1) {
      const galleryImages = matches.slice(0, 8).map((f) => ({
        src: f.url || buildUrl(f.filePath),
        alt: `${title} — ${captionFromFilename(f.name)}`,
        caption: captionFromFilename(f.name),
      }));
      updates.gallery = JSON.stringify(galleryImages);
      stats.galleries++;
    }

    if (Object.keys(updates).length > 0) {
      log(`  ✓ ${slug} → hero${updates.gallery ? ` + ${JSON.parse(updates.gallery as string).length} gallery` : ''} + OG`);
      if (!DRY_RUN) {
        await db.updateDocument(DATABASE_ID, COLLECTIONS.DESTINATIONS, doc.$id, updates);
      }
    }

    // Also populate `galleries` collection for relational gallery
    if (matches.length > 1 && !DRY_RUN) {
      // Check existing gallery docs for this parent
      const existing = await db.listDocuments(DATABASE_ID, COLLECTIONS.GALLERIES, [
        Query.equal('parentId', doc.$id), Query.equal('parentType', 'destination'), Query.limit(1),
      ]);
      if (existing.total === 0) {
        for (let i = 0; i < Math.min(matches.length, 8); i++) {
          const f = matches[i];
          await db.createDocument(DATABASE_ID, COLLECTIONS.GALLERIES, ID.unique(), {
            fileId: f.fileId || slugify(f.name),
            url: f.url || buildUrl(f.filePath),
            alt: `${title} — ${captionFromFilename(f.name)}`,
            caption: captionFromFilename(f.name),
            order: i,
            parentId: doc.$id,
            parentType: 'destination',
          });
          stats.galleryDocs++;
        }
        verbose(`  → Created ${Math.min(matches.length, 8)} gallery docs`);
      }
    }
  }
}

async function syncSimpleCollection(
  collectionId: string,
  label: string,
  imageField: string,
  files: IKFile[],
  category: string
) {
  log(`\n🏷️  ${label}:`);
  const catFiles = files.filter((f) => categorizeFile(f) === category || categorizeFile(f) === 'general');
  const docs = await db.listDocuments(DATABASE_ID, collectionId, [Query.limit(100)]);

  let updated = 0;
  for (const doc of docs.documents) {
    const slug = (doc.slug || doc.name || '') as string;
    const title = (doc.title || doc.name || '') as string;
    const current = doc[imageField] as string;

    if (current?.includes('imagekit.io')) {
      verbose(`⊘ ${slug} — already mapped`);
      continue;
    }

    const match = findBestMatch(slugify(slug), title, catFiles);
    if (match) {
      const url = match.url || buildUrl(match.filePath);
      log(`  ✓ ${slug} → ${match.name}`);
      if (!DRY_RUN) {
        await db.updateDocument(DATABASE_ID, collectionId, doc.$id, { [imageField]: url });
      }
      updated++;
      stats.heroImages++;
    } else {
      verbose(`⊘ ${slug} — no match`);
    }
  }
  return updated;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  log('🖼️  VisitVagad ImageKit Sync — Enhanced');
  if (DRY_RUN) log('   ⚡ DRY RUN — no database writes');
  if (VERBOSE) log('   📝 VERBOSE mode');
  log('');

  if (!IMAGEKIT_URL) {
    console.error('✗ NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT not set');
    process.exit(1);
  }

  // Scan ImageKit
  let allFiles: IKFile[] = [];
  if (authHeader) {
    log('Scanning ImageKit...');
    try {
      // Get root files
      const rootFiles = await listImageKitFiles('/');
      allFiles.push(...rootFiles.filter(isImageFile));

      // Discover and scan subfolders
      const folders = await listImageKitFolders('/');
      for (const folder of folders) {
        try {
          const subFiles = await listImageKitFiles(folder);
          allFiles.push(...subFiles.filter(isImageFile));
          verbose(`  ${folder} → ${subFiles.filter(isImageFile).length} images`);
        } catch { /* skip */ }
      }

      // Also try known category folders
      for (const cat of ['destinations', 'events', 'food', 'experiences', 'stays', 'itineraries', 'instagram', 'creatives', 'social']) {
        if (!folders.some((f) => f.includes(cat))) {
          try {
            const subFiles = await listImageKitFiles(`/${cat}`);
            allFiles.push(...subFiles.filter(isImageFile));
            verbose(`  /${cat} → ${subFiles.filter(isImageFile).length} images`);
          } catch { /* folder doesn't exist */ }
        }
      }

      log(`Found ${allFiles.length} image files total\n`);

      // Category breakdown
      const breakdown: Record<string, number> = {};
      for (const f of allFiles) {
        const cat = categorizeFile(f);
        breakdown[cat] = (breakdown[cat] || 0) + 1;
      }
      if (VERBOSE) {
        log('Category breakdown:');
        for (const [cat, count] of Object.entries(breakdown)) {
          log(`  ${cat}: ${count}`);
        }
        log('');
      }
    } catch (e) {
      log(`⚠ ImageKit scan failed: ${(e as Error).message}`);
      log('  Ensure IMAGEKIT_PRIVATE_KEY is set correctly\n');
    }
  } else {
    log('⚠ No IMAGEKIT_PRIVATE_KEY — skipping scan, using path-based mapping\n');
  }

  // Sync all collections
  await syncDestinations(allFiles);
  await syncSimpleCollection(COLLECTIONS.EVENTS, 'Events', 'image', allFiles, 'events');
  await syncSimpleCollection(COLLECTIONS.FOOD, 'Food', 'image', allFiles, 'food');
  await syncSimpleCollection(COLLECTIONS.EXPERIENCES, 'Experiences', 'image', allFiles, 'experiences');
  await syncSimpleCollection(COLLECTIONS.ITINERARIES, 'Itineraries', 'heroImage', allFiles, 'destinations');
  await syncSimpleCollection(COLLECTIONS.STAYS, 'Stays', 'image', allFiles, 'stays');
  await syncSimpleCollection(COLLECTIONS.GUIDES, 'Guides', 'image', allFiles, 'general');

  // Summary
  log(`\n${'─'.repeat(50)}`);
  log(`${DRY_RUN ? '🔍 DRY RUN' : '✓'} Sync complete`);
  log(`  Hero images: ${stats.heroImages}`);
  log(`  Galleries enriched: ${stats.galleries}`);
  log(`  OG images: ${stats.ogImages}`);
  log(`  Gallery docs created: ${stats.galleryDocs}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
