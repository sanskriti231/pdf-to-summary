"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import type { SummaryDetail } from "@/app/summary/types";
import type { QuizQuestion } from "@/types";
import { generateQuiz, evaluateQuizAnswer } from "@/app/summary/api";

interface QuizPanelProps {
  summary: SummaryDetail;
}

export function QuizPanel({ summary }: QuizPanelProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<Record<number, string>>({});
  const [evaluating, setEvaluating] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const startQuiz = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setEvaluations({});
    setEvaluating({});
    try {
      const result = await generateQuiz(summary.id, numQuestions);
      setQuestions(result.questions);
      setStarted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate quiz";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [summary.id, numQuestions, loading]);

  const selectAnswer = useCallback((questionIndex: number, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionKey }));
  }, []);

  const submitAnswer = useCallback(
    async (questionIndex: number) => {
      const q = questions[questionIndex];
      const answer = selectedAnswers[questionIndex];
      if (!answer || evaluating[questionIndex]) return;

      setEvaluating((prev) => ({ ...prev, [questionIndex]: true }));
      try {
        const result = await evaluateQuizAnswer(
          summary.id,
          q.question,
          answer,
          q.correctAnswer
        );
        setEvaluations((prev) => ({ ...prev, [questionIndex]: result.feedback }));
      } catch {
        setEvaluations((prev) => ({
          ...prev,
          [questionIndex]: "Could not evaluate. Moving on!",
        }));
      } finally {
        setEvaluating((prev) => ({ ...prev, [questionIndex]: false }));
      }
    },
    [questions, selectedAnswers, evaluating, summary.id]
  );

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const reset = () => {
    setStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setEvaluations({});
    setEvaluating({});
  };

  // Score is calculated by direct comparison — no dependency on Groq's wording
  const score = Object.keys(evaluations).filter(
    (i) => selectedAnswers[parseInt(i)] === questions[parseInt(i)].correctAnswer
  ).length;

  if (!started) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 8v5M12 15.5v.5"/>
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">Quiz Mode</h3>
        <p className="mt-1.5 text-sm text-muted-foreground/60 leading-relaxed">
          Test your understanding of this document with AI-generated multiple-choice questions.
        </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <label className="text-sm text-muted-foreground/60">Questions:</label>
            {[3, 5, 8].map((n) => (
              <button
                key={n}
                onClick={() => setNumQuestions(n)}
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  numQuestions === n
                    ? "bg-foreground text-background"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={startQuiz}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-1.5 rounded bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
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
                Start Quiz
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  if (!current) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h3 className="text-sm font-medium text-foreground">No questions generated</h3>
          <button onClick={reset} className="mt-4 text-xs text-muted-foreground underline hover:text-foreground">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const hasAnswer = !!selectedAnswers[currentIndex];
  const hasEvaluation = !!evaluations[currentIndex];
  const isCorrect = hasEvaluation && selectedAnswers[currentIndex] === current.correctAnswer;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto min-h-0">
      {/* Header with progress */}
      <div className="flex items-center justify-between border-b px-5 py-3">
        <span className="text-sm text-muted-foreground/60">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-3">
          {score > 0 && (
            <span className="text-sm text-muted-foreground/60">
              Score: {score}/{questions.length}
            </span>
          )}
          <button
            onClick={reset}
            className="text-sm text-muted-foreground/40 transition-colors hover:text-foreground"
          >
            End quiz
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-muted/30">
        <div
          className="h-full bg-foreground/20 transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-base font-medium leading-relaxed text-foreground">
              {current.question}
            </p>

            <div className="mt-4 space-y-2">
              {current.options.map((option) => {
                const optionKey = option.charAt(0);
                const isSelected = selectedAnswers[currentIndex] === optionKey;
                const isCorrectOpt = hasEvaluation && optionKey === current.correctAnswer;

                let optionStyle =
                  "border bg-background text-foreground";
                if (hasEvaluation && isCorrectOpt) {
                  optionStyle =
                    "border-2 border-foreground/40 bg-foreground/5 text-foreground";
                } else if (hasEvaluation && isSelected && !isCorrectOpt) {
                  optionStyle =
                    "border-2 border-foreground/20 bg-muted/40 text-foreground/50";
                } else if (isSelected) {
                  optionStyle =
                    "border-2 border-foreground bg-foreground/5 text-foreground";
                }

                return (
                  <button
                    key={option}
                    onClick={() => {
                      if (!hasEvaluation) selectAnswer(currentIndex, optionKey);
                    }}
                    disabled={hasEvaluation}
                    className={`w-full rounded-lg px-4 py-3 text-left text-sm leading-relaxed transition-all ${optionStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            {!hasEvaluation && (
              <button
                onClick={() => submitAnswer(currentIndex)}
                disabled={!hasAnswer || evaluating[currentIndex]}
                className="mt-5 inline-flex items-center gap-1.5 rounded bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-30"
              >
                {evaluating[currentIndex] ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    Checking...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </button>
            )}

            {/* Evaluation feedback */}
            {hasEvaluation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-lg border bg-muted/20 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground">
                      <path d="M3 7l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40">
                      <path d="M4 4l6 6M10 4l-6 6" strokeLinecap="round"/>
                    </svg>
                  )}
                  <span className={`text-sm font-medium ${isCorrect ? "text-foreground" : "text-foreground/50"}`}>
                    {isCorrect ? "Correct!" : "Not quite"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {evaluations[currentIndex]}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t px-5 py-3">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground/50 transition-colors hover:text-foreground disabled:opacity-20"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <path d="M8 3.5L4.5 7 8 10.5"/>
            </svg>
            Previous
          </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={goToNext}
            className="flex items-center gap-1 text-sm text-muted-foreground/50 transition-colors hover:text-foreground"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <path d="M6 3.5l3.5 3.5L6 10.5"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <polygon points="4,2.5 11,7 4,11.5" fill="currentColor"/>
            </svg>
            New Quiz
          </button>
        )}
      </div>
    </div>
  );
}
