import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getPublishedDestinations } from '@/lib/api';
import { createPageMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata = createPageMetadata({
  title: 'Destinations — Explore Vagad',
  description: 'Explore heritage sites, sacred temples, lakes, waterfalls, and hidden gems across Banswara and Dungarpur in Rajasthan\'s Vagad region.',
  path: '/destinations',
});

export default async function DestinationsPage() {
  const destinations = await getPublishedDestinations();

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <Heading as="h1">Destinations</Heading>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            Heritage sites, lakes, waterfalls, and hidden gems across the Vagad region.
          </p>
        </FadeIn>

        {destinations.length === 0 ? (
          <p className="mt-12 text-text-muted">No destinations available yet. Check back soon.</p>
        ) : (
          <StaggerContainer className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <StaggerItem key={dest.slug}>
                <Link href={`/destinations/${dest.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-alt">
                    {dest.heroImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${dest.heroImage}')` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-xs uppercase tracking-wider text-off-white/60">{dest.district}</span>
                      <h2 className="mt-1 text-xl font-semibold text-off-white">{dest.title}</h2>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-text-secondary line-clamp-2">{dest.summary}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
}
