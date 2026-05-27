"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function DashboardNavbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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
