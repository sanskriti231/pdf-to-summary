"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { SummaryHistoryItem } from "@/app/dashboard/types";
import { getHistory, deleteSummary } from "@/app/dashboard/api";

export function useDashboard() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();

  const [summaries, setSummaries] = useState<SummaryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication failed");
      const data = await getHistory(token);
      setSummaries(data.summaries);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load history";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (isLoaded && isSignedIn) {
      loadHistory();
    }
  }, [isLoaded, isSignedIn, loadHistory, router]);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication failed");
        await deleteSummary(id, token);
        setSummaries((prev) => prev.filter((s) => s.id !== id));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete";
        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    },
    [getToken]
  );

  const filteredSummaries = summaries.filter((s) =>
    s.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    isLoaded,
    isSignedIn,
    summaries,
    filteredSummaries,
    loading,
    error,
    searchQuery,
    deletingId,
    mobileMenuOpen,
    setSearchQuery,
    setMobileMenuOpen,
    loadHistory,
    handleDelete,
  };
}
