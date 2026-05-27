"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3L5 7l4 4"/>
          </svg>
          back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{summary.page_count} pages</span>
          <button
            onClick={onCopy}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? "copied" : "copy"}
          </button>
          <a
            href={getDownloadUrl(summary.original_filename.replace(".pdf", "_summary.txt"))}
            target="_blank"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            download
          </a>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}
