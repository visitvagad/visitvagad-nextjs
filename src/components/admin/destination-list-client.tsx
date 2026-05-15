'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpDown, AlertCircle, Copy } from 'lucide-react';
import { StatusBadge, Input } from '@/components/admin/form-components';
import { updateDestinationStatus, createDestination } from '@/features/destinations/actions';
import type { ContentStatus } from '@/types/admin';

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

type SortKey = 'title' | '$updatedAt';

function getCompleteness(d: DestinationRow): { score: number; missing: string[] } {
  const missing: string[] = [];
  if (!d.heroImage) missing.push('Hero image');
  if (!d.seoTitle) missing.push('SEO title');
  if (!d.seoDescription) missing.push('SEO description');
  const total = 3;
  return { score: Math.round(((total - missing.length) / total) * 100), missing };
}

export function DestinationListClient({ destinations }: { destinations: DestinationRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('$updatedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const filtered = useMemo(() => {
    let items = destinations;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((d) => d.title.toLowerCase().includes(q) || d.slug.includes(q));
    }
    items = [...items].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
    return items;
  }, [destinations, search, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === 'title'); }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((d) => d.$id)));
  }

  async function bulkAction(status: ContentStatus) {
    if (selected.size === 0) return;
    setBulkLoading(true);
    await Promise.all(Array.from(selected).map((id) => updateDestinationStatus(id, status)));
    setSelected(new Set());
    setBulkLoading(false);
    router.refresh();
  }

  async function duplicate(d: DestinationRow) {
    await createDestination({
      title: `${d.title} (Copy)`,
      slug: `${d.slug}-copy`,
      district: d.district,
      summary: '',
      status: 'draft' as ContentStatus,
    });
    router.refresh();
  }

  return (
    <>
      {/* Search + Bulk */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search destinations..." className="pl-9" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">{selected.size} selected</span>
            <button onClick={() => bulkAction('published')} disabled={bulkLoading} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium">Publish</button>
            <button onClick={() => bulkAction('archived')} disabled={bulkLoading} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium">Archive</button>
          </div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-text-muted text-sm">{search ? 'No results.' : 'No destinations found.'}</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="w-10 px-3 py-3">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" aria-label="Select all" />
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => toggleSort('title')} className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-text-primary">
                    Title <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted hidden sm:table-cell">District</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted hidden lg:table-cell">Completeness</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  <button onClick={() => toggleSort('$updatedAt')} className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-text-primary">
                    Updated <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => {
                const { score, missing } = getCompleteness(d);
                return (
                  <tr key={d.$id} className="hover:bg-surface-alt transition-colors">
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selected.has(d.$id)} onChange={() => toggleSelect(d.$id)} className="rounded" aria-label={`Select ${d.title}`} />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/destinations/${d.$id}`} className="font-medium text-text-primary hover:text-deep-teal">
                        {d.title}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">/{d.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{d.district}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {score === 100 ? (
                        <span className="text-xs text-emerald-600">Complete</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600" title={missing.join(', ')}>
                          <AlertCircle size={12} /> {score}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs hidden md:table-cell">
                      {timeAgo(d.$updatedAt)}
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => duplicate(d)} className="p-1 text-text-muted hover:text-deep-teal" title="Duplicate">
                        <Copy size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
