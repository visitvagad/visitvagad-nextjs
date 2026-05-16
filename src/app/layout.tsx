import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://visitvagad.com'),
  title: {
    default: 'VisitVagad — Discover Rajasthan\'s Vagad Region',
    template: '%s | VisitVagad',
  },
  description:
    'Explore the sun-drenched heritage of Banswara and Dungarpur. Tribal culture, eco-tourism, festivals, food, and immersive storytelling from Rajasthan\'s Vagad region.',
  keywords: [
    'Vagad',
    'Banswara',
    'Dungarpur',
    'Rajasthan tourism',
    'tribal culture',
    'eco-tourism',
    'Bhil heritage',
    'Mangarh',
    'Beneshwar',
  ],
  alternates: { canonical: 'https://visitvagad.com' },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'VisitVagad',
    title: 'VisitVagad — Discover Rajasthan\'s Vagad Region',
    description:
      'Explore the sun-drenched heritage of Banswara and Dungarpur. Tribal culture, eco-tourism, festivals, food, and immersive storytelling.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'VisitVagad — Discover Rajasthan\'s Vagad Region' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisitVagad — Discover Rajasthan\'s Vagad Region',
    description: 'Explore the sun-drenched heritage of Banswara and Dungarpur.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'theme-color': '#1a5c4c',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-text-primary antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-deep-teal focus:text-off-white focus:rounded-xl focus:text-sm focus:font-medium">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
