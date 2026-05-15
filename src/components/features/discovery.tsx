import { Section, Container } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import type { Itinerary, Stay } from '@/types';
import Link from 'next/link';

/** Related itineraries for a destination */
export function RelatedItineraries({ itineraries }: { itineraries: Itinerary[] }) {
  if (itineraries.length === 0) return null;
  return (
    <Section spacing="md" className="bg-surface-alt">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Continue Exploring</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">Suggested Itineraries</h2>
        </FadeIn>
        <StaggerContainer className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {itineraries.slice(0, 2).map(itin => (
            <StaggerItem key={itin.slug}>
              <Link href={`/itineraries/${itin.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-surface transition-colors">
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${itin.heroImage || PLACEHOLDER_IMAGES.fallback}')` }} />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted">{itin.duration} · {itin.category}</span>
                  <h3 className="mt-0.5 text-base font-medium text-text-primary group-hover:text-deep-teal transition-colors truncate">{itin.title}</h3>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}

/** Nearby stays for a destination */
export function NearbyStays({ stays }: { stays: Stay[] }) {
  if (stays.length === 0) return null;
  return (
    <Section spacing="md">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Where to Stay</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">Nearby Accommodation</h2>
        </FadeIn>
        <StaggerContainer className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stays.slice(0, 3).map(stay => (
            <StaggerItem key={stay.slug}>
              <div className="p-5 rounded-2xl bg-surface-alt hover-drift">
                <h3 className="text-base font-medium text-text-primary">{stay.name}</h3>
                <p className="mt-1 text-xs text-text-muted">{stay.location}</p>
                {stay.priceRange && <p className="mt-2 text-sm font-medium text-deep-teal">{stay.priceRange}</p>}
                <p className="mt-2 text-sm text-text-secondary line-clamp-2">{stay.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}

/** Seasonal recommendation banner */
export function SeasonalBanner({ season, title, description }: { season: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-deep-teal/10 to-terracotta/10 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-deep-teal font-medium">{season}</p>
      <h3 className="mt-2 text-lg font-medium text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
}
