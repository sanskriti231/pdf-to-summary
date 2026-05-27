"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";
const PHONE_IMAGE =
  "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

export default function PrivacyPage() {
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
            Privacy
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Your documents stay yours. We designed PDF to Summary so that
            the most sensitive part — the summarization — never touches a
            remote server.
          </p>
        </motion.div>
      </section>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mx-auto mt-12 max-w-6xl px-5 sm:px-8"
      >
        <div className="relative overflow-hidden rounded bg-muted">
          <img
            src={HERO_IMAGE}
            alt="Digital security concept with connected blocks"
            className="h-56 w-full object-cover sm:h-72"
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-[0.6rem] text-muted-foreground/40">
          Photo by Shubham Dhage on Unsplash
        </p>
      </motion.div>

      {/* Content sections */}
      <section className="mx-auto mt-20 max-w-3xl px-5 sm:px-8">
        <div className="space-y-12">
          {[
            [
              "Local Summarization",
              "PDF-to-Summary uses the T5-small transformer model that runs entirely on your machine. When you upload a PDF and generate a summary, the document text is processed locally. No data is ever sent to an external API for summarization. Your document never leaves your environment.",
            ],
            [
              "Chat & Groq Integration",
              "Optional chat conversations use Groq's API (llama-3.3-70b) to answer questions about your document. Only the question and a truncated portion of the extracted text are sent to Groq. The original PDF file is never uploaded to any third party. You can use the summarization feature entirely without chat if you prefer.",
            ],
            [
              "Data Storage",
              "We store summary text and metadata (filename, page count, word counts) in a Turso Cloud database. The original PDF file is stored on the server only temporarily for extraction. You can delete any summary at any time, which removes both the summary and its associated metadata.",
            ],
            [
              "Third-Party Services",
              "The only external services integrated are:\n\n• Clerk — for optional sign-in/sign-up (handles authentication, not document data)\n• Turso — for storing summary metadata (not the original PDF)\n• Groq — for optional chat Q&A (receives questions + truncated text from your PDF)\n\nEach service operates under its own privacy policy and data processing agreement.",
            ],
            [
              "Your Rights",
              "You have full control over your data. You can:\n\n• View all your summaries from the dashboard\n• Delete any summary at any time\n• Use the tool without creating an account\n• Choose whether to use the chat feature or not\n\nTo request data deletion beyond the self-service options, contact support@pdftosummary.app.",
            ],
          ].map(([title, body]) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-medium tracking-tight text-foreground">
                {title}
              </h2>
              <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {body}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Image break */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mx-auto mt-20 max-w-6xl px-5 sm:px-8"
      >
        <div className="relative overflow-hidden rounded bg-muted">
          <img
            src={PHONE_IMAGE}
            alt="Phone security concept"
            className="h-48 w-full object-cover sm:h-64"
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-[0.6rem] text-muted-foreground/40">
          Photo by Franck on Unsplash
        </p>
      </motion.div>

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
