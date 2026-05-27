"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getDownloadUrl } from "@/lib/api";

import type { SummaryDetail } from "@/app/summary/types";

export type TabId = "summary" | "chat" | "quiz" | "flashcards" | "analytics";

interface SummaryNavbarProps {
  summary: SummaryDetail;
  copied: boolean;
  onCopy: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "chat", label: "Chat" },
  { id: "quiz", label: "Quiz" },
  { id: "flashcards", label: "Flashcards" },
  { id: "analytics", label: "Analytics" },
];

export function SummaryNavbar({ summary, copied, onCopy, activeTab, onTabChange }: SummaryNavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = useCallback(() => {
    const summaryFilename = summary.original_filename.replace(".pdf", "_summary.txt");
    window.open(getDownloadUrl(summaryFilename), "_blank");
    toast.success("Downloading summary...");
  }, [summary.original_filename]);

  return (
    <div className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
        {/* Left: Back + filename */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label="Back to dashboard"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3L5 7l4 4"/>
            </svg>
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{summary.original_filename}</p>
            <p className="text-xs text-muted-foreground/50">{summary.page_count} pages · {summary.original_word_count.toLocaleString()} words</p>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center gap-0.5 rounded-lg bg-muted/30 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label="Copy summary"
            title="Copy summary"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                <path d="M3 7l3 3 5-5"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4.5" y="4.5" width="8" height="8" rx="1"/>
                <path d="M2 9.5V2.5A.5.5 0 012.5 2h7"/>
              </svg>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label="Download summary"
            title="Download summary"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 2v7M4 6l3 3 3-3M2 11v.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V11"/>
            </svg>
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="7" r="3"/>
                  <path d="M7 1v1M7 12v1M1.5 7h1M11.5 7h1M3.5 3.5l.5.5M9.5 9.5l.5.5M3.5 10.5l.5-.5M9.5 4.5l.5-.5"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 8.5A4.5 4.5 0 016.5 4 4.5 4.5 0 0011 8.5z"/>
                </svg>
              )}
            </button>
          )}
          {!mounted && <div className="h-7 w-7" />}
        </div>
      </div>
    </div>
  );
}
