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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-16"
    >
      <div className="flex items-center justify-between border-t pt-5">
        <div>
          <p className="text-sm font-medium text-foreground">
            Summary generated
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {processResult.original_word_count.toLocaleString()} words &rarr;{" "}
            {processResult.summary_word_count.toLocaleString()} words
            &middot; {processResult.page_count} pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onNewFile} className="text-xs">
            new file
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/summary/${processResult.id}`)}
            className="text-xs"
          >
            chat with summary
          </Button>
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {processResult.summary}
        </p>
      </div>
    </motion.section>
  );
}
