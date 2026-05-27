"use client";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1639413665566-2f75adf7b7ca?w=1400&q=80&auto=format&fit=crop";

export function HeroSection({ children }: { children: React.ReactNode }) {
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
          Upload any PDF — a book chapter, research paper, or business report
          — and get a clear, intelligent summary in seconds. Then ask
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
