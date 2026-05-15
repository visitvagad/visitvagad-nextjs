import { Section, Container, Heading } from '@/components/ui';
import { FadeIn } from '@/components/ui/motion';

const stats = [
  { value: '1,500+', label: 'Years of Heritage' },
  { value: '100+', label: 'Islands in Banswara' },
  { value: '2', label: 'UNESCO-worthy Sites' },
];

export function WhyVagadSection() {
  return (
    <Section spacing="lg">
      <Container className="max-w-3xl text-center">
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-6">
            Why Vagad
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Heading as="h2">
            A Land Time Forgot to Change
          </Heading>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-8 text-lg md:text-xl text-text-secondary leading-[1.8] font-light">
            Vagad is where ancient Bhil traditions flow unbroken through generations, where sacred rivers meet at timeless confluences, and where every hill holds a story of resistance and devotion. This is not mass tourism — this is cultural immersion.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <dl className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10" aria-label="Key facts about Vagad">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-4xl md:text-5xl font-bold text-deep-teal tracking-tight">{stat.value}</dd>
                <dt className="mt-2 text-sm text-text-muted tracking-wide">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </FadeIn>
      </Container>
    </Section>
  );
}
