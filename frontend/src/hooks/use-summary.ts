"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { SummaryDetail } from "@/app/summary/types";
import { getSummary } from "@/app/summary/api";

export function useSummary(id: string) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState<SummaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication failed");
      const data = await getSummary(id, token);
      setSummary(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load summary";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (isLoaded && isSignedIn && id) {
      loadSummary();
    }
  }, [isLoaded, isSignedIn, id, loadSummary, router]);

  const handleCopySummary = useCallback(() => {
    if (summary?.summary) {
      navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [summary]);

  return {
    isLoaded,
    isSignedIn,
    summary,
    loading,
    error,
    copied,
    loadSummary,
    handleCopySummary,
  };
}
