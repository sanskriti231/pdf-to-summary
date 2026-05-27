"use client";

import { useRouter } from "next/navigation";

interface SummaryErrorStateProps {
  message: string;
}

export function SummaryErrorState({ message }: SummaryErrorStateProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3">
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={() => router.push("/dashboard")}
        className="text-xs text-primary underline underline-offset-2"
      >
        back to dashboard
      </button>
    </div>
  );
}
