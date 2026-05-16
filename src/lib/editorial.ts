/**
 * Editorial Standards — Publish Readiness Scoring for VisitVagad
 * Scores content on image quality, SEO completeness, storytelling depth, and caption consistency.
 */
import { adminDb } from './appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from './appwrite-schema';
import { Query } from 'node-appwrite';

export interface ReadinessCheck {
  label: string;
  passed: boolean;
  weight: number;
}

export interface ContentScore {
  id: string;
  title: string;
  collection: string;
  status: string;
  score: number; // 0-100
  checks: ReadinessCheck[];
  ready: boolean; // score >= 70
}

export interface EditorialReport {
  items: ContentScore[];
  averageScore: number;
  readyCount: number;
  totalCount: number;
  timestamp: string;
}

function scoreDestination(doc: Record<string, unknown>): ContentScore {
  const checks: ReadinessCheck[] = [
    { label: 'Has hero image', passed: !!(doc.heroImage), weight: 15 },
    { label: 'Title length (10-80 chars)', passed: (doc.title as string || '').length >= 10 && (doc.title as string || '').length <= 80, weight: 10 },
    { label: 'Summary (50+ chars)', passed: (doc.summary as string || '').length >= 50, weight: 10 },
    { label: 'Story content (200+ chars)', passed: (doc.story as string || '').length >= 200, weight: 15 },
    { label: 'Has highlights', passed: (() => { try { return JSON.parse((doc.highlights as string) || '[]').length > 0; } catch { return false; } })(), weight: 10 },
    { label: 'Has gallery (2+ images)', passed: (() => { try { return JSON.parse((doc.gallery as string) || '[]').length >= 2; } catch { return false; } })(), weight: 10 },
    { label: 'SEO title set', passed: !!(doc.seoTitle), weight: 10 },
    { label: 'SEO description set', passed: !!(doc.seoDescription), weight: 10 },
    { label: 'Best time specified', passed: !!(doc.bestTime), weight: 5 },
    { label: 'Coordinates set', passed: !!(doc.lat) && !!(doc.lng), weight: 5 },
  ];

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
  return { id: doc.$id as string, title: doc.title as string, collection: 'destinations', status: doc.status as string, score, checks, ready: score >= 70 };
}

function scoreEvent(doc: Record<string, unknown>): ContentScore {
  const checks: ReadinessCheck[] = [
    { label: 'Has image', passed: !!(doc.image), weight: 20 },
    { label: 'Title (10+ chars)', passed: (doc.title as string || '').length >= 10, weight: 15 },
    { label: 'Description (80+ chars)', passed: (doc.description as string || '').length >= 80, weight: 20 },
    { label: 'Date set', passed: !!(doc.date), weight: 15 },
    { label: 'Location specified', passed: !!(doc.location), weight: 15 },
    { label: 'Category set', passed: !!(doc.category), weight: 15 },
  ];

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
  return { id: doc.$id as string, title: doc.title as string, collection: 'events', status: doc.status as string, score, checks, ready: score >= 70 };
}

function scoreFood(doc: Record<string, unknown>): ContentScore {
  const checks: ReadinessCheck[] = [
    { label: 'Has image', passed: !!(doc.image), weight: 25 },
    { label: 'Title (5+ chars)', passed: (doc.title as string || '').length >= 5, weight: 15 },
    { label: 'Description (60+ chars)', passed: (doc.description as string || '').length >= 60, weight: 25 },
    { label: 'Origin specified', passed: !!(doc.origin), weight: 15 },
    { label: 'Type categorized', passed: !!(doc.type), weight: 20 },
  ];

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
  return { id: doc.$id as string, title: doc.title as string, collection: 'food', status: doc.status as string, score, checks, ready: score >= 70 };
}

/** Run editorial readiness audit */
export async function runEditorialAudit(): Promise<EditorialReport> {
  const [destinations, events, food] = await Promise.all([
    adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(200)]).catch(() => ({ documents: [] })),
    adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(200)]).catch(() => ({ documents: [] })),
    adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [Query.limit(200)]).catch(() => ({ documents: [] })),
  ]);

  const items: ContentScore[] = [
    ...destinations.documents.map(d => scoreDestination(d as unknown as Record<string, unknown>)),
    ...events.documents.map(d => scoreEvent(d as unknown as Record<string, unknown>)),
    ...food.documents.map(d => scoreFood(d as unknown as Record<string, unknown>)),
  ];

  const totalCount = items.length;
  const readyCount = items.filter(i => i.ready).length;
  const averageScore = totalCount > 0 ? Math.round(items.reduce((s, i) => s + i.score, 0) / totalCount) : 0;

  return { items: items.sort((a, b) => a.score - b.score), averageScore, readyCount, totalCount, timestamp: new Date().toISOString() };
}
