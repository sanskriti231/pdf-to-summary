"use client";

import { useState, useEffect } from "react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1639413665566-2f75adf7b7ca?w=1400&q=80&auto=format&fit=crop";

const SAMPLE_PROMPTS = [
  "a research paper",
  "a business report",
  "a book chapter",
  "an academic thesis",
  "a legal document",
];

export function HeroSection({ children }: { children: React.ReactNode }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = SAMPLE_PROMPTS[promptIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, promptIndex]);

  return (
    <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          pdf summarization
        </p>

        <h1 className="mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
          Large documents
          <br />
          deserve a short read.
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Upload any PDF —{" "}
          <span className="inline-block min-w-[9em] text-foreground">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
          <br />
          and get a clear, intelligent summary in seconds. Then ask
          questions and dig deeper.
        </p>

        {children}
      </div>

      <div className="hidden lg:block">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
