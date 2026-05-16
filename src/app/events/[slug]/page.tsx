import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/api';
import { getCanonicalUrl, eventJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Not Found' };
  const url = `/events/${event.slug}`;
  return {
    title: event.seo.title,
    description: event.seo.description,
    alternates: { canonical: getCanonicalUrl(url) },
    openGraph: { title: event.seo.title, description: event.seo.description, url: getCanonicalUrl(url), images: event.image ? [{ url: event.image, width: 1200, height: 630 }] : undefined },
    twitter: { card: 'summary_large_image', title: event.seo.title, description: event.seo.description, images: event.image ? [event.image] : undefined },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const jsonLd = eventJsonLd({
    name: event.title,
    description: event.seo.description,
    startDate: event.date,
    endDate: event.endDate,
    location: event.location,
    url: `/events/${event.slug}`,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
        { name: event.title, url: `/events/${event.slug}` },
      ])} />
      <Section spacing="lg">
        <Container className="max-w-3xl">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Events', href: '/events' },
            { label: event.title },
          ]} />
          <FadeIn>
            <span className="text-xs uppercase tracking-wider text-terracotta">{event.category} · {event.district}</span>
            <Heading as="h1" className="mt-2">{event.title}</Heading>
            <div className="mt-4 flex gap-4 text-sm text-text-muted">
              <time>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              {event.endDate && <span>— {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
            </div>
            <p className="mt-2 text-sm text-text-muted">📍 {event.location}</p>
            <p className="mt-8 text-lg text-text-secondary leading-relaxed">{event.description}</p>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
