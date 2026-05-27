"""
Groq-powered chat module for PDF Q&A, quiz generation, and flashcard generation.

The actual PDF summarization uses the local T5-small model.
Groq is used for interactive features: chat, quizzes, and flashcards.
"""
import json
import os
from typing import Optional

from groq import Groq

client: Optional[Groq] = None

CHAT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


def _get_client() -> Groq:
    global client
    if client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable not set")
        client = Groq(api_key=api_key, timeout=60)
    return client


def _get_truncated_text(pdf_text: str, max_chars: int = 30000) -> str:
    """Truncate document text to avoid token limits."""
    return pdf_text[:max_chars]


def chat_with_summary(pdf_text: str, user_message: str, history: Optional[list] = None) -> str:
    """
    Chat with the content of a PDF using Groq's LLM.
    This is used for the Q&A / voice mode feature on the summary page.
    """
    if history is None:
        history = []

    groq_client = _get_client()
    truncated_text = _get_truncated_text(pdf_text)

    system_prompt = (
        "You are a helpful assistant that answers questions based on the provided document. "
        "Use only the information from the document to answer. "
        "If the answer cannot be found in the document, say so clearly. "
        "Keep responses concise and informative.\n\n"
        f"--- DOCUMENT CONTENT ---\n{truncated_text}\n--- END OF DOCUMENT ---"
    )

    messages = [{"role": "system", "content": system_prompt}]
    for turn in history[-10:]:
        messages.append(turn)
    messages.append({"role": "user", "content": user_message})

    response = groq_client.chat.completions.create(
        model=CHAT_MODEL,
        messages=messages,
        max_tokens=800,
        temperature=0.5,
    )
    return response.choices[0].message.content.strip()


# ─── Quiz Generation ───────────────────────────────────────────────────


def generate_quiz(pdf_text: str, num_questions: int = 5) -> str:
    """
    Generate a set of multiple-choice quiz questions from the document content
    using Groq. Returns a JSON string that can be parsed into a list of questions.
    """
    groq_client = _get_client()
    truncated_text = _get_truncated_text(pdf_text)

    prompt = (
        f"Based on the following document, generate {num_questions} multiple-choice "
        "quiz questions to test understanding of the key concepts. "
        "Each question should have 4 options (A, B, C, D) and one correct answer. "
        "Return ONLY valid JSON — no markdown, no code fences, no extra text. "
        "The JSON must be an array of objects with this exact shape:\n"
        '{"question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], '
        '"correctAnswer": "A", "explanation": "..."}\n\n'
        f"--- DOCUMENT CONTENT ---\n{truncated_text}\n--- END OF DOCUMENT ---"
    )

    response = groq_client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": "You are a quiz generator. Always return valid JSON only, no markdown formatting."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=2000,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


# ─── Flashcard Generation ──────────────────────────────────────────────


def generate_flashcards(pdf_text: str, num_cards: int = 8) -> str:
    """
    Generate flashcards from the document content using Groq.
    Returns a JSON string that can be parsed into a list of flashcards.
    """
    groq_client = _get_client()
    truncated_text = _get_truncated_text(pdf_text)

    prompt = (
        f"Based on the following document, generate {num_cards} study flashcards "
        "covering the most important concepts, definitions, and key points. "
        "Each flashcard should have a concise 'front' (concept/question) and 'back' (answer/definition). "
        "Return ONLY valid JSON — no markdown, no code fences, no extra text. "
        "The JSON must be an array of objects with this exact shape:\n"
        '{"front": "What is...?", "back": "The answer is..."}\n\n'
        f"--- DOCUMENT CONTENT ---\n{truncated_text}\n--- END OF DOCUMENT ---"
    )

    response = groq_client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": "You are a flashcard generator. Always return valid JSON only, no markdown formatting."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=3000,
        temperature=0.6,
    )
    return response.choices[0].message.content.strip()


# ─── Quiz Evaluation ───────────────────────────────────────────────────


def evaluate_quiz_answer(pdf_text: str, question: str, user_answer: str, correct_answer: str) -> str:
    """
    Evaluate the user's answer against the correct answer and provide
    a helpful explanation based on the document content.
    """
    groq_client = _get_client()
    truncated_text = _get_truncated_text(pdf_text, 20000)

    prompt = (
        "The user answered a quiz question based on the following document. "
        "Evaluate their answer and provide brief, encouraging feedback. "
        f"Question: {question}\n"
        f"Correct answer: {correct_answer}\n"
        f"User's answer: {user_answer}\n\n"
        "Tell the user if they were correct or not, and explain why using evidence from the document. "
        f"--- DOCUMENT ---\n{truncated_text}\n--- END ---"
    )

    response = groq_client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful tutor providing feedback on quiz answers. Be encouraging and informative."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()
