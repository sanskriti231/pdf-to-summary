"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import type { SummaryDetail } from "@/app/summary/types";
import type { Flashcard } from "@/types";
import { generateFlashcards } from "@/app/summary/api";

interface FlashcardPanelProps {
  summary: SummaryDetail;
}

export function FlashcardPanel({ summary }: FlashcardPanelProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [numCards, setNumCards] = useState(8);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [showKnown, setShowKnown] = useState(true);

  const startFlashcards = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setKnownCards(new Set());
    try {
      const result = await generateFlashcards(summary.id, numCards);
      setCards(result.cards);
      setStarted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate flashcards";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [summary.id, numCards, loading]);

  const flipCard = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const markKnown = useCallback(() => {
    setKnownCards((prev) => new Set(prev).add(currentIndex));
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const markUnknown = useCallback(() => {
    const newSet = new Set(knownCards);
    newSet.delete(currentIndex);
    setKnownCards(newSet);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  }, [currentIndex, cards.length, knownCards]);

  const goNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFlipped(false);
    }
  }, [currentIndex]);

  const reset = useCallback(() => {
    setStarted(false);
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setKnownCards(new Set());
  }, []);

  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
  const displayCards = showKnown
    ? cards
    : cards.filter((_, i) => !knownCards.has(i));

  if (!started) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40">
              <path d="M4 4h14a1 1 0 011 1v10a1 1 0 01-1 1H8l-4 3V5a1 1 0 011-1z"/>
              <path d="M8 9h6M8 12h4"/>
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-foreground">Study Flashcards</h3>
          <p className="mt-1.5 text-xs text-muted-foreground/50 leading-relaxed">
            Review key concepts from this document with interactive flashcards. Flip to reveal the answer.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <label className="text-xs text-muted-foreground/60">Cards:</label>
            {[5, 8, 12].map((n) => (
              <button
                key={n}
                onClick={() => setNumCards(n)}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  numCards === n
                    ? "bg-foreground text-background"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={startFlashcards}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-1.5 rounded bg-foreground px-4 py-2 text-xs font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <polygon points="3,2 10,6 3,10" fill="currentColor"/>
                </svg>
                Start Studying
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground/50">No cards generated</p>
          <button onClick={reset} className="mt-3 text-xs text-muted-foreground underline hover:text-foreground">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const current = cards[currentIndex];
  const isKnown = knownCards.has(currentIndex);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-3">
        <span className="text-xs text-muted-foreground/60">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKnown((prev) => !prev)}
            className={`text-xs transition-colors ${
              showKnown ? "text-muted-foreground/60" : "text-emerald-500"
            }`}
          >
            {showKnown ? "All cards" : `Unknown (${cards.length - knownCards.size})`}
          </button>
          <button
            onClick={reset}
            className="text-xs text-muted-foreground/40 transition-colors hover:text-foreground"
          >
            End study
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="h-0.5 w-full bg-muted/30">
        <div
          className="h-full bg-foreground/20 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="flex flex-1 items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, rotateY: flipped ? 180 : 0 }}
            animate={{ opacity: 1, rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <button
              onClick={flipCard}
              className="w-full cursor-pointer"
            >
              <div
                className={`rounded-xl border p-8 text-center transition-all ${
                  flipped
                    ? "border-primary/20 bg-primary/5"
                    : "bg-background hover:border-muted-foreground/20"
                }`}
              >
                {flipped ? (
                  <div>
                    <span className="mb-3 inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                      Answer
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {current.back}
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="mb-3 inline-block rounded bg-muted/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                      Question
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-foreground">
                      {current.front}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-1.5 rounded-full bg-muted/30 px-3 py-1">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground/30">
                      <path d="M5 1v8M9 5H1" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[10px] text-muted-foreground/40">
                      tap to flip
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t px-5 py-3"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-foreground disabled:opacity-20"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M7 3L4 6l3 3"/>
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={markKnown}
                className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-600 transition-all hover:bg-emerald-500/20 dark:text-emerald-400"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2.5 6l3 3 4-4"/>
                </svg>
                Know it
              </button>
              <button
                onClick={markUnknown}
                className="inline-flex items-center gap-1 rounded bg-red-500/10 px-3 py-1.5 text-xs text-red-600 transition-all hover:bg-red-500/20 dark:text-red-400"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 4l4 4M8 4l-4 4"/>
                </svg>
                Still learning
              </button>
            </div>

            {currentIndex < cards.length - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
              >
                Next
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <path d="M5 3l3 3-3 3"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-all hover:opacity-90"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <polygon points="3,2 10,6 3,10" fill="currentColor"/>
                </svg>
                New Set
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
