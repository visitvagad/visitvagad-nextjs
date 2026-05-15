import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'VV Editorial', template: '%s — VV Editorial' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
