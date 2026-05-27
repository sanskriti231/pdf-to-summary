interface DashboardHeaderProps {
  count: number;
  totalWords?: number;
  totalPages?: number;
  avgCompression?: number;
}

export function DashboardHeader({ count, totalWords = 0, totalPages = 0, avgCompression = 0 }: DashboardHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {count > 0
              ? `${count} summar${count === 1 ? "y" : "ies"}`
              : "Your summarized documents"}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      {count > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border bg-muted/10 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Summaries
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {count}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/10 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Words Analyzed
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {totalWords >= 1000
                ? `${(totalWords / 1000).toFixed(1)}k`
                : totalWords.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/10 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Pages
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {totalPages}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/10 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
              Avg Compression
            </p>
            <p className="mt-1 text-lg font-medium text-foreground">
              {avgCompression > 0 ? `${avgCompression}%` : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
