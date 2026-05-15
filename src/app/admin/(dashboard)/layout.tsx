import { redirect } from 'next/navigation';
import { getUser, getUserRole } from '@/lib/auth';
import { AdminProvider } from '@/providers/admin-provider';
import { AdminShell } from '@/components/admin/admin-shell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/admin/login');

  const role = await getUserRole();
  if (!role) redirect('/admin/login');

  return (
    <AdminProvider role={role} userName={user.name || user.email} userEmail={user.email}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
