import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import { getPublishedStays } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Where to Stay — Vagad Accommodation',
  description: 'Find heritage hotels, eco lodges, homestays, and guest houses across Banswara and Dungarpur in the Vagad region.',
  openGraph: { title: 'Where to Stay — Vagad Accommodation', description: 'Heritage hotels, eco lodges, and homestays in Vagad.' },
};

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel', guesthouse: 'Guest House', 'eco-stay': 'Eco Stay', heritage: 'Heritage', homestay: 'Homestay',
};

export default async function StaysPage() {
  const stays = await getPublishedStays();

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Stay</p>
          <Heading as="h1">Where to Stay</Heading>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl font-light leading-relaxed">
            From royal heritage palaces to intimate tribal homestays — find your perfect base for exploring Vagad.
          </p>
        </FadeIn>

        {stays.length === 0 ? (
          <p className="mt-12 text-text-muted">Stays coming soon.</p>
        ) : (
          <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <StaggerItem key={stay.slug}>
                <div className="group rounded-2xl overflow-hidden bg-surface-alt hover-drift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${stay.image || PLACEHOLDER_IMAGES.fallback}')` }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider bg-surface/90 text-text-primary rounded-full backdrop-blur-sm">
                        {TYPE_LABELS[stay.type] || stay.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-medium text-text-primary">{stay.name}</h2>
                    <p className="mt-1 text-xs text-text-muted">{stay.location}</p>
                    <p className="mt-2 text-sm text-text-secondary line-clamp-2">{stay.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      {stay.priceRange && <span className="text-sm font-medium text-deep-teal">{stay.priceRange}</span>}
                      <span className="text-xs text-text-muted">{stay.district}</span>
                    </div>
                    {stay.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {stay.amenities.slice(0, 3).map(a => (
                          <span key={a} className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-surface text-text-muted rounded-full">{a}</span>
                        ))}
                        {stay.amenities.length > 3 && <span className="px-2 py-0.5 text-[10px] text-text-muted">+{stay.amenities.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
}
