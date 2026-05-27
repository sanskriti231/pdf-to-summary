"use client";

import { motion } from "framer-motion";

const BENEFITS = [
  {
    title: "Save hours of reading",
    description:
      "Let AI extract the key points from any document in seconds, so you can focus on what matters.",
  },
  {
    title: "Ask follow-up questions",
    description:
      "Not satisfied with the summary? Chat with your document to explore specific sections or concepts.",
  },
  {
    title: "Everything stays organized",
    description:
      "Your summaries are saved to your dashboard — revisit, search, and share them anytime.",
  },
];

export function WhySection() {
  return (
    <section className="mt-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            why pdf to summary
          </p>

          <h2 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Your documents,
            <br />
            distilled.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We built this tool because reading shouldn&apos;t be a bottleneck.
            Whether you&apos;re a researcher sifting through papers, a
            professional digesting reports, or a student studying textbooks —
            you deserve the essence, not the noise.
          </p>

          <ul className="mt-8 space-y-5">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex items-start gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mt-0.5 shrink-0 text-primary"
                >
                  <path
                    d="M13.3 4.3L6 11.6 2.7 8.3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div className="aspect-[4/3] overflow-hidden bg-muted lg:aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1200&q=80&auto=format&fit=crop"
              alt="Minimalist workspace"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-2 text-[0.6rem] text-muted-foreground/40">
            Photo by Bench Accounting on Unsplash
          </div>
        </motion.div>
      </div>
    </section>
  );
}
