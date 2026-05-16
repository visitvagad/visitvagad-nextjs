import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getPublishedEvents } from '@/lib/api';
import Link from 'next/link';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Events & Festivals — VisitVagad',
  description: 'Experience vibrant tribal festivals, cultural events, and celebrations across Banswara and Dungarpur.',
  path: '/events',
});

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <Heading as="h1">Events & Festivals</Heading>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            Vibrant tribal festivals, cultural events, and celebrations of the Vagad region.
          </p>
        </FadeIn>

        {events.length === 0 ? (
          <p className="mt-12 text-text-muted">No upcoming events. Check back soon.</p>
        ) : (
          <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <StaggerItem key={event.slug}>
                <Link href={`/events/${event.slug}`} className="group flex gap-5 p-4 rounded-2xl hover:bg-surface-alt transition-colors">
                  <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-surface-alt">
                    {event.image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${event.image}')` }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-xs uppercase tracking-wider text-text-muted">{event.category} · {event.district}</span>
                    <h2 className="mt-1 text-lg font-medium text-text-primary group-hover:text-deep-teal transition-colors">{event.title}</h2>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-2">{event.description}</p>
                    <time className="mt-2 text-xs text-text-muted">{new Date(event.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</time>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </Section>
  );
}
