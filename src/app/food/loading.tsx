import { Section, Container } from '@/components/ui';

export default function FoodLoading() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="h-8 w-40 bg-surface-alt rounded animate-pulse" />
        <div className="h-5 w-72 max-w-full bg-surface-alt rounded animate-pulse mt-4" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 space-y-3">
              <div className="h-3 w-16 bg-surface-alt rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-surface-alt rounded animate-pulse" />
              <div className="h-4 w-full bg-surface-alt rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-surface-alt rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
