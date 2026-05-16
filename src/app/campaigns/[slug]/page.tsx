import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getCampaignBySlug, getActiveCampaigns } from '@/constants/campaigns';
import { getCanonicalUrl } from '@/lib/seo';
import { getPublishedDestinations } from '@/lib/api';
import { getOptimizedUrl, PLACEHOLDER_IMAGES } from '@/lib/images';

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getActiveCampaigns().map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (!campaign) return { title: 'Not Found' };
  const url = `/campaigns/${campaign.slug}`;
  return {
    title: `${campaign.title} — VisitVagad`,
    description: campaign.description,
    alternates: { canonical: getCanonicalUrl(url) },
    openGraph: { title: campaign.title, description: campaign.description, url: getCanonicalUrl(url), images: [{ url: campaign.heroImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: campaign.title, description: campaign.description, images: [campaign.heroImage] },
  };
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (!campaign) notFound();

  const allDestinations = await getPublishedDestinations();
  const featured = allDestinations.filter(d => campaign.destinations.includes(d.slug));

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[700px] flex items-end overflow-hidden -mt-16 md:-mt-20">
        <Image src={campaign.heroImage} alt={campaign.title} fill priority sizes="100vw" className="object-cover" quality={85} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-surface-dark/10" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <FadeIn>
            <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">{campaign.season}</span>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold text-off-white tracking-tight">{campaign.title}</h1>
            <p className="mt-3 text-lg text-off-white/80 max-w-2xl font-light">{campaign.subtitle}</p>
          </FadeIn>
        </div>
      </section>

      {/* Description */}
      <Section spacing="md">
        <Container className="max-w-3xl">
          <FadeIn>
            <p className="text-lg text-text-secondary leading-relaxed prose-editorial">{campaign.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {campaign.tags.map(tag => (
                <span key={tag} className="px-3 py-1 text-xs uppercase tracking-wider bg-surface-alt text-text-muted rounded-full border border-border">{tag}</span>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Featured Destinations */}
      {featured.length > 0 && (
        <Section spacing="md" className="bg-surface-alt">
          <Container>
            <FadeIn>
              <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">Featured in this collection</p>
              <Heading as="h2">Destinations</Heading>
            </FadeIn>
            <StaggerContainer className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(dest => {
                const imgUrl = getOptimizedUrl(dest.heroImage || PLACEHOLDER_IMAGES[dest.slug as keyof typeof PLACEHOLDER_IMAGES], 'card');
                return (
                  <StaggerItem key={dest.slug}>
                    <Link href={`/destinations/${dest.slug}`} className="group block">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface">
                        <Image src={imgUrl} alt={dest.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-lg font-semibold text-off-white">{dest.title}</h3>
                          <p className="mt-0.5 text-xs text-off-white/60">{dest.district}</p>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </Container>
        </Section>
      )}
    </>
  );
}
