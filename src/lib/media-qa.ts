/**
 * Media QA System for VisitVagad
 * Validates content quality: broken images, missing alt text, SEO completeness.
 */
import { adminDb } from './appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from './appwrite-schema';
import { Query } from 'node-appwrite';

export interface MediaIssue {
  type: 'broken-image' | 'missing-alt' | 'missing-og' | 'missing-seo' | 'short-description';
  severity: 'error' | 'warning';
  collection: string;
  documentId: string;
  title: string;
  field: string;
  message: string;
}

export interface QAReport {
  issues: MediaIssue[];
  stats: { total: number; errors: number; warnings: number; passed: number };
  timestamp: string;
}

/** Run full media QA audit across all collections */
export async function runMediaQA(): Promise<QAReport> {
  const issues: MediaIssue[] = [];

  const [destinations, events, food] = await Promise.all([
    adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(200)]).catch(() => ({ documents: [] })),
    adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(200)]).catch(() => ({ documents: [] })),
    adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [Query.limit(200)]).catch(() => ({ documents: [] })),
  ]);

  // Audit destinations
  for (const doc of destinations.documents) {
    const d = doc as Record<string, unknown>;
    if (!d.heroImage) {
      issues.push({ type: 'broken-image', severity: 'error', collection: 'destinations', documentId: d.$id as string, title: d.title as string, field: 'heroImage', message: 'Missing hero image' });
    }
    if (!d.seoDescription && !d.summary) {
      issues.push({ type: 'missing-seo', severity: 'warning', collection: 'destinations', documentId: d.$id as string, title: d.title as string, field: 'seoDescription', message: 'Missing SEO description' });
    }
    if (!d.seoOgImage && !d.heroImage) {
      issues.push({ type: 'missing-og', severity: 'warning', collection: 'destinations', documentId: d.$id as string, title: d.title as string, field: 'seoOgImage', message: 'Missing OG image' });
    }
    if (d.summary && (d.summary as string).length < 50) {
      issues.push({ type: 'short-description', severity: 'warning', collection: 'destinations', documentId: d.$id as string, title: d.title as string, field: 'summary', message: 'Summary too short (< 50 chars)' });
    }
    // Check gallery alt text
    try {
      const gallery = JSON.parse((d.gallery as string) || '[]') as Array<{ alt?: string }>;
      const missingAlt = gallery.filter(g => !g.alt).length;
      if (missingAlt > 0) {
        issues.push({ type: 'missing-alt', severity: 'warning', collection: 'destinations', documentId: d.$id as string, title: d.title as string, field: 'gallery', message: `${missingAlt} gallery image(s) missing alt text` });
      }
    } catch { /* skip parse errors */ }
  }

  // Audit events
  for (const doc of events.documents) {
    const d = doc as Record<string, unknown>;
    if (!d.image) {
      issues.push({ type: 'broken-image', severity: 'error', collection: 'events', documentId: d.$id as string, title: d.title as string, field: 'image', message: 'Missing event image' });
    }
    if ((d.description as string || '').length < 50) {
      issues.push({ type: 'short-description', severity: 'warning', collection: 'events', documentId: d.$id as string, title: d.title as string, field: 'description', message: 'Description too short (< 50 chars)' });
    }
  }

  // Audit food
  for (const doc of food.documents) {
    const d = doc as Record<string, unknown>;
    if (!d.image) {
      issues.push({ type: 'broken-image', severity: 'error', collection: 'food', documentId: d.$id as string, title: d.title as string, field: 'image', message: 'Missing food image' });
    }
    if ((d.description as string || '').length < 50) {
      issues.push({ type: 'short-description', severity: 'warning', collection: 'food', documentId: d.$id as string, title: d.title as string, field: 'description', message: 'Description too short (< 50 chars)' });
    }
  }

  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const total = destinations.documents.length + events.documents.length + food.documents.length;

  return {
    issues,
    stats: { total, errors, warnings, passed: total - new Set(issues.map(i => i.documentId)).size },
    timestamp: new Date().toISOString(),
  };
}
