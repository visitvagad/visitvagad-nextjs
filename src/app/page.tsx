import {
  HeroSection,
  WhyVagadSection,
  ExploreRegionsSection,
  FeaturedDestinationsSection,
  ExperienceGridSection,
  CultureSection,
  FestivalSection,
  GalleryGridSection,
  CTASection,
} from '@/components/features';
import { JsonLd, websiteJsonLd } from '@/lib/seo';
import {
  getFeaturedDestinationsFromDb,
  getPublishedExperiences,
  getPublishedEvents,
  getRegions,
  getGalleryImages,
} from '@/lib/api';

export default async function HomePage() {
  const [destinations, experiences, events, regions, gallery] = await Promise.all([
    getFeaturedDestinationsFromDb(),
    getPublishedExperiences(),
    getPublishedEvents(),
    getRegions(),
    getGalleryImages(),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <HeroSection />
      <WhyVagadSection />
      <ExploreRegionsSection regions={regions} />
      <FeaturedDestinationsSection destinations={destinations} />
      <ExperienceGridSection experiences={experiences} />
      <CultureSection />
      <FestivalSection events={events.slice(0, 4)} />
      <GalleryGridSection images={gallery} />
      <CTASection />
    </>
  );
}
