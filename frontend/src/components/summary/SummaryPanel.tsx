import type { SummaryDetail } from "@/app/summary/types";

interface SummaryPanelProps {
  summary: SummaryDetail;
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <div className="hidden w-1/2 flex-col border-r lg:flex">
      {/* Header stats */}
      <div className="flex border-b">
        <div className="flex-1 px-5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            words
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {summary.original_word_count.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 px-5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            summary
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {summary.summary_word_count.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 px-5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            pages
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {summary.page_count}
          </p>
        </div>
      </div>

      {/* File info */}
      <div className="border-b px-5 py-2.5">
        <p className="text-xs font-medium text-foreground">
          {summary.original_filename}
        </p>
        <p className="text-[10px] text-muted-foreground/50">
          {summary.chunks_processed} chunks processed
          {summary.original_filename.endsWith(".pdf")
            ? ""
            : ""}
        </p>
      </div>

      {/* Summary content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-5">
          <p className="whitespace-pre-wrap text-sm leading-[1.8] text-muted-foreground">
            {summary.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
