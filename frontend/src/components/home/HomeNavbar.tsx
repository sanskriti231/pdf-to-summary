"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HomeNavbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — next-themes returns undefined on server
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <span className="text-sm font-medium tracking-tight text-foreground">
          pdf to summary
        </span>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                history
              </button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-6 w-6",
                    userButtonOuterIdentifier: "text-xs text-muted-foreground",
                  },
                }}
              />
            </>
          ) : (
            <button
              onClick={() => router.push("/sign-in")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              sign in
            </button>
          )}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-7 w-7 items-center justify-center rounded text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {theme === "dark" ? "light" : "dark"}
            </button>
          )}
          {/* Ensure the button has the same layout space even before mount */}
          {!mounted && (
            <div className="h-7 w-7" aria-hidden="true" />
          )}
        </div>
      </div>
    </nav>
  );
}
