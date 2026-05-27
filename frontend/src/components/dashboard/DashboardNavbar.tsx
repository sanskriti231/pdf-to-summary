"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-medium tracking-tight text-foreground transition-colors hover:text-muted-foreground"
        >
          pdf to summary
        </button>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            new summary
          </button>
          {isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-6 w-6",
                  userButtonOuterIdentifier: "text-xs text-muted-foreground",
                },
              }}
            />
          )}
          {mounted ? (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-5 w-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                {theme === "dark" ? (
                  <path d="M6.5 10.5a4 4 0 100-8 4 4 0 000 8zM6.5 1v1M6.5 11v1M1.5 6.5h1M10.5 6.5h1M3 3l.5.5M9.5 9.5l.5.5M3 10l.5-.5M9.5 3.5l.5-.5"/>
                ) : (
                  <path d="M10.5 8a4.5 4.5 0 01-6-6A4.5 4.5 0 0010.5 8z"/>
                )}
              </svg>
            </button>
          ) : (
            <div className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
      </div>
    </nav>
  );
}
