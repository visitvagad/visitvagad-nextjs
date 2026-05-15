import type { Metadata } from 'next';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import { MapPin, Calendar, UtensilsCrossed, Image, FileText, Star } from 'lucide-react';
import { adminDb, adminStorage } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS, BUCKET_ID } from '@/lib/appwrite-schema';
import { StatusBadge } from '@/components/admin/form-components';
import type { ContentStatus } from '@/types/admin';

export const metadata: Metadata = { title: 'Dashboard' };

async function getStats() {
  try {
    const [destinations, events, food, media] = await Promise.all([
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [Query.limit(1)]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(1)]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, [Query.limit(1)]),
      adminStorage.listFiles(BUCKET_ID, [Query.limit(1)]),
    ]);

    const [drafts, published, featured] = await Promise.all([
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
        Query.equal('status', 'draft'), Query.limit(1),
      ]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
        Query.equal('status', 'published'), Query.limit(1),
      ]),
      adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
        Query.equal('status', 'featured'), Query.limit(1),
      ]),
    ]);

    return {
      destinations: destinations.total,
      events: events.total,
      food: food.total,
      media: media.total,
      drafts: drafts.total,
      published: published.total,
      featured: featured.total,
    };
  } catch {
    return { destinations: 0, events: 0, food: 0, media: 0, drafts: 0, published: 0, featured: 0 };
  }
}

async function getRecentContent() {
  try {
    const docs = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, [
      Query.orderDesc('$updatedAt'),
      Query.limit(8),
      Query.select(['$id', 'title', 'status', '$updatedAt', 'district', 'updatedBy']),
    ]);
    return docs.documents as unknown as Array<{
      $id: string;
      title: string;
      status: ContentStatus;
      $updatedAt: string;
      district: string;
      updatedBy: string | null;
    }>;
  } catch {
    return [];
  }
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentContent()]);

  const cards = [
    { label: 'Destinations', count: stats.destinations, href: '/admin/destinations', icon: <MapPin size={18} /> },
    { label: 'Events', count: stats.events, href: '/admin/events', icon: <Calendar size={18} /> },
    { label: 'Food', count: stats.food, href: '/admin/food', icon: <UtensilsCrossed size={18} /> },
    { label: 'Media Files', count: stats.media, href: '/admin/media', icon: <Image size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Editorial Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">Content overview for Vagad tourism platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-deep-teal/30 transition-colors"
          >
            <span className="p-2 rounded-xl bg-deep-teal/8 text-deep-teal">{card.icon}</span>
            <div>
              <p className="text-sm text-text-muted">{card.label}</p>
              <p className="text-2xl font-bold text-text-primary">{card.count}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <FileText size={16} className="text-stone" />
          <span className="text-sm text-text-secondary">Drafts</span>
          <span className="ml-auto text-lg font-semibold text-text-primary">{stats.drafts}</span>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <MapPin size={16} className="text-emerald-600" />
          <span className="text-sm text-text-secondary">Published</span>
          <span className="ml-auto text-lg font-semibold text-text-primary">{stats.published}</span>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <Star size={16} className="text-amber-500" />
          <span className="text-sm text-text-secondary">Featured</span>
          <span className="ml-auto text-lg font-semibold text-text-primary">{stats.featured}</span>
        </div>
      </div>

      {/* Recent Activity */}
      {recent.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((doc) => (
              <li key={doc.$id}>
                <Link
                  href={`/admin/destinations/${doc.$id}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-alt transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{doc.title}</p>
                    <p className="text-xs text-text-muted">
                      {doc.district} · {timeAgo(doc.$updatedAt)}
                      {doc.updatedBy && <span className="ml-1">· edited</span>}
                    </p>
                  </div>
                  <StatusBadge status={doc.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
