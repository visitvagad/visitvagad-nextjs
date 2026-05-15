import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getPublishedFood } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Food & Cuisine — VisitVagad',
  description: 'Discover the authentic tribal cuisine and culinary traditions of Rajasthan\'s Vagad region.',
};

export default async function FoodPage() {
  const food = await getPublishedFood();

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <Heading as="h1">Food & Cuisine</Heading>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            Authentic tribal cuisine and culinary traditions of the Vagad region.
          </p>
        </FadeIn>

        {food.length === 0 ? (
          <p className="mt-12 text-text-muted">No food items available yet. Check back soon.</p>
        ) : (
          <StaggerContainer className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {food.map((item) => (
              <StaggerItem key={item.slug}>
                <Link href={`/food/${item.slug}`} className="group block p-5 rounded-2xl hover:bg-surface-alt transition-colors">
                  <span className="text-xs uppercase tracking-wider text-terracotta">{item.type}</span>
                  <h2 className="mt-1 text-lg font-medium text-text-primary group-hover:text-deep-teal transition-colors">{item.title}</h2>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-3">{item.description}</p>
                  <p className="mt-2 text-xs text-text-muted">{item.origin}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
}
