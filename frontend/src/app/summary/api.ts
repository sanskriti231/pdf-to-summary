import { getSummary, chatWithPdf, getDownloadUrl } from "@/lib/api";
import type { QuizQuestion, Flashcard } from "@/types";

export { getSummary, chatWithPdf, getDownloadUrl };

/** Generate quiz questions from a summary */
export async function generateQuiz(
  summaryId: string,
  numQuestions: number = 5
): Promise<{ questions: QuizQuestion[] }> {
  const res = await fetch("/api/summarize/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary_id: summaryId, num_questions: numQuestions }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.detail || "Quiz generation failed");
  }
  return res.json();
}

/** Evaluate a quiz answer */
export async function evaluateQuizAnswer(
  summaryId: string,
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<{ feedback: string }> {
  const res = await fetch("/api/summarize/quiz/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary_id: summaryId,
      question,
      user_answer: userAnswer,
      correct_answer: correctAnswer,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.detail || "Evaluation failed");
  }
  return res.json();
}

/** Generate flashcards from a summary */
export async function generateFlashcards(
  summaryId: string,
  numCards: number = 8
): Promise<{ cards: Flashcard[] }> {
  const res = await fetch("/api/summarize/flashcards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary_id: summaryId, num_cards: numCards }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.detail || "Flashcard generation failed");
  }
  return res.json();
}
