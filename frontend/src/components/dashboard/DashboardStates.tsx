"use client";

import { useRouter } from "next/navigation";

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export function DashboardEmptyState({ hasSearchQuery }: EmptyStateProps) {
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

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function DashboardErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-8 flex flex-col items-center py-10">
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 text-xs text-primary underline underline-offset-2 transition-colors hover:text-foreground"
      >
        try again
      </button>
    </div>
  );
}

interface HeaderSectionProps {
  count: number;
}

export function DashboardHeader({ count }: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h1 className="text-lg font-medium tracking-tight text-foreground">
          History
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {count > 0
            ? `${count} summar${count === 1 ? "y" : "ies"}`
            : "Your summarized documents"}
        </p>
      </div>
    </div>
  );
}
