import { Section, Container } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';

export function DestinationStory({ story }: { story: string }) {
  if (!story) return null;

  // Split story into paragraphs for editorial layout
  const paragraphs = story.split(/\n\n|\. (?=[A-Z])/).filter(Boolean);
  const firstParagraph = paragraphs[0] || story;
  const restOfStory = paragraphs.length > 1 ? paragraphs.slice(1).join('. ') : '';

  // Extract a pull quote (first sentence of second paragraph, or mid-story sentence)
  const pullQuote = paragraphs.length > 1
    ? paragraphs[1].split('.')[0] + '.'
    : story.split('.').slice(2, 3).join('.') + '.';

  return (
    <Section spacing="lg">
      <Container className="max-w-3xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-8">
            The Story
          </p>
        </FadeIn>

        {/* Editorial first paragraph with drop cap */}
        <FadeIn delay={0.1}>
          <p className="text-lg md:text-xl text-text-primary leading-[1.8] first-letter:text-5xl first-letter:font-bold first-letter:text-deep-teal first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
            {firstParagraph}
          </p>
        </FadeIn>

        {/* Pull quote */}
        {pullQuote.length > 20 && (
          <FadeIn delay={0.2}>
            <blockquote className="my-12 md:my-16 pl-6 border-l-2 border-terracotta/40">
              <p className="text-xl md:text-2xl text-text-primary font-light italic leading-relaxed">
                {pullQuote}
              </p>
            </blockquote>
          </FadeIn>
        )}

        {/* Remaining story */}
        {restOfStory && (
          <FadeIn delay={0.3}>
            <p className="text-base md:text-lg text-text-secondary leading-[1.9]">
              {restOfStory}
            </p>
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}
