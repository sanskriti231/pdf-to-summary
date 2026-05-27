export function DashboardSkeleton() {
  return (
    <div className="mt-8 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-muted skeleton-shimmer" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-48 rounded bg-muted skeleton-shimmer" />
            <div className="h-2 w-24 rounded bg-muted skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
