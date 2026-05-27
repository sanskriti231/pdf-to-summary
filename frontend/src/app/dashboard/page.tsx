"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { MobileSheetNav } from "@/components/dashboard/MobileSheetNav";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { SummaryList } from "@/components/dashboard/SummaryList";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardErrorState } from "@/components/dashboard/DashboardErrorState";

export default function DashboardPage() {
  const {
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
  } = useDashboard();

  return (
    <div className="min-h-[100dvh] bg-background">
      <DashboardNavbar />
      <MobileSheetNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <DashboardHeader count={filteredSummaries.length} />

        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        {loading && <DashboardSkeleton />}

        {!loading && error && (
          <DashboardErrorState message={error} onRetry={loadHistory} />
        )}

        {!loading && !error && filteredSummaries.length === 0 && (
          <DashboardEmptyState hasSearchQuery={searchQuery.length > 0} />
        )}

        {!loading && !error && (
          <SummaryList
            summaries={filteredSummaries}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
