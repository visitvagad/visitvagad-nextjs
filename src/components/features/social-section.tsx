import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { Section, Container } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { SOCIALS } from '@/constants/socials';
import { PROMO_CREATIVES } from '@/constants/creatives';
import { getImageKitUrl } from '@/lib/imagekit';

/** Social media CTA section — Instagram grid + follow prompt */
export function SocialSection() {
  const instagram = SOCIALS.find(s => s.icon === 'instagram');
  const creatives = PROMO_CREATIVES.slice(0, 4);

  return (
    <Section spacing="md">
      <Container>
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <Instagram className="w-5 h-5 text-terracotta" />
            <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium">Follow the Journey</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">@visitvagad</h2>
          <p className="mt-2 text-text-secondary max-w-lg">
            Stories, reels, and cinematic moments from across the Vagad region. Follow us for daily inspiration.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {creatives.map((creative, i) => {
            const src = creative.src.startsWith('http') ? creative.src : getImageKitUrl(creative.src, { width: 400, quality: 80 });
            return (
              <StaggerItem key={i}>
                <a href={instagram?.url || '#'} target="_blank" rel="noopener noreferrer" className="group block relative aspect-square rounded-xl overflow-hidden bg-surface-alt">
                  <Image
                    src={src}
                    alt={creative.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-surface-dark/0 group-hover:bg-surface-dark/30 transition-colors flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-off-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {instagram && (
          <FadeIn>
            <div className="mt-8 text-center">
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-deep-teal border border-deep-teal/30 rounded-xl hover:bg-deep-teal/5 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </a>
            </div>
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}
