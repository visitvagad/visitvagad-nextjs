import Image from 'next/image';
import Link from 'next/link';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getActiveCampaigns } from '@/constants/campaigns';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Seasonal Campaigns — Explore Vagad by Season',
  description: 'Curated seasonal tourism experiences in the Vagad region — monsoon trails, festival celebrations, weekend escapes, and photography routes.',
  path: '/campaigns',
});

export default function CampaignsPage() {
  const campaigns = getActiveCampaigns();

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">Seasonal</p>
          <Heading as="h1">Explore by Season</Heading>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl font-light leading-relaxed">
            Curated collections for every time of year — discover the best of Vagad through immersive seasonal experiences.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <StaggerItem key={campaign.slug}>
              <Link href={`/campaigns/${campaign.slug}`} className="group block relative h-72 rounded-2xl overflow-hidden bg-surface-alt">
                <Image
                  src={campaign.heroImage}
                  alt={campaign.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs uppercase tracking-wider text-terracotta">{campaign.season}</span>
                  <h2 className="mt-1 text-2xl font-semibold text-off-white">{campaign.title}</h2>
                  <p className="mt-1 text-sm text-off-white/70">{campaign.subtitle}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
