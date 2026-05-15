'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  UtensilsCrossed,
  Image,
  Route,
  Users,
  Search,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  ExternalLink,
  Plus,
  User,
} from 'lucide-react';
import { useAdmin } from '@/providers/admin-provider';
import type { Permission } from '@/types/admin';

/* ─── Types ─── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: Permission;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/* ─── Navigation Config ─── */
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Content',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
      { label: 'Destinations', href: '/admin/destinations', icon: <MapPin size={18} /> },
      { label: 'Events', href: '/admin/events', icon: <Calendar size={18} /> },
      { label: 'Food', href: '/admin/food', icon: <UtensilsCrossed size={18} /> },
      { label: 'Itineraries', href: '/admin/itineraries', icon: <Route size={18} /> },
    ],
  },
  {
    label: 'Assets',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: <Image size={18} /> },
      { label: 'SEO', href: '/admin/seo', icon: <Search size={18} />, permission: 'canManageSEO' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Users', href: '/admin/users', icon: <Users size={18} />, permission: 'canManageUsers' },
      { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} />, permission: 'canManageSettings' },
    ],
  },
];

/* ─── Helpers ─── */
function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href);
}

/* ─── Breadcrumbs ─── */
function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-text-muted">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-border-strong" />}
          {i === crumbs.length - 1 ? (
            <span className="text-text-primary font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-deep-teal transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Account Dropdown ─── */
function AccountDropdown() {
  const { userName, userEmail, role } = useAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-alt transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="w-7 h-7 rounded-full bg-deep-teal/10 flex items-center justify-center">
          <User size={14} className="text-deep-teal" />
        </span>
        <ChevronDown size={14} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-text-primary truncate">{userName}</p>
            <p className="text-xs text-text-muted truncate">{userEmail}</p>
            <p className="text-xs text-deep-teal capitalize mt-0.5">{role.replace('_', ' ')}</p>
          </div>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-alt transition-colors"
          >
            <ExternalLink size={14} /> View site
          </Link>
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar Content ─── */
function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { can } = useAdmin();

  return (
    <>
      {/* Brand */}
      <div className="p-5 border-b border-border">
        <Link href="/admin" className="text-lg font-bold text-deep-teal tracking-tight" onClick={onNavigate}>
          VV Editorial
        </Link>
      </div>

      {/* Quick Action */}
      <div className="px-3 pt-3">
        <Link
          href="/admin/destinations/new"
          onClick={onNavigate}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-deep-teal bg-deep-teal/6 hover:bg-deep-teal/12 rounded-xl transition-colors"
        >
          <Plus size={16} /> New Content
        </Link>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 px-3 pt-4 pb-3 overflow-y-auto" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => !item.permission || can(item.permission));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} className="mb-4">
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted/70">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? 'bg-deep-teal/8 text-deep-teal'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );
}

/* ─── Shell ─── */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface-alt">
      {/* Desktop Sidebar */}
      <aside className="w-60 shrink-0 bg-surface border-r border-border hidden md:flex flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-surface border-r border-border z-50 flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-text-muted hover:text-text-primary"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-5 sm:px-8 h-14 bg-surface/80 backdrop-blur-sm border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Breadcrumbs pathname={pathname} />
          <div className="ml-auto">
            <AccountDropdown />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
