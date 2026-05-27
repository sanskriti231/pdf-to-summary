"""
Local transformer-based summarizer using Hugging Face T5-small.
This is the core summarization engine — runs entirely offline, no API calls.
Groq is used separately for chat/voice Q&A about summaries.
"""
import logging
from transformers import pipeline

# Lazy-loaded pipeline (initialized on first use)
_summarizer_pipeline = None

# Max tokens for input — T5-small has 512 token limit
MAX_INPUT_TOKENS = 480


def _get_pipeline():
    """Initialize and return the T5-small summarization pipeline (lazy-loaded)."""
    global _summarizer_pipeline
    if _summarizer_pipeline is None:
        logging.info("Loading T5-small summarization model...")
        _summarizer_pipeline = pipeline(
            "summarization",
            model="t5-small",
        )
        logging.info("T5-small model loaded successfully.")
    return _summarizer_pipeline


def generate_summary(chunks: list[str]) -> list[str]:
    """
    Generate summaries for each text chunk using the local T5-small model.

    Args:
        chunks: List of text chunks to summarize.

    Returns:
        List of summary strings, one per chunk.
    """
    summarizer = _get_pipeline()
    summaries = []

    for i, chunk in enumerate(chunks):
        # Truncate to model's token limit if needed
        words = chunk.split()
        if len(words) > MAX_INPUT_TOKENS:
            chunk = " ".join(words[:MAX_INPUT_TOKENS])

        try:
            result = summarizer(
                "summarize: " + chunk,
                max_length=120,
                min_length=40,
                do_sample=False,
            )
            summaries.append(result[0]["summary_text"])
        except Exception as e:
            logging.warning(f"Failed to summarize chunk {i}: {e}")
            summaries.append(chunk[:200])  # fallback: first 200 chars

    return summaries
