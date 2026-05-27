"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface UploadAreaProps {
  isDragging: boolean;
  processing: boolean;
  processingFileName: string | null;
  processResult: unknown;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAreaClick: () => void;
}

export function UploadArea({
  isDragging,
  processing,
  processingFileName,
  processResult,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onAreaClick,
}: UploadAreaProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onAreaClick}
      className={`group relative mt-8 cursor-pointer border-t border-b py-6 transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/[0.02]"
          : "border-border hover:border-foreground/20"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={onFileSelect}
      />

      <AnimatePresence mode="wait">
        {processing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <p className="text-sm font-medium text-foreground">
              {processingFileName}
            </p>
            <Progress
              value="100"
              className="h-[2px] w-full animate-progress-indeterminate"
            />
            <p className="text-xs text-muted-foreground">
              Generating summary...
            </p>
          </motion.div>
        ) : processResult ? null : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "drop your pdf here" : "drop your pdf here"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                or{" "}
                <span className="cursor-pointer underline underline-offset-2 hover:text-foreground">
                  browse files
                </span>{" "}
                &mdash; up to 100mb
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-muted-foreground transition-colors group-hover:text-foreground"
            >
              <path
                d="M10 3v10M6 7l4-4 4 4M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
