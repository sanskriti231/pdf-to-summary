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
      className={`group relative mt-8 cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-foreground/40 bg-foreground/[0.02]"
          : "border-border hover:border-foreground/30 hover:bg-foreground/[0.01]"
      } ${processing || processResult ? "py-6" : "py-16 sm:py-20"}`}
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
            className="flex flex-col items-center gap-3 px-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="text-foreground/60"
              >
                <path d="M9 2v7M6 6l3 3 3-3M3 11v3a1 1 0 001 1h10a1 1 0 001-1v-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {processingFileName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Generating summary with local AI...
              </p>
            </div>
            <Progress
              value="100"
              className="h-[2px] w-full max-w-xs animate-progress-indeterminate"
            />
          </motion.div>
        ) : processResult ? null : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center px-6"
          >
            {/* Upload icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.03] transition-colors group-hover:bg-foreground/[0.06]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-foreground/40 transition-colors group-hover:text-foreground/60"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 3v12M7 9l4-4 4 4"/>
                <path d="M3 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"/>
              </svg>
            </div>

            {/* Text */}
            <p className="mt-5 text-sm font-medium text-foreground">
              Drop your PDF here
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              or{" "}
              <span className="cursor-pointer font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/70">
                browse files
              </span>
            </p>

            {/* Badges */}
            <div className="mt-5 flex items-center gap-3 text-[0.65rem] text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="1" y="1" width="8" height="8" rx="1.5"/>
                  <path d="M3 5h4M5 3v4"/>
                </svg>
                PDF only
              </span>
              <span className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="1" y="2" width="8" height="6" rx="1"/>
                  <path d="M3 1v1M7 1v1"/>
                </svg>
                up to 100 MB
              </span>
              <span className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 1v4l2 1"/>
                  <circle cx="5" cy="5" r="4"/>
                </svg>
                ~5s processing
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
