"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function HomeFooter() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 border-t pt-12 pb-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <span className="text-sm font-medium tracking-tight text-foreground">
            pdf to summary
          </span>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Upload any PDF and get a clear, intelligent summary in seconds.
            Then ask questions and dig deeper — all from your browser.
          </p>
          {!isSignedIn && (
            <button
              onClick={() => router.push("/sign-up")}
              className="mt-4 text-xs font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
            >
              get started free &rarr;
            </button>
          )}
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-foreground">
            Product
          </h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <button
                onClick={() => router.push("/")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push(isSignedIn ? "/dashboard" : "/sign-in")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                New Summary
              </button>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-foreground">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <button
                onClick={() => router.push("/about")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/privacy")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/privacy")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </button>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-foreground">
            Connect
          </h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Twitter / X
              </a>
            </li>
            <li>
              <span className="text-xs text-muted-foreground">
                support@pdftosummary.app
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 flex items-center justify-between border-t pt-5 text-[0.65rem] text-muted-foreground/60">
        <span>&copy; {year} pdf to summary. All rights reserved.</span>
        <div className="flex items-center gap-4">
          {!isSignedIn && (
            <button
              onClick={() => router.push("/sign-up")}
              className="transition-colors hover:text-foreground"
            >
              get started
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
