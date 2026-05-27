"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import type { ProcessResult } from "@/app/home/types";
import { Button } from "@/components/ui/button";

interface ResultsSectionProps {
  processResult: ProcessResult;
  onNewFile: () => void;
}

export function ResultsSection({
  processResult,
  onNewFile,
}: ResultsSectionProps) {
  const router = useRouter();

  const compressionRatio = processResult.compression_ratio ??
    Math.round((processResult.summary_word_count / processResult.original_word_count) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-16"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-t pt-6">
        <div>
          <p className="text-base font-medium text-foreground">
            Summary ready
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {processResult.original_word_count.toLocaleString()} words &rarr;{" "}
            {processResult.summary_word_count.toLocaleString()} words
            &middot; {processResult.page_count} pages
            &middot; {compressionRatio}% compression
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewFile}
            className="text-xs"
          >
            new file
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/summary/${processResult.id}`)}
            className="text-xs bg-foreground text-background hover:bg-foreground/90"
          >
            read & chat
          </Button>
        </div>
      </div>

      {/* Processing metrics */}
      {(processResult.gen_time || processResult.total_time) && (
        <div className="mt-4 flex items-center gap-5">
          {processResult.chunks_processed && (
            <span className="text-[0.6rem] text-muted-foreground/40">
              {processResult.chunks_processed} chunks
            </span>
          )}
          {processResult.gen_time && (
            <span className="text-[0.6rem] text-muted-foreground/40">
              gen: {processResult.gen_time}s
            </span>
          )}
          {processResult.total_time && (
            <span className="text-[0.6rem] text-muted-foreground/40">
              total: {processResult.total_time}s
            </span>
          )}
          <span className="text-[0.6rem] text-muted-foreground/40">
            model: T5-small (local)
          </span>
        </div>
      )}

      {/* Summary preview */}
      <div className="mt-6 max-w-2xl rounded-lg border bg-muted/20 p-5">
        <p className="whitespace-pre-wrap text-sm leading-[1.8] text-muted-foreground">
          {processResult.summary}
        </p>
      </div>
    </motion.section>
  );
}
