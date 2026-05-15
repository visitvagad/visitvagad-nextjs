import { Section, Container } from '@/components/ui';

export default function EventsLoading() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="h-8 w-48 bg-surface-alt rounded animate-pulse" />
        <div className="h-5 w-80 max-w-full bg-surface-alt rounded animate-pulse mt-4" />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-5 p-4">
              <div className="w-28 h-28 shrink-0 rounded-xl bg-surface-alt animate-pulse" />
              <div className="flex-1 space-y-3 py-2">
                <div className="h-3 w-24 bg-surface-alt rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-surface-alt rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-alt rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
