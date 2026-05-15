/** Admin role system — editorial-focused, minimal */
export type AdminRole = 'super_admin' | 'editor' | 'contributor';

/** Role permissions map */
export const ROLE_PERMISSIONS = {
  super_admin: {
    canPublish: true,
    canManageUsers: true,
    canManageSettings: true,
    canManageSEO: true,
    canDeleteContent: true,
    canFeatureContent: true,
    canManageMedia: true,
    canEditAllContent: true,
  },
  editor: {
    canPublish: true,
    canManageUsers: false,
    canManageSettings: false,
    canManageSEO: true,
    canDeleteContent: true,
    canFeatureContent: true,
    canManageMedia: true,
    canEditAllContent: true,
  },
  contributor: {
    canPublish: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageSEO: false,
    canDeleteContent: false,
    canFeatureContent: false,
    canManageMedia: true,
    canEditAllContent: false,
  },
} as const;

export type Permission = keyof (typeof ROLE_PERMISSIONS)['super_admin'];

/** Check if a role has a specific permission */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

/** Sidebar navigation item */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiredPermission?: Permission;
}

/** Content status for workflow */
export type ContentStatus = 'draft' | 'published' | 'featured' | 'archived';

/** Status badge config */
export const STATUS_CONFIG: Record<ContentStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-stone/10 text-stone' },
  published: { label: 'Published', className: 'bg-emerald-50 text-emerald-700' },
  featured: { label: 'Featured', className: 'bg-amber-50 text-amber-700' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-500' },
};
