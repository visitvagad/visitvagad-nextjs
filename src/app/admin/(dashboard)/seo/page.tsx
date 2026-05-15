import type { Metadata } from 'next';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import { AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import { requireRole } from '@/lib/auth';

export const metadata: Metadata = { title: 'SEO' };

interface SeoAuditItem {
  $id: string;
  title: string;
  slug: string;
  collection: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string;
  score: number;
  issues: string[];
}

function auditSeo(doc: {
  $id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoOgImage?: string;
}, collection: string): SeoAuditItem {
  const issues: string[] = [];
  let score = 0;
  const total = 4;

  const seoTitle = doc.seoTitle || '';
  const seoDescription = doc.seoDescription || '';
  const seoKeywords = doc.seoKeywords || '';
  const seoOgImage = doc.seoOgImage || '';

  if (seoTitle) { score++; } else { issues.push('Missing meta title'); }
  if (seoDescription) { score++; } else { issues.push('Missing meta description'); }
  if (seoDescription && seoDescription.length > 160) { issues.push('Description too long (>160 chars)'); }
  if (seoTitle && seoTitle.length > 60) { issues.push('Title too long (>60 chars)'); }
  if (seoKeywords) { score++; } else { issues.push('Missing keywords'); }
  if (seoOgImage) { score++; } else { issues.push('Missing OG image'); }

  return {
    $id: doc.$id,
    title: doc.title,
    slug: doc.slug,
    collection,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoOgImage,
    score: Math.round((score / total) * 100),
    issues,
  };
}

async function getSeoAudit(): Promise<SeoAuditItem[]> {
  try {
    const [destinations, events, food] = await Promise.all([
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
        Query.equal('status', 'published'),
        Query.limit(50),
        Query.select(['$id', 'title', 'slug', 'seoTitle', 'seoDescription', 'seoKeywords', 'seoOgImage']),
      ]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
        Query.equal('status', 'published'),
        Query.limit(50),
        Query.select(['$id', 'title', 'slug', 'seoTitle', 'seoDescription']),
      ]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [
        Query.equal('status', 'published'),
        Query.limit(50),
        Query.select(['$id', 'title', 'slug', 'seoTitle', 'seoDescription']),
      ]),
    ]);

    const items: SeoAuditItem[] = [
      ...destinations.documents.map((d) => auditSeo(d as unknown as { $id: string; title: string; slug: string; seoTitle?: string; seoDescription?: string; seoKeywords?: string; seoOgImage?: string }, 'destinations')),
      ...events.documents.map((d) => auditSeo(d as unknown as { $id: string; title: string; slug: string; seoTitle?: string; seoDescription?: string }, 'events')),
      ...food.documents.map((d) => auditSeo(d as unknown as { $id: string; title: string; slug: string; seoTitle?: string; seoDescription?: string }, 'food')),
    ];

    // Sort by score ascending (worst first)
    return items.sort((a, b) => a.score - b.score);
  } catch {
    return [];
  }
}

export default async function AdminSeoPage() {
  await requireRole('editor');
  const audit = await getSeoAudit();

  const perfect = audit.filter((i) => i.score === 100).length;
  const needsWork = audit.filter((i) => i.score < 100).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">SEO Management</h1>
        <p className="mt-1 text-sm text-text-muted">Audit and improve search visibility for published content.</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <Search size={16} className="text-deep-teal" />
          <span className="text-sm text-text-secondary">Total Audited</span>
          <span className="ml-auto text-lg font-semibold text-text-primary">{audit.length}</span>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-sm text-text-secondary">Complete</span>
          <span className="ml-auto text-lg font-semibold text-text-primary">{perfect}</span>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <AlertTriangle size={16} className="text-amber-500" />
          <span className="text-sm text-text-secondary">Needs Work</span>
          <span className="ml-auto text-lg font-semibold text-text-primary">{needsWork}</span>
        </div>
      </div>

      {/* Audit Table */}
      {audit.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-text-muted text-sm">No published content to audit. Publish content first.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left px-5 py-3 font-medium text-text-muted">Content</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted">Score</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden md:table-cell">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {audit.map((item) => (
                <tr key={`${item.collection}-${item.$id}`} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/${item.collection}/${item.$id}`}
                      className="font-medium text-text-primary hover:text-deep-teal"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5">/{item.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary capitalize hidden sm:table-cell">
                    {item.collection}
                  </td>
                  <td className="px-5 py-3.5">
                    <ScoreBadge score={item.score} />
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {item.issues.length === 0 ? (
                      <span className="text-emerald-600 text-xs">All good</span>
                    ) : (
                      <ul className="space-y-0.5">
                        {item.issues.map((issue) => (
                          <li key={issue} className="text-xs text-amber-600 flex items-center gap-1">
                            <AlertTriangle size={10} /> {issue}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score === 100 ? 'bg-emerald-50 text-emerald-700' :
    score >= 50 ? 'bg-amber-50 text-amber-700' :
    'bg-red-50 text-red-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {score}%
    </span>
  );
}
