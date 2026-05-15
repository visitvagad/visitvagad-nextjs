'use client';

import { FadeIn } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import type { Destination } from '@/types';

export function DestinationHero({ destination }: { destination: Destination }) {
  const imgUrl = destination.heroImage || PLACEHOLDER_IMAGES[destination.slug as keyof typeof PLACEHOLDER_IMAGES] || PLACEHOLDER_IMAGES.fallback;

  return (
    <section className="relative h-[70vh] sm:h-[80vh] min-h-[480px] max-h-[900px] flex items-end overflow-hidden -mt-16 md:-mt-20">
      {/* Cinematic background with subtle zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02] motion-safe:animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url('${imgUrl}')` }}
        role="img"
        aria-label={`${destination.title} — ${destination.district}, Rajasthan`}
      />
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-surface-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <FadeIn delay={0.1}>
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-terracotta font-medium mb-3">
            {destination.district} · {destination.bestTime && `Best: ${destination.bestTime}`}
          </span>
        </FadeIn>
        <FadeIn delay={0.3}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-off-white tracking-tight leading-[1.05]">
            {destination.title}
          </h1>
        </FadeIn>
        <FadeIn delay={0.5}>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-off-white/85 max-w-2xl leading-relaxed font-light">
            {destination.summary}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
