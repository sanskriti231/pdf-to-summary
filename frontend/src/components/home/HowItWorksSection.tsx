"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Upload your PDF",
    description:
      "Drag and drop any PDF — a research paper, book chapter, or business report — up to 100 MB.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80&auto=format&fit=crop",
    photographer: "Glenn Carstens-Peters",
  },
  {
    number: "02",
    title: "AI processes it",
    description:
      "Our intelligent system reads, analyzes, and distills the content into a clear, structured summary.",
    image:
      "https://images.unsplash.com/photo-1644088379091-d574269d422f?w=800&q=80&auto=format&fit=crop",
    photographer: "Conny Schneider",
  },
  {
    number: "03",
    title: "Read & explore",
    description:
      "Review your summary, ask follow-up questions, and dive deeper into any topic that interests you.",
    image:
      "https://images.unsplash.com/photo-1760819028378-8fdb5d442521?w=800&q=80&auto=format&fit=crop",
    photographer: "Yen Vu",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function HowItWorksSection() {
  return (
    <section className="mt-28">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          how it works
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          From PDF to insight in seconds
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Three simple steps to turn any document into actionable knowledge.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10"
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            variants={itemVariants}
            className="group relative"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={step.image}
                alt={step.title}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
              />
            </div>

            <div className="mt-5">
              <span className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground">
                {step.number}
              </span>
              <h3 className="mt-1.5 text-base font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            <div className="mt-3 text-[0.6rem] text-muted-foreground/40">
              Photo by {step.photographer} on Unsplash
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
