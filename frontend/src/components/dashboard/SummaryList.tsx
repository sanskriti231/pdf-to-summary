"use client";

import { AnimatePresence } from "framer-motion";

import type { SummaryHistoryItem } from "@/app/dashboard/types";
import { SummaryListItem } from "./SummaryListItem";

interface SummaryListProps {
  summaries: SummaryHistoryItem[];
  deletingId: string | null;
  onDelete: (id: string) => void;
}

export function SummaryList({ summaries, deletingId, onDelete }: SummaryListProps) {
  if (summaries.length === 0) return null;

  return (
    <div className="mt-6 space-y-0">
      <AnimatePresence mode="popLayout">
        {summaries.map((summary) => (
          <SummaryListItem
            key={summary.id}
            summary={summary}
            deletingId={deletingId}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
