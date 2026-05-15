import { Section, Container } from '@/components/ui';

export default function DestinationsLoading() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="h-8 w-48 bg-surface-alt rounded animate-pulse" />
        <div className="h-5 w-96 max-w-full bg-surface-alt rounded animate-pulse mt-4" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl bg-surface-alt animate-pulse" />
              <div className="h-4 w-3/4 bg-surface-alt rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
