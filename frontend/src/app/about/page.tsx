"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const WORKSPACE_IMAGE =
  "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";
const TEAM_IMAGE =
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <span className="text-sm font-medium tracking-tight text-foreground">
            pdf to summary
          </span>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            back to home
          </button>
        </div>
      </nav>

      <div className="h-14" />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            About
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            PDF to Summary turns dense documents into clear, actionable
            summaries using a local AI model — no data leaves your machine.
          </p>
        </motion.div>
      </section>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mx-auto mt-12 max-w-6xl px-5 sm:px-8"
      >
        <div className="relative overflow-hidden rounded bg-muted">
          <img
            src={WORKSPACE_IMAGE}
            alt="Minimalist workspace with papers and laptop"
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-[0.6rem] text-muted-foreground/40">
          Photo by Bench Accounting on Unsplash
        </p>
      </motion.div>

      {/* Story section */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              Our Story
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Reading long PDFs is tedious. We built a tool that extracts the
              essence — fast — using a local T5-small transformer model that
              runs entirely in your environment. No data is ever sent to an
              external API for summarization.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              After your PDF is summarized, you can ask follow-up questions
              through our Groq-powered chat interface. This means the heavy
              lifting (summarization) stays local, while optional conversation
              uses a cloud LLM.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              How It Works
            </h2>
            <ul className="mt-4 space-y-4">
              {[
                ["Upload", "Drop any PDF — from research papers to legal documents"],
                ["Summarize", "T5-small extracts key points in 240-word chunks, then combines them"],
                ["Explore", "Chat with your document to ask questions and dig deeper"],
              ].map(([step, desc]) => (
                <li key={step} className="flex gap-4">
                  <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {String(["01", "02", "03"][
                      ["Upload", "Summarize", "Explore"].indexOf(step)
                    ])}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {step}
                    </span>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Team image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mx-auto mt-20 max-w-6xl px-5 sm:px-8"
      >
        <div className="relative overflow-hidden rounded bg-muted">
          <img
            src={TEAM_IMAGE}
            alt="Team collaborating in a modern office"
            className="h-56 w-full object-cover sm:h-72"
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-[0.6rem] text-muted-foreground/40">
          Photo by Proxyclick Visitor Management System on Unsplash
        </p>
      </motion.div>

      {/* Values */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 sm:grid-cols-3"
        >
          {[
            [
              "Privacy First",
              "Summarization runs locally. Your documents never leave your machine.",
            ],
            [
              "Open Source",
              "Built with open models and transparent code. No black boxes.",
            ],
            [
              "Practical AI",
              "We use AI where it adds real value — not for the sake of hype.",
            ],
          ].map(([title, desc]) => (
            <div key={title} className="border-l pl-4">
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-28 max-w-6xl border-t px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground/60">
          <span>&copy; {new Date().getFullYear()} pdf to summary.</span>
          <button
            onClick={() => router.push("/")}
            className="transition-colors hover:text-foreground"
          >
            back to home
          </button>
        </div>
      </footer>
    </div>
  );
}
