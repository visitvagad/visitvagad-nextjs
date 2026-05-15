import type { Metadata } from 'next';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import { Plus } from 'lucide-react';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import { StatusBadge } from '@/components/admin/form-components';
import type { ContentStatus } from '@/types/admin';

export const metadata: Metadata = { title: 'Events' };

interface Props {
  searchParams: Promise<{ status?: string }>;
}

async function getEvents(status?: string) {
  try {
    const queries: string[] = [Query.orderDesc('$updatedAt'), Query.limit(50)];
    if (status && ['draft', 'published', 'featured', 'archived'].includes(status)) {
      queries.push(Query.equal('status', status));
    }
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, queries);
    return res.documents as unknown as Array<{
      $id: string;
      title: string;
      slug: string;
      category: string;
      district: string;
      date: string;
      status: ContentStatus;
    }>;
  } catch {
    return [];
  }
}

export default async function AdminEventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const events = await getEvents(params.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Events</h1>
          <p className="mt-1 text-sm text-text-muted">{events.length} events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-teal text-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors"
        >
          <Plus size={16} /> New Event
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink href="/admin/events" active={!params.status} label="All" />
        <FilterLink href="/admin/events?status=draft" active={params.status === 'draft'} label="Drafts" />
        <FilterLink href="/admin/events?status=published" active={params.status === 'published'} label="Published" />
        <FilterLink href="/admin/events?status=featured" active={params.status === 'featured'} label="Featured" />
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-text-muted text-sm">No events found.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left px-5 py-3 font-medium text-text-muted">Title</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((ev) => (
                <tr key={ev.$id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-text-primary">{ev.title}</span>
                    <p className="text-xs text-text-muted mt-0.5">{ev.district}</p>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary capitalize hidden sm:table-cell">{ev.category}</td>
                  <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">
                    {new Date(ev.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={ev.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        active
          ? 'bg-deep-teal/10 text-deep-teal'
          : 'text-text-muted hover:text-text-primary hover:bg-surface-alt border border-border'
      }`}
    >
      {label}
    </Link>
  );
}
