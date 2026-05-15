interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Content is being curated. Check back soon.',
  icon = '🏜️',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-4xl mb-4" aria-hidden="true">{icon}</span>
      <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-muted max-w-sm">{description}</p>
    </div>
  );
}
