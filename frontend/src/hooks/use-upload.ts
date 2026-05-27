"use client";

import { useState, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import type { ProcessResult } from "@/app/home/types";
import { uploadPdf, processPdf } from "@/app/home/api";

export function useUpload() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(
    null
  );

  const handleProcess = useCallback(
    async (filename: string) => {
      setProcessing(true);
      let processToastId: string | number | undefined;
      try {
        processToastId = toast.loading("Generating summary...");
        const clerkId = user?.id;
        const result = await processPdf(filename, clerkId);
        setProcessResult(result);
        toast.dismiss(processToastId);
        setTimeout(() => toast.success("Summary ready"), 200);
      } catch (err: unknown) {
        toast.dismiss(processToastId);
        const message =
          err instanceof Error ? err.message : "Processing failed";
        toast.error(message);
      } finally {
        setProcessing(false);
      }
    },
    [user]
  );

  const handleUpload = useCallback(
    async (pdfFile: File) => {
      setFile(pdfFile);
      setProcessResult(null);

      try {
        const loadingToastId = toast.loading("Uploading...");
        const result = await uploadPdf(pdfFile);
        toast.dismiss(loadingToastId);
        await handleProcess(result.filename);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Upload failed";
        toast.error(message);
      }
    },
    [handleProcess]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile?.type === "application/pdf") {
        handleUpload(droppedFile);
      } else {
        toast.error("Please upload a valid PDF file");
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        if (selectedFile.type === "application/pdf") {
          handleUpload(selectedFile);
        } else {
          toast.error("Please upload a valid PDF file");
        }
      }
    },
    [handleUpload]
  );

  const handleReset = useCallback(() => {
    setFile(null);
    setProcessResult(null);
  }, []);

  return {
    isDragging,
    file,
    processing,
    processResult,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleUpload,
    handleReset,
    setProcessResult,
  };
}
