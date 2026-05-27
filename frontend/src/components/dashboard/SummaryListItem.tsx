"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import type { SummaryHistoryItem } from "@/app/dashboard/types";
import { getDownloadUrl } from "@/app/dashboard/api";
import { formatDate } from "@/lib/utils";

interface SummaryListItemProps {
  summary: SummaryHistoryItem;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

export function SummaryListItem({
  summary,
  deletingId,
  onDelete,
}: SummaryListItemProps) {
  const router = useRouter();

  return (
    <motion.div
      layout
      exit={{ opacity: 0, x: -10, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="group flex items-center justify-between border-b py-3 transition-colors hover:bg-accent/30"
    >
      <button
        onClick={() => router.push(`/summary/${summary.id}`)}
        className="flex items-center gap-3 min-w-0 text-left flex-1"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary">
            <path d="M9 1v3a1 1 0 001 1h3M3 13h8a2 2 0 002-2V5l-4-4H3a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate max-w-[180px] sm:max-w-[350px]">
            {summary.original_filename}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <span>{formatDate(summary.created_at)}</span>
            <span>{summary.page_count} pg</span>
            <span>{summary.summary_word_count.toLocaleString()} words</span>
          </div>
        </div>
      </button>

      <div className="flex items-center gap-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() =>
            window.open(
              getDownloadUrl(summary.original_filename.replace(".pdf", "_summary.txt")),
              "_blank"
            )
          }
          className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="download"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6.5 9V2M4.5 7l2 2 2-2M2.5 9.5v1a1 1 0 001 1h6a1 1 0 001-1v-1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(summary.id)}
          disabled={deletingId === summary.id}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
          aria-label="delete"
        >
          {deletingId === summary.id ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 3.5h7M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5 5v4.5M8 5v4.5M2.5 3.5h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
}
