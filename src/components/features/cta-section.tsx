import Image from 'next/image';
import Link from 'next/link';
import { Container, Button } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';
import { getOptimizedUrl, PLACEHOLDER_IMAGES } from '@/lib/images';
import { getCreative } from '@/constants/creatives';

export function CTASection() {
  const creative = getCreative('cta');
  const ctaUrl = getOptimizedUrl(creative?.src || PLACEHOLDER_IMAGES.cta, 'hero');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <Image
        src={ctaUrl}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/70 via-surface-dark/60 to-surface-dark/70" />

      <Container className="relative z-10 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-off-white tracking-tight">
            Begin Your Vagad Story
          </h2>
          <p className="mt-4 text-lg text-off-white/80 max-w-xl mx-auto">
            Plan your journey through tribal heritage, sacred rivers, and timeless landscapes.
          </p>
          <Link href="/plan-your-trip" className="inline-block mt-8">
            <Button size="lg">Start Planning</Button>
          </Link>
        </FadeIn>
      </Container>
    </section>
  );
}
