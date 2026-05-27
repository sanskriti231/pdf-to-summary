"""
Groq-powered chat module for PDF Q&A.

This is only used for the chat/voice feature where users can ask questions
about their PDFs. The actual PDF summarization uses the local T5-small model.
"""
import os
from typing import Optional

from groq import Groq

client: Optional[Groq] = None

CHAT_MODEL = "llama-3.3-70b-versatile"


def _get_client() -> Groq:
    global client
    if client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable not set")
        client = Groq(api_key=api_key, timeout=60)
    return client


def chat_with_summary(pdf_text: str, user_message: str, history: Optional[list] = None) -> str:
    """
    Chat with the content of a PDF using Groq's LLM.
    This is used for the Q&A / voice mode feature on the summary page.

    Args:
        pdf_text: Full text of the PDF document.
        user_message: The user's question.
        history: Previous chat turns for context (max last 10).

    Returns:
        The AI's response text.
    """
    if history is None:
        history = []

    groq_client = _get_client()

    # Truncate document text to avoid token limits (llama-3.3-70b has 128k context)
    max_doc_chars = 30000
    truncated_text = pdf_text[:max_doc_chars]

    system_prompt = (
        "You are a helpful assistant that answers questions based on the provided document. "
        "Use only the information from the document to answer. "
        "If the answer cannot be found in the document, say so clearly. "
        "Keep responses concise and informative.\n\n"
        f"--- DOCUMENT CONTENT ---\n{truncated_text}\n--- END OF DOCUMENT ---"
    )

    messages = [{"role": "system", "content": system_prompt}]
    for turn in history[-10:]:  # Keep last 10 turns for context
        messages.append(turn)
    messages.append({"role": "user", "content": user_message})

    response = groq_client.chat.completions.create(
        model=CHAT_MODEL,
        messages=messages,
        max_tokens=800,
        temperature=0.5,
    )
    return response.choices[0].message.content.strip()
