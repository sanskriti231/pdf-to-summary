"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import type { SummaryHistoryItem } from "@/app/dashboard/types";
import { getHistory, deleteSummary } from "@/app/dashboard/api";

export function useDashboard() {
  const { user } = useUser();

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
      const clerkId = user?.id;
      const data = await getHistory(clerkId);
      setSummaries(data.summaries);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load history";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteSummary(id);
        setSummaries((prev) => prev.filter((s) => s.id !== id));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete";
        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    },
    []
  );

  const filteredSummaries = summaries.filter((s) =>
    s.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
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
