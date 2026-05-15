import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import type { Destination } from '@/types';
import Link from 'next/link';

export function FeaturedDestinationsSection({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) return null;

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Featured
          </p>
          <Heading as="h2">Must-Visit Destinations</Heading>
        </FadeIn>

        <StaggerContainer className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {destinations.map((dest) => {
            const imgUrl = dest.heroImage || PLACEHOLDER_IMAGES[dest.slug as keyof typeof PLACEHOLDER_IMAGES] || PLACEHOLDER_IMAGES.fallback;
            return (
              <StaggerItem key={dest.slug}>
                <Link href={`/destinations/${dest.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-alt">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${imgUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <span className="text-xs uppercase tracking-wider text-off-white/60">{dest.district}</span>
                      <h3 className="mt-1 text-lg sm:text-xl font-semibold text-off-white">{dest.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-text-secondary line-clamp-2">{dest.summary}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
