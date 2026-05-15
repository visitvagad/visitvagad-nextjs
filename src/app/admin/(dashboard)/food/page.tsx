import type { Metadata } from 'next';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import { Plus } from 'lucide-react';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import { StatusBadge } from '@/components/admin/form-components';
import type { ContentStatus } from '@/types/admin';

export const metadata: Metadata = { title: 'Food' };

interface Props {
  searchParams: Promise<{ status?: string; type?: string }>;
}

async function getFood(status?: string, type?: string) {
  try {
    const queries: string[] = [Query.orderDesc('$updatedAt'), Query.limit(50)];
    if (status && ['draft', 'published', 'featured', 'archived'].includes(status)) {
      queries.push(Query.equal('status', status));
    }
    if (type && ['dish', 'sweet', 'beverage', 'snack'].includes(type)) {
      queries.push(Query.equal('type', type));
    }
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.FOOD, queries);
    return res.documents as unknown as Array<{
      $id: string;
      title: string;
      slug: string;
      type: string;
      origin: string;
      status: ContentStatus;
    }>;
  } catch {
    return [];
  }
}

export default async function AdminFoodPage({ searchParams }: Props) {
  const params = await searchParams;
  const food = await getFood(params.status, params.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Food</h1>
          <p className="mt-1 text-sm text-text-muted">{food.length} items</p>
        </div>
        <Link
          href="/admin/food/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-teal text-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors"
        >
          <Plus size={16} /> New Food
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink href="/admin/food" active={!params.status && !params.type} label="All" />
        <FilterLink href="/admin/food?status=draft" active={params.status === 'draft'} label="Drafts" />
        <FilterLink href="/admin/food?status=published" active={params.status === 'published'} label="Published" />
        <span className="w-px h-6 bg-border self-center mx-1" />
        <FilterLink href="/admin/food?type=dish" active={params.type === 'dish'} label="Dishes" />
        <FilterLink href="/admin/food?type=sweet" active={params.type === 'sweet'} label="Sweets" />
        <FilterLink href="/admin/food?type=beverage" active={params.type === 'beverage'} label="Beverages" />
        <FilterLink href="/admin/food?type=snack" active={params.type === 'snack'} label="Snacks" />
      </div>

      {food.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-text-muted text-sm">No food items found.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left px-5 py-3 font-medium text-text-muted">Title</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden md:table-cell">Origin</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {food.map((item) => (
                <tr key={item.$id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-text-primary">{item.title}</span>
                    <p className="text-xs text-text-muted mt-0.5">/{item.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary capitalize hidden sm:table-cell">{item.type}</td>
                  <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">{item.origin || '—'}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
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
