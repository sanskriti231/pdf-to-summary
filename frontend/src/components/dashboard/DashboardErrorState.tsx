"use client";

interface DashboardErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function DashboardErrorState({ message, onRetry }: DashboardErrorStateProps) {
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
