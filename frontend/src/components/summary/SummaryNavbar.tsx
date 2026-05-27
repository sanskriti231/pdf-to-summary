"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import type { SummaryDetail } from "@/app/summary/types";
import { getDownloadUrl } from "@/app/summary/api";

interface SummaryNavbarProps {
  summary: SummaryDetail;
  copied: boolean;
  onCopy: () => void;
}

export function SummaryNavbar({ summary, copied, onCopy }: SummaryNavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Left */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3L5 7l4 4"/>
          </svg>
          back
        </button>

        {/* Right */}
        <div className="flex items-center gap-1">
          <span className="mr-2 text-[0.65rem] text-muted-foreground/50">
            {summary.page_count} pages
          </span>

          {/* Copy */}
          <button
            onClick={onCopy}
            className="flex h-7 w-7 items-center justify-center rounded text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
            title="Copy summary"
          >
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6.5l2.5 2.5L10 4"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="1" width="8" height="8" rx="1.5"/>
                <path d="M1 4.5v7a.5.5 0 00.5.5h7"/>
              </svg>
            )}
          </button>

          {/* Download */}
          <a
            href={getDownloadUrl(summary.original_filename.replace(".pdf", "_summary.txt"))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
            title="Download summary"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 9V2M3.5 6l3 3 3-3M2 10v1h9v-1"/>
            </svg>
          </a>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-7 w-7 items-center justify-center rounded text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              {isDark ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6.5" cy="6.5" r="2.5"/>
                  <path d="M6.5 1v1M6.5 11v1M1.5 6.5h1M10.5 6.5h1M3 3l.5.5M9.5 9.5l.5.5M3 10l.5-.5M9.5 3.5l.5-.5"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.5 8a4.5 4.5 0 01-5.5-5.5A4.5 4.5 0 0010.5 8z"/>
                </svg>
              )}
            </button>
          )}
          {!mounted && <div className="h-7 w-7" aria-hidden="true" />}
        </div>
      </div>
    </nav>
  );
}
