import type { Metadata } from 'next';
import { Query } from 'node-appwrite';
import { adminDb } from '@/lib/appwrite-admin';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-schema';
import { requireRole } from '@/lib/auth';

export const metadata: Metadata = { title: 'Settings' };

async function getSettings() {
  try {
    const res = await adminDb.listDocuments(DATABASE_ID, COLLECTIONS.SETTINGS, [Query.limit(50)]);
    return res.documents as unknown as Array<{ $id: string; key: string; value: string }>;
  } catch {
    return [];
  }
}

export default async function AdminSettingsPage() {
  await requireRole('super_admin');
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Platform configuration and preferences.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-semibold text-text-primary">Platform Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-muted">Platform</p>
            <p className="font-medium text-text-primary">VisitVagad</p>
          </div>
          <div>
            <p className="text-text-muted">Region</p>
            <p className="font-medium text-text-primary">Vagad (Banswara & Dungarpur)</p>
          </div>
          <div>
            <p className="text-text-muted">Backend</p>
            <p className="font-medium text-text-primary">Appwrite</p>
          </div>
          <div>
            <p className="text-text-muted">Framework</p>
            <p className="font-medium text-text-primary">Next.js 15</p>
          </div>
        </div>
      </div>

      {settings.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Stored Settings</h2>
          <div className="space-y-3">
            {settings.map((s) => (
              <div key={s.$id} className="flex items-start gap-4 text-sm">
                <code className="text-xs bg-surface-alt px-2 py-1 rounded-lg text-deep-teal font-mono">{s.key}</code>
                <p className="text-text-secondary flex-1 break-all">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
