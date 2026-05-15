import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="space-y-16">
      {/* Hero skeleton */}
      <div className="h-[85vh] min-h-[480px] max-h-[900px] bg-surface-alt animate-pulse -mt-16 md:-mt-20" />

      {/* Content skeletons */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
