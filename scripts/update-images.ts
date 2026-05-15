/**
 * Update existing Appwrite documents with image URLs.
 * Run: npx tsx scripts/update-images.ts
 * Safe to re-run — only updates empty image fields.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Client, Databases, Query } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS } from '../src/lib/appwrite-schema';
import { PLACEHOLDER_IMAGES } from '../src/lib/images';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);
const db = new Databases(client);

async function main() {
  console.log('🖼️  Updating image URLs in database\n');

  let updated = 0;

  // Update destinations
  const dests = await db.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(100)]);
  for (const doc of dests.documents) {
    const slug = doc.slug as string;
    const img = PLACEHOLDER_IMAGES[slug as keyof typeof PLACEHOLDER_IMAGES];
    if (img && !doc.heroImage) {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.DESTINATIONS, doc.$id, { heroImage: img });
      console.log(`  ✓ destinations/${slug} → heroImage`);
      updated++;
    }
  }

  // Update events
  const events = await db.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(100)]);
  for (const doc of events.documents) {
    const slug = doc.slug as string;
    const img = PLACEHOLDER_IMAGES[slug as keyof typeof PLACEHOLDER_IMAGES];
    if (img && !doc.image) {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.EVENTS, doc.$id, { image: img });
      console.log(`  ✓ events/${slug} → image`);
      updated++;
    }
  }

  // Update food
  const food = await db.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [Query.limit(100)]);
  for (const doc of food.documents) {
    const slug = doc.slug as string;
    const img = PLACEHOLDER_IMAGES[slug as keyof typeof PLACEHOLDER_IMAGES];
    if (img && !doc.image) {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.FOOD, doc.$id, { image: img });
      console.log(`  ✓ food/${slug} → image`);
      updated++;
    }
  }

  // Update experiences
  const exps = await db.listDocuments(DATABASE_ID, COLLECTIONS.EXPERIENCES, [Query.limit(100)]);
  for (const doc of exps.documents) {
    const title = doc.title as string;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const img = PLACEHOLDER_IMAGES[slug as keyof typeof PLACEHOLDER_IMAGES];
    if (img && !doc.image) {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.EXPERIENCES, doc.$id, { image: img });
      console.log(`  ✓ experiences/${slug} → image`);
      updated++;
    }
  }

  // Update regions
  const regions = await db.listDocuments(DATABASE_ID, COLLECTIONS.REGIONS, [Query.limit(10)]);
  for (const doc of regions.documents) {
    const name = (doc.name as string).toLowerCase();
    const img = PLACEHOLDER_IMAGES[name as keyof typeof PLACEHOLDER_IMAGES];
    if (img && !doc.image) {
      await db.updateDocument(DATABASE_ID, COLLECTIONS.REGIONS, doc.$id, { image: img });
      console.log(`  ✓ regions/${name} → image`);
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} documents with images.`);
}

main().catch((e) => { console.error('Failed:', e.message); process.exit(1); });
