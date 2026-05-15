import type { Metadata } from 'next';
import { Query } from 'node-appwrite';
import { Shield, UserPlus } from 'lucide-react';
import { adminUsers } from '@/lib/appwrite-admin';
import { requireRole } from '@/lib/auth';
import type { AdminRole } from '@/types/admin';

export const metadata: Metadata = { title: 'Users' };

function getRoleFromLabels(labels: string[]): AdminRole {
  if (labels.includes('super_admin') || labels.includes('admin')) return 'super_admin';
  if (labels.includes('editor')) return 'editor';
  if (labels.includes('contributor')) return 'contributor';
  return 'contributor';
}

const ROLE_STYLES: Record<AdminRole, string> = {
  super_admin: 'bg-purple-50 text-purple-700',
  editor: 'bg-blue-50 text-blue-700',
  contributor: 'bg-gray-100 text-gray-600',
};

async function getUsers() {
  try {
    const res = await adminUsers.list([Query.limit(50), Query.orderDesc('$createdAt')]);
    return res.users.map((u) => ({
      $id: u.$id,
      name: u.name,
      email: u.email,
      role: getRoleFromLabels(u.labels || []),
      status: u.status ? 'active' : 'inactive',
      $createdAt: u.$createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  await requireRole('super_admin');
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="mt-1 text-sm text-text-muted">{users.length} team members</p>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-teal text-white text-sm font-medium rounded-xl opacity-50 cursor-not-allowed"
          title="Invite users via Appwrite Console"
        >
          <UserPlus size={16} /> Invite User
        </button>
      </div>

      <p className="text-xs text-text-muted bg-surface-alt border border-border rounded-xl px-4 py-3">
        <Shield size={14} className="inline mr-1.5 -mt-0.5" />
        User creation and role assignment is managed via Appwrite Console. Add labels: <code className="text-deep-teal">super_admin</code>, <code className="text-deep-teal">editor</code>, or <code className="text-deep-teal">contributor</code>.
      </p>

      {users.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-text-muted text-sm">No users found.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left px-5 py-3 font-medium text-text-muted">User</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden sm:table-cell">Role</th>
                <th className="text-left px-5 py-3 font-medium text-text-muted hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.$id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-text-primary">{user.name || 'Unnamed'}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[user.role]}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">
                    {new Date(user.$createdAt).toLocaleDateString()}
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
