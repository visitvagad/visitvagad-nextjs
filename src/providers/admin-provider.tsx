'use client';

import { createContext, useContext } from 'react';
import type { AdminRole, Permission } from '@/types/admin';
import { hasPermission } from '@/types/admin';

interface AdminContextValue {
  role: AdminRole;
  userName: string;
  userEmail: string;
  can: (permission: Permission) => boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({
  role,
  userName,
  userEmail,
  children,
}: {
  role: AdminRole;
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const value: AdminContextValue = {
    role,
    userName,
    userEmail,
    can: (permission) => hasPermission(role, permission),
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
