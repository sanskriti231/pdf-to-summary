"use client";

import { useRouter } from "next/navigation";

interface DashboardEmptyStateProps {
  hasSearchQuery: boolean;
}

export function DashboardEmptyState({ hasSearchQuery }: DashboardEmptyStateProps) {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col items-center py-10">
      <p className="text-sm text-muted-foreground">
        {hasSearchQuery ? "no matches" : "no summaries yet"}
      </p>
      {!hasSearchQuery && (
        <button
          onClick={() => router.push("/")}
          className="mt-2 text-xs text-primary underline underline-offset-2 transition-colors hover:text-foreground"
        >
          upload a pdf
        </button>
      )}
    </div>
  );
}
