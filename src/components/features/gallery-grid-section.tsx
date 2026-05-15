import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { PLACEHOLDER_IMAGES } from '@/lib/images';
import type { GalleryImage } from '@/types';

const SPAN_CLASSES = ['sm:col-span-2 sm:row-span-2', '', '', 'sm:col-span-2', ''];

// Fallback gallery when no images in DB
const FALLBACK_GALLERY: GalleryImage[] = [
  { src: PLACEHOLDER_IMAGES['juna-mahal'], alt: 'Juna Mahal frescoes in Dungarpur' },
  { src: PLACEHOLDER_IMAGES['beneshwar-dham'], alt: 'Beneshwar Dham at the sacred confluence' },
  { src: PLACEHOLDER_IMAGES['arthuna-temples'], alt: 'Ancient stone carvings at Arthuna' },
  { src: PLACEHOLDER_IMAGES['mahi-dam'], alt: 'Mahi Dam and the hundred islands' },
  { src: PLACEHOLDER_IMAGES['mangarh-hill'], alt: 'Mangarh Hill memorial at sunrise' },
];

export function GalleryGridSection({ images }: { images: GalleryImage[] }) {
  const displayImages = images.length > 0 ? images : FALLBACK_GALLERY;

  return (
    <Section spacing="lg">
      <Container>
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.15em] text-terracotta font-medium mb-4">
            Gallery
          </p>
          <Heading as="h2">Visual Stories</Heading>
        </FadeIn>

        <StaggerContainer className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[200px]">
          {displayImages.slice(0, 5).map((img, i) => (
            <StaggerItem key={img.src || i} className={SPAN_CLASSES[i] || ''}>
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden group bg-surface-alt">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${img.src}')` }}
                  role="img"
                  aria-label={img.alt}
                />
                <div className="absolute inset-0 bg-surface-dark/0 group-hover:bg-surface-dark/20 transition-colors duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
