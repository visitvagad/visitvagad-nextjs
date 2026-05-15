import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import { getItineraryBySlug, getPublishedItineraries } from '@/lib/api';
import { getCanonicalUrl } from '@/lib/seo';
import Link from 'next/link';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const items = await getPublishedItineraries();
  return items.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const itin = await getItineraryBySlug(slug);
  if (!itin) return { title: 'Not Found' };
  return {
    title: itin.seo.title,
    description: itin.seo.description,
    openGraph: { title: itin.seo.title, description: itin.seo.description, url: getCanonicalUrl(`/itineraries/${slug}`), images: itin.heroImage ? [{ url: itin.heroImage }] : undefined },
  };
}

export default async function ItineraryPage({ params }: Props) {
  const { slug } = await params;
  const itin = await getItineraryBySlug(slug);
  if (!itin) notFound();

  const imgUrl = itin.heroImage || PLACEHOLDER_IMAGES.fallback;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] max-h-[600px] flex items-end overflow-hidden -mt-16 md:-mt-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imgUrl}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-surface-dark/10" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10 sm:pb-14">
          <FadeIn>
            <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">
              {itin.category} · {itin.duration} · {itin.district}
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-off-white tracking-tight">{itin.title}</h1>
            <p className="mt-3 text-base sm:text-lg text-off-white/85 max-w-2xl font-light">{itin.summary}</p>
          </FadeIn>
        </div>
      </section>

      {/* Timeline */}
      <Section spacing="lg">
        <Container className="max-w-3xl">
          <FadeIn>
            <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Day by Day</p>
            <Heading as="h2">Your Journey</Heading>
            {itin.season && <p className="mt-2 text-sm text-text-muted">Recommended season: {itin.season}</p>}
          </FadeIn>

          <div className="mt-12 space-y-12">
            {itin.days.map((day) => (
              <FadeIn key={day.day}>
                <div className="relative pl-8 border-l-2 border-deep-teal/20">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-teal" />
                  <p className="text-xs uppercase tracking-wider text-text-muted">Day {day.day}</p>
                  <h3 className="mt-1 text-xl font-medium text-text-primary">{day.title}</h3>

                  <StaggerContainer className="mt-6 space-y-4">
                    {day.stops.map((stop, i) => (
                      <StaggerItem key={i}>
                        <div className="flex gap-4 p-4 rounded-xl bg-surface-alt hover:bg-surface-alt/80 transition-colors">
                          <span className="text-sm font-medium text-deep-teal whitespace-nowrap">{stop.time}</span>
                          <div>
                            <Link href={`/destinations/${stop.destination}`} className="text-base font-medium text-text-primary hover:text-deep-teal transition-colors">
                              {stop.destination.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </Link>
                            <p className="mt-1 text-sm text-text-secondary">{stop.note}</p>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
