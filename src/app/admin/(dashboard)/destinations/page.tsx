import type { Metadata } from 'next';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import { Plus } from 'lucide-react';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import { StatusBadge } from '@/components/admin/form-components';
import { DestinationListClient } from '@/components/admin/destination-list-client';
import type { ContentStatus } from '@/types/admin';

export const metadata: Metadata = { title: 'Destinations' };

interface Props {
  searchParams: Promise<{ status?: string; district?: string }>;
}

interface DestinationRow {
  $id: string;
  title: string;
  slug: string;
  district: string;
  status: ContentStatus;
  featured: boolean;
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
  $updatedAt: string;
}

async function getDestinations(status?: string, district?: string): Promise<DestinationRow[]> {
  try {
    const queries: string[] = [Query.orderDesc('$updatedAt'), Query.limit(100)];
    if (status && ['draft', 'published', 'featured', 'archived'].includes(status)) {
      queries.push(Query.equal('status', status));
    }
    if (district && ['Banswara', 'Dungarpur'].includes(district)) {
      queries.push(Query.equal('district', district));
    }
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.DESTINATIONS, queries);
    return res.documents as unknown as DestinationRow[];
  } catch {
    return [];
  }
}

export default async function AdminDestinationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const destinations = await getDestinations(params.status, params.district);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Destinations</h1>
          <p className="mt-1 text-sm text-text-muted">{destinations.length} destinations</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-teal text-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors"
        >
          <Plus size={16} /> New Destination
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterLink href="/admin/destinations" active={!params.status && !params.district} label="All" />
        <FilterLink href="/admin/destinations?status=draft" active={params.status === 'draft'} label="Drafts" />
        <FilterLink href="/admin/destinations?status=published" active={params.status === 'published'} label="Published" />
        <FilterLink href="/admin/destinations?status=featured" active={params.status === 'featured'} label="Featured" />
        <FilterLink href="/admin/destinations?status=archived" active={params.status === 'archived'} label="Archived" />
        <span className="w-px h-6 bg-border self-center mx-1" />
        <FilterLink href="/admin/destinations?district=Banswara" active={params.district === 'Banswara'} label="Banswara" />
        <FilterLink href="/admin/destinations?district=Dungarpur" active={params.district === 'Dungarpur'} label="Dungarpur" />
      </div>

      {/* Client-side enhanced list */}
      <DestinationListClient destinations={destinations} />
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
