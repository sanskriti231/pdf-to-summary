export function SummarySkeleton() {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted-foreground/50">Loading summary...</p>
      </div>
    </div>
  );
}
