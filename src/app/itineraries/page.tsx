import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import { getPublishedItineraries } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Itineraries — Plan Your Vagad Journey',
  description: 'Curated travel itineraries for exploring the Vagad region — day trips, weekend getaways, pilgrimage routes, and photography trails.',
  openGraph: { title: 'Itineraries — Plan Your Vagad Journey', description: 'Curated travel itineraries for the Vagad region.' },
};

export default async function ItinerariesPage() {
  const itineraries = await getPublishedItineraries();

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Plan</p>
          <Heading as="h1">Curated Itineraries</Heading>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl font-light leading-relaxed">
            Thoughtfully planned journeys through Vagad — from single-day explorations to immersive multi-day trails.
          </p>
        </FadeIn>

        {itineraries.length === 0 ? (
          <p className="mt-12 text-text-muted">Itineraries coming soon.</p>
        ) : (
          <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {itineraries.map((itin) => (
              <StaggerItem key={itin.slug}>
                <Link href={`/itineraries/${itin.slug}`} className="group block">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-alt">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${itin.heroImage || PLACEHOLDER_IMAGES.fallback}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-surface-dark/60 text-off-white rounded-full backdrop-blur-sm">
                        {itin.duration}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-xs uppercase tracking-wider text-terracotta">{itin.category} · {itin.district}</span>
                      <h2 className="mt-1 text-xl font-semibold text-off-white">{itin.title}</h2>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-text-secondary line-clamp-2">{itin.summary}</p>
                  {itin.season && <p className="mt-1 text-xs text-text-muted">Best: {itin.season}</p>}
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
}
