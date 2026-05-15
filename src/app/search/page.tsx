import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import { searchAll } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search — VisitVagad',
  description: 'Search destinations, itineraries, events, and experiences across the Vagad region.',
};

interface Props { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const results = q ? await searchAll(q) : null;
  const hasResults = results && (results.destinations.length > 0 || results.events.length > 0 || results.itineraries.length > 0);

  return (
    <Section spacing="lg">
      <Container className="max-w-4xl">
        <FadeIn>
          <Heading as="h1">Search</Heading>
          <form action="/search" method="GET" className="mt-8">
            <input
              type="search"
              name="q"
              defaultValue={q || ''}
              placeholder="Search destinations, events, itineraries..."
              className="w-full px-5 py-4 text-lg rounded-2xl border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-deep-teal/20 focus:border-deep-teal"
              autoFocus
            />
          </form>
        </FadeIn>

        {q && !hasResults && (
          <FadeIn>
            <p className="mt-12 text-center text-text-muted">No results found for &ldquo;{q}&rdquo;. Try a different search term.</p>
          </FadeIn>
        )}

        {results?.destinations && results.destinations.length > 0 && (
          <FadeIn>
            <div className="mt-12">
              <h2 className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Destinations</h2>
              <div className="space-y-3">
                {results.destinations.map(dest => (
                  <Link key={dest.slug} href={`/destinations/${dest.slug}`} className="flex gap-4 p-3 rounded-xl hover:bg-surface-alt transition-colors">
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-surface-alt">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${dest.heroImage || PLACEHOLDER_IMAGES.fallback}')` }} />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-base font-medium text-text-primary truncate">{dest.title}</h3>
                      <p className="text-sm text-text-muted">{dest.district}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {results?.events && results.events.length > 0 && (
          <FadeIn>
            <div className="mt-10">
              <h2 className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Events</h2>
              <div className="space-y-3">
                {results.events.map(event => (
                  <Link key={event.slug} href={`/events/${event.slug}`} className="flex gap-4 p-3 rounded-xl hover:bg-surface-alt transition-colors">
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-base font-medium text-text-primary truncate">{event.title}</h3>
                      <p className="text-sm text-text-muted">{event.category} · {event.district}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {results?.itineraries && results.itineraries.length > 0 && (
          <FadeIn>
            <div className="mt-10">
              <h2 className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Itineraries</h2>
              <div className="space-y-3">
                {results.itineraries.map(itin => (
                  <Link key={itin.slug} href={`/itineraries/${itin.slug}`} className="flex gap-4 p-3 rounded-xl hover:bg-surface-alt transition-colors">
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-base font-medium text-text-primary truncate">{itin.title}</h3>
                      <p className="text-sm text-text-muted">{itin.duration} · {itin.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}
