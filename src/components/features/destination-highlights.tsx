import { Section, Container } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import type { Highlight } from '@/types';

export function DestinationHighlights({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) return null;

  return (
    <Section spacing="lg" className="bg-surface-alt">
      <Container className="max-w-4xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">
            What Makes It Special
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
            Highlights
          </h2>
        </FadeIn>
        <StaggerContainer className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {highlights.map((h) => (
            <StaggerItem key={h.title}>
              <div className="p-6 rounded-2xl bg-surface hover-drift">
                <span className="text-3xl" aria-hidden="true">{h.icon}</span>
                <h3 className="mt-4 text-lg font-medium text-text-primary">{h.title}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{h.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
