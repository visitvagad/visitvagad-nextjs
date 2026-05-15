'use client';

import { useState } from 'react';
import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getOptimizedUrl } from '@/lib/images';
import { X } from 'lucide-react';
import type { GalleryImage } from '@/types';

/** Cinematic masonry layout classes for visual variety */
const LAYOUT_CLASSES = [
  'md:col-span-2 md:row-span-2',
  '',
  '',
  'md:col-span-2',
  '',
  '',
  'md:col-span-2',
  '',
];

export function DestinationGallery({ gallery }: { gallery: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (gallery.length === 0) return null;

  return (
    <>
      <Section spacing="md">
        <Container>
          <FadeIn>
            <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
              Gallery
            </p>
            <Heading as="h2">Visual Journey</Heading>
          </FadeIn>

          <StaggerContainer className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[220px]">
            {gallery.map((img, i) => (
              <StaggerItem key={img.src + i} className={LAYOUT_CLASSES[i % LAYOUT_CLASSES.length]}>
                <button
                  onClick={() => setLightbox(i)}
                  className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden group bg-surface-alt cursor-zoom-in"
                  aria-label={`View ${img.alt || img.caption || 'gallery image'}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${getOptimizedUrl(img.src, 'gallery')}')` }}
                    role="img"
                    aria-label={img.alt}
                  />
                  <div className="absolute inset-0 bg-surface-dark/0 group-hover:bg-surface-dark/30 transition-colors duration-300" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs sm:text-sm text-off-white/90 line-clamp-2">{img.caption}</p>
                    </div>
                  )}
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-surface-dark/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-label="Image lightbox"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-off-white/70 hover:text-off-white z-10"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <div
              className="w-full h-[70vh] bg-cover bg-center rounded-xl"
              style={{ backgroundImage: `url('${getOptimizedUrl(gallery[lightbox].src, 'hero')}')` }}
              role="img"
              aria-label={gallery[lightbox].alt}
            />
            {gallery[lightbox].caption && (
              <p className="mt-4 text-center text-off-white/80 text-sm">{gallery[lightbox].caption}</p>
            )}

            {/* Navigation */}
            {gallery.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-surface-dark/60 text-off-white flex items-center justify-center hover:bg-surface-dark/80"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-surface-dark/60 text-off-white flex items-center justify-center hover:bg-surface-dark/80"
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
