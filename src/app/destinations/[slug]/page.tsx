import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDestinationBySlugFromDb, getAllDestinationSlugs, getPublishedItineraries, getPublishedStays } from '@/lib/api';
import { getCanonicalUrl, touristAttractionJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import {
  DestinationHero,
  DestinationStory,
  DestinationHighlights,
  DestinationGallery,
  NearbyPlaces,
  TravelTips,
  RelatedItineraries,
  NearbyStays,
} from '@/components/features';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestinationBySlugFromDb(slug);
  if (!dest) return { title: 'Not Found' };

  const url = `/destinations/${dest.slug}`;
  const ogImage = dest.seo.ogImage || dest.heroImage || undefined;
  return {
    title: dest.seo.title,
    description: dest.seo.description,
    keywords: [`${dest.title}`, dest.district, 'Vagad', 'Rajasthan tourism', 'heritage'],
    alternates: { canonical: getCanonicalUrl(url) },
    openGraph: {
      title: dest.seo.title,
      description: dest.seo.description,
      url: getCanonicalUrl(url),
      siteName: 'VisitVagad',
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `${dest.title} — ${dest.district}, Rajasthan` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: dest.seo.title,
      description: dest.seo.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestinationBySlugFromDb(slug);
  if (!dest) notFound();

  // Fetch related content
  const [itineraries, stays] = await Promise.all([
    getPublishedItineraries(),
    getPublishedStays(),
  ]);

  // Filter related by district
  const relatedItineraries = itineraries.filter(i => i.district === dest.district).slice(0, 2);
  const nearbyStays = stays.filter(s => s.district === dest.district).slice(0, 3);

  const jsonLd = touristAttractionJsonLd({
    name: dest.title,
    description: dest.seo.description,
    image: dest.heroImage || undefined,
    url: `/destinations/${dest.slug}`,
    address: `${dest.district}, Rajasthan`,
  });

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: dest.title, url: `/destinations/${dest.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />
      <DestinationHero destination={dest} />
      <Container>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Destinations', href: '/destinations' },
          { label: dest.title },
        ]} />
      </Container>
      {dest.story && <DestinationStory story={dest.story} />}
      {dest.highlights.length > 0 && <DestinationHighlights highlights={dest.highlights} />}
      {dest.gallery.length > 0 && <DestinationGallery gallery={dest.gallery} />}
      <TravelTips bestTime={dest.bestTime} coordinates={dest.coordinates} />
      {dest.nearbyPlaces.length > 0 && <NearbyPlaces places={dest.nearbyPlaces} />}
      <RelatedItineraries itineraries={relatedItineraries} />
      <NearbyStays stays={nearbyStays} />
    </>
  );
}
