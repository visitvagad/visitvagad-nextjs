import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFoodBySlug } from '@/lib/api';
import { getCanonicalUrl, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getFoodBySlug(slug);
  if (!item) return { title: 'Not Found' };
  const url = `/food/${item.slug}`;
  return {
    title: item.seo.title,
    description: item.seo.description,
    alternates: { canonical: getCanonicalUrl(url) },
    openGraph: { title: item.seo.title, description: item.seo.description, url: getCanonicalUrl(url) },
  };
}

export default async function FoodItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getFoodBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Food', url: '/food' },
        { name: item.title, url: `/food/${item.slug}` },
      ])} />
      <Section spacing="lg">
        <Container className="max-w-3xl">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Food', href: '/food' },
            { label: item.title },
          ]} />
          <FadeIn>
            <span className="text-xs uppercase tracking-wider text-terracotta">{item.type} · {item.origin}</span>
            <Heading as="h1" className="mt-2">{item.title}</Heading>
            <p className="mt-8 text-lg text-text-secondary leading-relaxed">{item.description}</p>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
