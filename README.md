<p align="center">
  <img src="public/icon-512.png" alt="VisitVagad" width="80" height="80" />
</p>

<h1 align="center">VisitVagad</h1>

<p align="center">
  <strong>A production-grade cinematic tourism platform for Rajasthan's Vagad region</strong><br/>
  <sub>Editorial publishing · Tourism discovery · Seasonal campaigns · Performance-first architecture</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-black?logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Appwrite-Cloud-FD366E?logo=appwrite" alt="Appwrite" />
  <img src="https://img.shields.io/badge/ImageKit-CDN-4A47A3" alt="ImageKit" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

<p align="center">
  <a href="https://visitvagad.com">Live Site</a> · 
  <a href="#quick-start">Quick Start</a> · 
  <a href="#architecture-overview">Architecture</a> · 
  <a href="#roadmap">Roadmap</a> ·
  <a href="AUDIT.md">Technical Audit</a>
</p>

---

## Project Overview

VisitVagad is a full-scale tourism technology platform engineered to document, preserve, and promote the cultural heritage of the Vagad region — Banswara and Dungarpur districts in southern Rajasthan. It operates as a complete digital ecosystem combining cinematic storytelling, editorial publishing workflows, and structured tourism discovery.

This is not a template, starter kit, or prototype. It is a production system with:

- **97+ source files** across a modular feature architecture
- **10 Appwrite collections** with full CRUD, validation, and caching
- **15 public routes** with server-rendered content and structured data
- **11 admin routes** with role-based access and editorial QA
- **5 seasonal campaign** landing pages with curated collections
- **Full SEO system** — sitemaps, JSON-LD, OG/Twitter cards, canonical URLs
- **Performance-hardened** — `next/image` throughout, ISR, preconnect hints, zero client JS by default

---

## Vision

> Elevate Vagad from India's least-documented tourism region to a world-class digital destination through premium storytelling and engineering excellence.

---

## Why VisitVagad Exists

### The Regional Tourism Problem

Vagad possesses extraordinary cultural assets — 1,000-year-old temples, tribal art traditions, sacred river confluences, monsoon landscapes, and living heritage that predates recorded history. Yet:

- **Zero dedicated digital presence** — no platform treats this region as a first-class destination
- **Scattered information** — tourism data exists only on generic aggregators as bullet points
- **No editorial depth** — rich stories reduced to 2-line descriptions on government portals
- **No discovery system** — travelers cannot find seasonal recommendations, itineraries, or local guides
- **No operational publishing** — content is static, outdated, and unmaintained

### The Solution

A purpose-built tourism ecosystem that treats regional heritage with the same engineering rigor and editorial quality as platforms serving major global destinations.

---

## Platform Goals

1. **Cultural preservation** — Document tribal traditions, heritage sites, and living culture before they fade
2. **Tourism enablement** — Provide travelers with actionable discovery tools (itineraries, stays, guides, seasonal campaigns)
3. **Editorial operations** — Enable a publishing team to maintain content quality at scale
4. **Performance excellence** — Deliver sub-second page loads on mobile networks in rural India
5. **SEO dominance** — Own search results for Vagad-related tourism queries
6. **Scalable architecture** — Support growth from 10 destinations to 100+ without architectural changes

---

## Technical Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Server-first** | All public pages are React Server Components. Zero client JS shipped by default. |
| **Content as infrastructure** | Structured data models, not free-form text. Every content type has schema validation. |
| **Progressive enhancement** | Core content works without JS. Bookmarks/animations are additive client features. |
| **Editorial quality gates** | Content must pass automated scoring (≥70/100) before publish-readiness. |
| **Image performance** | Every image flows through ImageKit CDN with responsive transforms. No raw uploads served. |
| **SEO by architecture** | Structured data, canonical URLs, and metadata are not afterthoughts — they're in the page composition pattern. |
| **Operational readiness** | Admin QA tools, media auditing, and editorial scoring are built-in, not bolted-on. |



---

## Feature Overview

### Public Tourism Platform
| Feature | Status | Description |
|---------|--------|-------------|
| Destination pages | ✅ Complete | Full editorial pages with hero, story, highlights, gallery, travel tips, nearby places |
| Events & festivals | ✅ Complete | Date-based event listings with JSON-LD Event schema |
| Food & cuisine | ✅ Complete | Regional food discovery with type categorization |
| Itineraries | ✅ Complete | Multi-day travel plans with day-by-day breakdowns |
| Stays | ✅ Complete | Accommodation discovery (hotel, eco-stay, heritage, homestay, guesthouse) |
| Seasonal campaigns | ✅ Complete | 5 curated campaign landing pages with featured destinations |
| Search | ✅ Complete | Full-text search across destinations, events, itineraries |
| Bookmarks | ✅ Complete | Client-side save/unsave with localStorage persistence |
| Recently viewed | ✅ Complete | Tracks last 10 viewed items |
| Social ecosystem | ✅ Complete | Instagram creatives grid, social CTAs, follow prompts |

### Editorial CMS
| Feature | Status | Description |
|---------|--------|-------------|
| Admin dashboard | ✅ Complete | Stats, recent activity, content counts |
| Destination editor | ✅ Complete | Full CRUD with gallery, highlights, SEO fields |
| Content lifecycle | ✅ Complete | Draft → Published → Featured → Archived |
| Media library | ✅ Complete | Upload, browse, delete, copy URL |
| Media QA | ✅ Complete | Automated broken image/alt text/SEO auditing |
| Editorial scoring | ✅ Complete | Weighted readiness scoring (70+ threshold) |
| SEO management | ✅ Complete | Per-item metadata, OG images, keywords |
| Role-based access | ✅ Complete | super_admin, editor, contributor with granular permissions |

### Infrastructure
| Feature | Status | Description |
|---------|--------|-------------|
| ISR caching | ✅ Complete | 60s revalidation with tag-based invalidation |
| Image CDN | ✅ Complete | ImageKit transforms with 6 presets |
| Structured data | ✅ Complete | JSON-LD on every page (5 schema types) |
| Dynamic sitemap | ✅ Complete | All published content indexed |
| Security headers | ✅ Complete | X-Frame-Options, CSP-adjacent, Referrer-Policy |
| Session auth | ✅ Complete | httpOnly cookies, middleware guards |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VISITVAGAD                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │  Next.js 15 │   │  Appwrite   │   │     ImageKit        │  │
│  │  App Router │◄─►│  Cloud      │   │     CDN             │  │
│  │  (Vercel)   │   │  (Frankfurt)│   │     (Global Edge)   │  │
│  └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘  │
│         │                  │                     │             │
│  Server Components   10 Collections        URL Transforms     │
│  + ISR (60s tags)    + File Storage        AVIF/WebP/Auto     │
│  + Server Actions    + Auth/Sessions       6 Presets           │
│  + Middleware        + Role Labels         Responsive srcSet   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PUBLIC ROUTES (15 pages)                      │  │
│  │  / · /destinations · /events · /food · /itineraries       │  │
│  │  /stays · /campaigns · /search · /culture · /plan-your-trip│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ADMIN CMS (11 routes)                         │  │
│  │  Dashboard · Destinations · Events · Food · Itineraries   │  │
│  │  Media · Media QA · Editorial · SEO · Users · Settings    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| App Router over Pages Router | Server Components, streaming, nested layouts, route groups |
| Appwrite over Firebase/Supabase | Self-hostable, document DB, built-in auth + storage, no vendor lock-in |
| ImageKit over Cloudinary | URL-based transforms, superior free tier, global CDN |
| `unstable_cache` with tags | Fine-grained ISR without full rebuilds |
| Server Actions for mutations | Type-safe, no API routes needed, automatic revalidation |
| Framer Motion (selective) | Only loaded in `'use client'` boundaries, not shipped to static pages |
| Zod at boundaries | Runtime validation shared between client forms and server actions |
| localStorage for engagement | No auth friction for bookmarks/recently-viewed |

---

## System Design

### Request Flow

```
Browser → Vercel Edge → Next.js Server Component
                              │
                              ├─ unstable_cache hit? → Return cached HTML
                              │
                              ├─ Cache miss → Appwrite SDK → Database query
                              │                                    │
                              │                              Transform → Cache (60s, tagged)
                              │
                              ├─ Image URLs → ImageKit CDN transform
                              │
                              └─ Stream HTML → Client (minimal hydration)
```

### Caching Architecture

| Layer | Strategy | TTL | Invalidation |
|-------|----------|-----|-------------|
| Server data | `unstable_cache` | 60s | Tag-based (`destinations`, `events`, etc.) |
| Static pages | `generateStaticParams` | Build-time + ISR | On-demand revalidation |
| Static assets | Immutable headers | 1 year | Content hash in filename |
| Images | ImageKit edge cache | Automatic | URL-based (new transform = new cache) |
| Client state | localStorage | Permanent | User action |

### Content Lifecycle

```
                    ┌─────────┐
                    │  Draft  │ ← Editor creates content
                    └────┬────┘
                         │ passes editorial score ≥70
                    ┌────▼─────┐
                    │Published │ ← Visible on site, indexed
                    └────┬─────┘
                         │ manually promoted
                    ┌────▼─────┐
                    │ Featured │ ← Homepage featured section
                    └────┬─────┘
                         │ soft delete
                    ┌────▼─────┐
                    │ Archived │ ← Hidden, restorable
                    └──────────┘
```

---

## Tech Stack

### Core

| Technology | Version | Role |
|-----------|---------|------|
| Next.js | 15.5.18 | Full-stack framework (App Router, Server Components, ISR) |
| React | 19.2.4 | UI rendering with Server/Client component model |
| TypeScript | 5.x | End-to-end type safety |
| Tailwind CSS | 4.x | Design system via `@theme` tokens |
| Framer Motion | 11.18 | Viewport-triggered animations |

### Backend

| Technology | Role |
|-----------|------|
| Appwrite Cloud | Document database, auth, file storage |
| node-appwrite 14.1 | Server SDK for admin operations |
| Zod 4.4 | Schema validation at all boundaries |

### Media

| Technology | Role |
|-----------|------|
| ImageKit | CDN with URL-based responsive transforms |
| Sharp | Build-time image processing |
| next/image | Optimized rendering with lazy loading + priority |

### Infrastructure

| Technology | Role |
|-----------|------|
| Vercel | Hosting, edge network, analytics, speed insights |
| Appwrite Cloud (Frankfurt) | Backend services |
| ImageKit CDN | Global image delivery |

### Developer Experience

| Tool | Role |
|------|------|
| tsx | TypeScript script runner for tooling |
| ESLint + eslint-config-next | Linting with accessibility rules |
| dotenv | Environment management |
| Lucide React | Icon system (tree-shakeable) |



---

## Frontend Architecture

### Design System

Built on Tailwind CSS 4 with semantic `@theme` tokens:

```css
/* Core palette */
--color-deep-teal: #0e7490;       /* Primary actions */
--color-terracotta: #d97706;      /* Accent, category labels */
--color-stone: #57534e;           /* Secondary text */
--color-off-white: #fafaf9;       /* Surfaces */
--color-surface-dark: #1c1917;    /* Dark sections, overlays */
```

Typography: Geist Sans (variable) + Geist Mono. Editorial prose at 1.125rem/1.85 line-height.

### Component Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| `ui/` | Atomic primitives | Button, Container, Section, Heading, Skeleton |
| `features/` | Domain sections | HeroSection, DestinationGallery, SeasonalBanner |
| `layout/` | Structural | Navbar, Footer |
| `admin/` | CMS interface | AdminShell, DestinationEditor, MediaLibrary |

### Page Composition

Every public page follows a consistent server-first pattern:

```tsx
// src/app/destinations/[slug]/page.tsx
export async function generateMetadata({ params }) { /* SEO */ }
export async function generateStaticParams() { /* ISR */ }

export default async function Page({ params }) {
  const data = await getCachedData(params.slug);
  return (
    <>
      <JsonLd data={structuredData} />
      <Hero />
      <Content data={data} />
      <Discovery />
    </>
  );
}
```

### Animation Strategy

- Framer Motion loaded only in `'use client'` boundaries
- `FadeIn`, `StaggerContainer`, `StaggerItem` — viewport-triggered, `once: true`
- `motion-safe:` CSS prefix respects `prefers-reduced-motion`
- Cinematic `slowZoom` keyframe on hero images (CSS, not JS)

---

## Admin & CMS

### Editorial Workflow

```
Create → Fill Fields → Upload Media → Set SEO → Save Draft
    → Check Editorial Score → Fix QA Issues → Publish
        → Optionally Feature → Archive when outdated
```

### Readiness Scoring System

Destinations are scored on 10 weighted criteria (100 points total):

| Check | Weight | Requirement |
|-------|--------|-------------|
| Hero image | 15 | Must have primary image |
| Title length | 10 | 10–80 characters |
| Summary | 10 | 50+ characters |
| Story content | 15 | 200+ characters of editorial prose |
| Highlights | 10 | At least 1 highlight entry |
| Gallery | 10 | 2+ images with alt text |
| SEO title | 10 | Custom SEO title set |
| SEO description | 10 | Custom meta description |
| Best time | 5 | Season/month specified |
| Coordinates | 5 | Lat/lng set for maps |

**Threshold:** ≥70 = publish-ready. Visible at `/admin/editorial`.

### Media QA

Automated auditing at `/admin/media-qa`:
- Broken images (missing hero/event/food images)
- Missing alt text on gallery entries
- Missing OG images for social sharing
- Short descriptions (< 50 chars)
- Missing SEO metadata

### Role Permissions

| Permission | super_admin | editor | contributor |
|-----------|:-----------:|:------:|:-----------:|
| Create content | ✓ | ✓ | ✓ |
| Edit all content | ✓ | ✓ | — |
| Publish/unpublish | ✓ | ✓ | — |
| Archive/restore | ✓ | — | — |
| Manage users | ✓ | — | — |
| Manage settings | ✓ | — | — |
| Manage SEO | ✓ | ✓ | — |
| Upload media | ✓ | ✓ | ✓ |

---

## Media Pipeline

### ImageKit Transform Architecture

```
Source → ImageKit URL Endpoint → /tr:transforms/path
                                      │
                                      ├── w-{width}
                                      ├── h-{height}
                                      ├── q-{quality}
                                      ├── fo-{focus}  (auto/face/center)
                                      ├── f-{format}  (auto → AVIF/WebP/JPEG)
                                      ├── ar-{ratio}  (21-9, 4-3, 1-1)
                                      └── bl-{blur}   (placeholder generation)
```

### Presets

| Preset | Dimensions | Quality | Use Case |
|--------|-----------|---------|----------|
| `hero` | 1920px, 21:9 | 85 | Full-bleed page heroes |
| `card` | 640px, 4:3 | 80 | Content cards, grids |
| `thumbnail` | 320px | 75 | Sidebar, admin previews |
| `og` | 1200×630 | 85 | Social sharing images |
| `gallery` | 800px | 80 | Gallery lightbox |
| `blur` | 32px, blur-30 | 20 | Placeholder blur-up |

### Fallback Strategy

```
1. ImageKit CDN URL (preferred — responsive, cached, optimized)
2. Appwrite Storage URL (uploaded files)
3. Curated Unsplash fallback (mapped by slug — never shows broken images)
```

---

## SEO System

### Per-Page Implementation

| Element | Coverage | Method |
|---------|----------|--------|
| Title + Description | All pages | `generateMetadata` / `createPageMetadata` helper |
| Canonical URL | All pages | `alternates.canonical` |
| Open Graph | All pages | Full OG with 1200×630 images |
| Twitter Cards | All pages | `summary_large_image` |
| JSON-LD | Key pages | 5 schema types |
| Sitemap | Dynamic | All published content |
| Robots | Configured | Allow public, disallow admin/API |

### Structured Data Schemas

| Schema | Pages | Purpose |
|--------|-------|---------|
| `WebSite` | Homepage | Site-level search/organization |
| `TouristAttraction` | Destination detail | Rich results for attractions |
| `Event` | Event detail | Event rich snippets |
| `BreadcrumbList` | Detail pages | Navigation breadcrumbs |
| `FAQPage` | Available | FAQ rich results (utility ready) |

### Sitemap Coverage

Dynamic XML sitemap at `/sitemap.xml` includes:
- Homepage + all static routes
- All published destinations (`/destinations/[slug]`)
- All published events (`/events/[slug]`)
- All published food items (`/food/[slug]`)
- All published itineraries (`/itineraries/[slug]`)
- Stays listing page
- Campaign pages

---

## Performance Engineering

### Core Web Vitals Strategy

| Metric | Approach |
|--------|----------|
| **LCP** | `priority` on hero images, preconnect to CDN, server-rendered HTML |
| **CLS** | Fixed aspect ratios (`aspect-[4/3]`, `aspect-video`), skeleton loaders, `fill` images |
| **INP** | Minimal client JS, no heavy hydration, event handlers only where needed |
| **FCP** | Server Components stream HTML immediately, no client-side data fetching |

### Image Optimization

- All images use `next/image` with `fill` + explicit `sizes`
- Hero images get `priority` flag (preloaded)
- ImageKit auto-negotiates AVIF → WebP → JPEG based on browser
- Blur placeholder SVG (1×1 base64) prevents layout shift
- Responsive `sizes` attribute prevents over-fetching

### Bundle Strategy

| Technique | Impact |
|-----------|--------|
| Server Components (default) | Zero JS shipped for content pages |
| Route-level code splitting | Only load code for current route |
| Tree-shaking (Lucide) | Only imported icons in bundle |
| `'use client'` boundaries | Framer Motion isolated to animation wrappers |
| Font `display: swap` | No FOIT, immediate text rendering |
| Preconnect hints | Eliminate DNS/TLS latency for CDN domains |



---

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Skip-to-content | Visible on focus, bypasses navigation to `#main-content` |
| Semantic HTML | Proper heading hierarchy, landmark regions (`<main>`, `<nav>`, `<footer>`) |
| Focus indicators | 2px deep-teal outline on all interactive elements |
| Alt text enforcement | Media QA system flags missing alt text |
| Color contrast | WCAG AA compliant (stone on off-white, off-white on dark) |
| Keyboard navigation | All interactive elements reachable via Tab |
| Reduced motion | `motion-safe:` prefix on all Framer Motion animations |
| ARIA labels | Decorative images use `aria-hidden`, functional images use descriptive `alt` |
| Form accessibility | Labels, error states, required indicators on all admin forms |

---

## Authentication & Security

### Auth Flow

```
Login Form → Server Action → Appwrite createEmailPasswordSession
    → Set httpOnly cookie (7-day expiry) → Redirect to /admin
```

### Middleware Protection

```typescript
// src/middleware.ts — runs on every /admin/* request
if (!session cookie) → redirect to /admin/login?redirect=pathname
```

### Security Measures

| Measure | Implementation |
|---------|---------------|
| Session storage | httpOnly cookie (not accessible via JS) |
| Route protection | Edge middleware on `/admin/:path*` |
| Role verification | `requireAuth()` / `requireRole()` on every server action |
| Upload validation | Zod schema: max 5MB, allowed MIME types only |
| Security headers | X-Frame-Options DENY, nosniff, strict referrer |
| No client secrets | All sensitive keys are server-only (no `NEXT_PUBLIC_` prefix) |
| Soft deletes | Archive instead of permanent deletion |

---

## Appwrite Architecture

### Database: `visitvagad`

10 collections with typed schemas, indexes, and query patterns:

| Collection | Purpose | Key Indexes |
|-----------|---------|-------------|
| `destinations` | Heritage sites, temples, lakes | `slug` (unique), `status`, `featured`, `district` |
| `events` | Festivals, cultural events | `slug` (unique), `status`, `date`, `category` |
| `food` | Regional cuisine items | `slug` (unique), `status`, `type` |
| `experiences` | Activities, tours | `status`, `category` |
| `itineraries` | Multi-day travel plans | `slug` (unique), `status`, `district`, `season` |
| `stays` | Accommodation | `slug` (unique), `status`, `type`, `district` |
| `guides` | Local guide profiles | `slug` (unique), `status`, `specialty` |
| `galleries` | Image collections | `parentId`, `order` |
| `regions` | District metadata | `name` |
| `settings` | Site configuration | `key` (unique) |

### Storage: `media` bucket

All uploaded images (hero, gallery, OG) stored in Appwrite file storage with server-side access via admin SDK.

### SDK Usage

| Context | SDK | Purpose |
|---------|-----|---------|
| Server Components | `node-appwrite` (admin) | Data fetching with full access |
| Server Actions | `node-appwrite` (admin) | CRUD mutations, file uploads |
| Middleware | Cookie check only | No SDK needed |
| Client | `appwrite` (client SDK) | Login form only |

---

## ImageKit Integration

### Configuration

```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/visitvagad
IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
```

### URL Transform Builder

```typescript
getImageKitUrl('/destinations/mangarh.jpg', {
  width: 1920, quality: 85, focus: 'auto', format: 'auto', aspectRatio: '21-9'
});
// → https://ik.imagekit.io/visitvagad/tr:w-1920,q-85,fo-auto,f-auto,ar-21-9/destinations/mangarh.jpg
```

### Responsive srcSet Generation

```typescript
getResponsiveSrcSet('/path.jpg', [320, 640, 960, 1280, 1920]);
// → "https://...tr:w-320/path.jpg 320w, https://...tr:w-640/path.jpg 640w, ..."
```

---

## Data Modeling

### Core Domain Types

```typescript
interface Destination {
  slug: string; title: string; district: 'Banswara' | 'Dungarpur';
  heroImage: string; summary: string; story: string;
  highlights: Highlight[]; gallery: GalleryImage[];
  experiences: string[]; bestTime: string;
  coordinates: { lat: number; lng: number };
  nearbyPlaces: NearbyPlace[]; seo: SeoMeta; featured: boolean;
}

interface Itinerary {
  slug: string; title: string; duration: string;
  category: 'heritage' | 'nature' | 'spiritual' | 'food' | 'photography';
  days: ItineraryDay[]; district: 'Banswara' | 'Dungarpur';
  season: string; heroImage: string; seo: SeoMeta;
}

interface Stay {
  slug: string; name: string;
  type: 'hotel' | 'eco-stay' | 'heritage' | 'homestay' | 'guesthouse';
  district: 'Banswara' | 'Dungarpur'; location: string;
  priceRange: string; amenities: string[];
}
```

### Content Status Model

```typescript
type ContentStatus = 'draft' | 'published' | 'featured' | 'archived';
```

### Role Model

```typescript
type AdminRole = 'super_admin' | 'editor' | 'contributor';
```

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root: fonts, nav, footer, analytics, preconnect
│   ├── page.tsx                  # Homepage (10 server-rendered sections)
│   ├── globals.css               # Design system (@theme tokens)
│   ├── sitemap.ts                # Dynamic XML sitemap
│   ├── robots.ts                 # Search engine directives
│   ├── destinations/             # Listing + [slug] detail
│   ├── events/                   # Listing + [slug] detail
│   ├── food/                     # Listing + [slug] detail
│   ├── itineraries/              # Listing + [slug] detail
│   ├── stays/                    # Listing page
│   ├── campaigns/                # Listing + [slug] detail
│   ├── search/                   # Full-text search
│   ├── culture/                  # Culture pages (stub)
│   ├── plan-your-trip/           # Trip planning (stub)
│   └── admin/
│       ├── login/                # Auth page
│       ├── logout/               # Session destroy
│       └── (dashboard)/          # Protected route group
│           ├── page.tsx          # Dashboard overview
│           ├── destinations/     # CRUD + editor
│           ├── events/           # Management
│           ├── food/             # Management
│           ├── itineraries/      # Management (stub)
│           ├── media/            # Library + upload API
│           ├── media-qa/         # Quality audit
│           ├── editorial/        # Readiness scoring
│           ├── seo/              # SEO audit
│           ├── users/            # User management
│           └── settings/         # Site settings
├── components/
│   ├── ui/                       # 15 atomic components
│   ├── features/                 # 18 domain sections
│   ├── layout/                   # Navbar, Footer
│   └── admin/                    # 5 CMS components
├── lib/                          # 15 utility modules
├── hooks/                        # useBookmarks, useRecentlyViewed
├── providers/                    # AdminProvider (role context)
├── types/                        # Domain, CMS, Admin types
├── constants/                    # Campaigns, socials, creatives, tokens
├── features/                     # Server actions (destinations)
├── data/                         # Static fallback data
├── i18n/                         # Internationalization (inactive)
└── middleware.ts                 # Admin route protection
```



---

## Scripts

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run dev` | — | Start development server |
| `npm run build` | — | Production build |
| `npm run lint` | — | ESLint check |
| `npm run setup` | `scripts/setup-env.ts` | Generate `.env.local` from template |
| `npm run env:check` | `scripts/check-env.ts` | Validate env vars, detect leaks |
| `npm run bootstrap:appwrite` | `scripts/bootstrap-appwrite.ts` | Create all collections, indexes, bucket |
| `npm run create:admin` | `scripts/create-admin.ts` | Create super_admin user |
| `npm run seed` | `scripts/seed.ts` | Seed destinations, events, food, experiences |
| `npm run seed:media` | `scripts/seed-imagekit-media.ts` | Seed ImageKit media references |
| `npm run sync:imagekit` | `scripts/sync-imagekit.ts` | Sync ImageKit → Appwrite (supports `--dry-run`) |
| `npm run generate:icons` | `scripts/generate-icons.ts` | Generate PWA icons from source |

Additional scripts (run via `npx tsx scripts/...`):
- `seed-ecosystem.ts` — Seed itineraries, stays, guides
- `update-admin-password.ts` — Reset admin password
- `update-images.ts` — Batch update image URLs in documents

---

## Environment Variables

```bash
# Required — Appwrite
APPWRITE_API_KEY=                          # Server-only API key
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=visitvagad
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=media

# Required — ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/visitvagad
IMAGEKIT_PUBLIC_KEY=                       # Server-only
IMAGEKIT_PRIVATE_KEY=                      # Server-only

# Optional
NEXT_PUBLIC_SITE_URL=https://visitvagad.com
AUTH_COOKIE_NAME=visitvagad_session
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

All variables are validated at startup via Zod schemas in `src/lib/env.ts`.

---

## Quick Start

### Prerequisites

- Node.js 20+ (tested on 22.x)
- npm 10+
- Appwrite Cloud account (or self-hosted)
- ImageKit account

### Setup

```bash
# Clone
git clone https://github.com/chiragbhoi/visitvagad-nextjs.git
cd visitvagad-nextjs

# Install
npm install

# Configure environment
npm run setup                    # Creates .env.local
# → Fill in Appwrite + ImageKit credentials

# Bootstrap database
npm run bootstrap:appwrite       # Creates collections + indexes

# Create admin user
npm run create:admin             # admin@visitvagad.com

# Seed data
npm run seed                     # Core content
npm run seed:media               # Media references

# Start
npm run dev                      # → http://localhost:3000
```

### Admin Access

Navigate to `http://localhost:3000/admin/login` with the credentials created by `create:admin`.

---

## Deployment

### Vercel (Production)

1. Connect repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy — framework auto-detected as Next.js

**Configuration:**
- Build: `next build`
- Node.js: 20.x
- Output: `.next`

### Post-Deploy Verification

- [ ] `/sitemap.xml` returns valid XML with all routes
- [ ] `/robots.txt` allows public, disallows admin
- [ ] `/admin/login` loads and authenticates
- [ ] Hero images load from ImageKit CDN
- [ ] Vercel Analytics shows traffic
- [ ] Google Search Console accepts sitemap

---

## CI/CD Recommendations

The project does not yet have CI/CD pipelines. Recommended setup:

### GitHub Actions (Suggested)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run build
```

### Recommended Additions

| Tool | Purpose |
|------|---------|
| Playwright | E2E tests for admin workflows |
| Lighthouse CI | Automated CWV regression checks |
| Bundle analyzer | Track client JS growth |
| Dependabot | Automated dependency updates |



---

## Technical Debt

| Issue | Severity | Impact | Recommended Fix |
|-------|----------|--------|-----------------|
| `/about` and `/contact` links in footer point to non-existent pages | HIGH | Broken navigation for users | Create pages or remove links |
| `/culture` and `/plan-your-trip` are placeholder stubs | MEDIUM | Poor UX for visitors who navigate there | Build out with real content |
| `next-intl` installed but not wired up | MEDIUM | Dead dependency, unused code | Either integrate fully or remove |
| No E2E test suite | MEDIUM | Regressions caught only manually | Add Playwright tests |
| Admin itineraries page is a stub | LOW | Admin-only, low user impact | Complete CRUD when ready |
| No public `/guides` page despite API support | LOW | Data exists but isn't surfaced | Create listing page |
| `featured` exists as both status enum value and boolean field | LOW | Schema confusion | Standardize on boolean only |
| No error monitoring (Sentry/etc.) | MEDIUM | Production errors go unnoticed | Add Sentry integration |

---

## Known Issues

1. **Build warning:** Next.js 15 App Router generates a `<Html>` import error during static export of the 404 page. This is a known framework issue, not application code. Does not affect runtime.

2. **ESLint warnings:** Minor unused variable warnings in admin components (non-blocking).

3. **`unstable_cache`:** The caching API is marked unstable in Next.js 15. May need migration when the stable API lands.

4. **Appwrite rate limits:** Free-tier Appwrite Cloud has request limits. High-traffic scenarios may need self-hosted Appwrite or caching layer.

---

## Production Readiness Checklist

| Category | Status | Notes |
|----------|--------|-------|
| TypeScript compilation | ✅ Zero errors | Clean `tsc --noEmit` |
| ESLint | ⚠️ Warnings only | No errors, minor unused vars |
| SEO metadata | ✅ All pages | Canonical, OG, Twitter, JSON-LD |
| Sitemap | ✅ Dynamic | All published content indexed |
| Security headers | ✅ Configured | X-Frame, nosniff, referrer |
| Auth protection | ✅ Middleware | All admin routes guarded |
| Image optimization | ✅ Complete | next/image + ImageKit CDN |
| Error boundaries | ✅ Present | error.tsx + not-found.tsx |
| Loading states | ✅ Present | Skeleton loaders on key routes |
| Mobile responsive | ✅ Tested | Tailwind responsive utilities |
| Accessibility | ✅ Core | Skip-link, focus, ARIA, contrast |
| Analytics | ✅ Integrated | Vercel Analytics + Speed Insights |
| Environment validation | ✅ Zod | Startup validation of all vars |
| CI/CD | ❌ Not configured | Recommended: GitHub Actions |
| E2E tests | ❌ Not present | Recommended: Playwright |
| Error monitoring | ❌ Not configured | Recommended: Sentry |
| Content backup | ❌ Manual only | Recommended: Appwrite backup schedule |

**Deployment Readiness Score: 8/10** — Production-ready with monitoring and testing as recommended additions.

---

## Roadmap

### Near-Term (1–2 Months)

- [ ] Create `/about` and `/contact` pages
- [ ] Build out `/culture` with real editorial content
- [ ] Build out `/plan-your-trip` with transport, weather, packing tips
- [ ] Add public `/guides` listing page
- [ ] Complete admin itineraries CRUD
- [ ] Add Playwright E2E tests for admin workflows
- [ ] Set up GitHub Actions CI pipeline
- [ ] Add Sentry error monitoring

### Mid-Term (3–6 Months)

- [ ] Interactive destination maps (Mapbox/Leaflet)
- [ ] Guide booking request system
- [ ] Multi-language content (Hindi via next-intl)
- [ ] Content scheduling (publish at future date)
- [ ] Email newsletter integration
- [ ] User accounts with saved trips
- [ ] Photo contributions from travelers

### Long-Term (6–12 Months)

- [ ] AI-assisted content recommendations
- [ ] Virtual tours (360° imagery)
- [ ] Offline-first PWA for low-connectivity areas
- [ ] Contributor ecosystem (local writers, photographers)
- [ ] Tourism analytics for regional authorities
- [ ] Real-time event calendar with notifications

---

## Lessons Learned

### What Worked

1. **Server Components by default** — Eliminated hydration bugs, reduced bundle to near-zero on public pages, simplified data fetching.

2. **ImageKit URL transforms** — One source image serves all viewports without build-time processing. Instant responsive delivery.

3. **Editorial scoring system** — Quantifying content quality transformed "is this ready?" from subjective to measurable.

4. **Curated fallback images** — Platform looks complete even with empty databases. Development and demos are seamless.

5. **Appwrite as unified backend** — Auth + DB + Storage in one service eliminated integration complexity.

### What I'd Improve

1. **Start with i18n from day one** — Retrofitting translations into an existing codebase is significantly harder.
2. **Add E2E tests earlier** — Manual testing doesn't scale with growing admin features.
3. **Consider a headless CMS** — Appwrite works but a purpose-built CMS (Payload, Strapi) offers richer editing UX.
4. **Design system documentation** — Storybook or similar would help maintain component consistency.

---

## Author

**Chirag Bhoi**

Full-stack engineer building production-grade web platforms with Next.js, React, TypeScript, and cloud-native architectures. Focused on performance engineering, editorial systems, and cultural technology.

- GitHub: [github.com/chiragbhoi](https://github.com/chiragbhoi)
- Project: [visitvagad.com](https://visitvagad.com)

---

## License

[MIT](LICENSE) — Copyright © 2024 Chirag Bhoi

---

<p align="center">
  <sub>Every region deserves a world-class digital presence. This is Vagad's.</sub>
</p>
