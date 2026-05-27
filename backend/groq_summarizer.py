import os
import re
from typing import Optional

from groq import Groq

client: Optional[Groq] = None


def _get_client() -> Groq:
    global client
    if client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable not set")
        client = Groq(api_key=api_key)
    return client


# The best Groq models for summarization & chat
SUMMARIZATION_MODEL = "llama-3.1-8b-instant"
CHAT_MODEL = "llama-3.3-70b-versatile"


def summarize_text(text: str, max_summary_length: int = 300) -> str:
    """
    Summarize a chunk of text using Groq's Mixtral model.
    Returns the summary string.
    """
    groq_client = _get_client()
    response = groq_client.chat.completions.create(
        model=SUMMARIZATION_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a precise summarization assistant. "
                    "Generate a concise, coherent summary of the provided text. "
                    "Preserve key facts, figures, and conclusions. "
                    "Do not add commentary or opinions."
                ),
            },
            {"role": "user", "content": f"Summarize the following text:\n\n{text}"},
        ],
        max_tokens=max_summary_length,
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()


def chat_with_summary(pdf_text: str, user_message: str, history: Optional[list] = None) -> str:
    """
    Chat with the content of a PDF. `pdf_text` is the full extracted text,
    `user_message` is the user's question, and `history` is previous chat turns.
    """
    if history is None:
        history = []

    groq_client = _get_client()
    system_prompt = (
        "You are a helpful assistant that answers questions based on the provided document. "
        "Use only the information from the document to answer. "
        "If the answer cannot be found in the document, say so clearly. "
        "Keep responses concise and informative.\n\n"
        f"--- DOCUMENT CONTENT ---\n{pdf_text[:15000]}\n--- END OF DOCUMENT ---"
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
