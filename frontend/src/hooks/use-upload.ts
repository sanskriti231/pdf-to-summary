"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ProcessResult } from "@/app/home/types";
import { uploadPdf, processPdf } from "@/app/home/api";

export function useUpload() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(
    null
  );

  const handleProcess = useCallback(
    async (filename: string, token: string) => {
      setProcessing(true);
      let processToastId: string | number | undefined;
      try {
        processToastId = toast.loading("Generating summary...");
        const result = await processPdf(filename, token);
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
    []
  );

  const handleUpload = useCallback(
    async (pdfFile: File) => {
      if (!isLoaded) {
        toast.error("Sign in status loading — please try again");
        return;
      }
      if (!isSignedIn) {
        toast.error("Please sign in to upload files");
        router.push("/sign-in");
        return;
      }

      setFile(pdfFile);
      setProcessResult(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication failed");

        const loadingToastId = toast.loading("Uploading...");
        const result = await uploadPdf(pdfFile, token);
        toast.dismiss(loadingToastId);
        await handleProcess(result.filename, token);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Upload failed";
        toast.error(message);
      }
    },
    [isLoaded, isSignedIn, getToken, router, handleProcess]
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
    isLoaded,
    isSignedIn,
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
