"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import type { SummaryDetail } from "@/app/summary/types";
import { getSummary } from "@/app/summary/api";

export function useSummary(id: string) {
  const [summary, setSummary] = useState<SummaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSummary(id);
      setSummary(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load summary";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadSummary();
    }
  }, [id, loadSummary]);

  const handleCopySummary = useCallback(() => {
    if (summary?.summary) {
      navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [summary]);

  return {
    summary,
    loading,
    error,
    copied,
    loadSummary,
    handleCopySummary,
  };
}
