"""
Local transformer-based summarizer using Hugging Face T5-small.
This is the core summarization engine — runs entirely offline, no API calls.
Groq is used separately for chat/voice Q&A about summaries.

Logs performance analytics: model load time, per-chunk inference time,
total generation time, and compression ratio.
"""
import time
import logging
from transformers import pipeline

logger = logging.getLogger("pdf-to-summary.model")

# Lazy-loaded pipeline (initialized on first use)
_summarizer_pipeline = None
_model_load_time: float | None = None

# Max tokens for input — T5-small has 512 token limit
MAX_INPUT_TOKENS = 480


def _get_pipeline():
    """Initialize and return the T5-small summarization pipeline (lazy-loaded)."""
    global _summarizer_pipeline, _model_load_time
    if _summarizer_pipeline is None:
        logger.info("Loading T5-small summarization model...")
        load_start = time.time()
        _summarizer_pipeline = pipeline(
            "summarization",
            model="t5-small",
        )
        _model_load_time = time.time() - load_start
        logger.info(
            "T5-small model loaded in %.2fs — ready to summarize",
            _model_load_time,
        )
    return _summarizer_pipeline


def generate_summary(chunks: list[str]) -> list[str]:
    """
    Generate summaries for each text chunk using the local T5-small model.

    Logs detailed analytics: number of chunks, per-chunk timing,
    total generation time, and compression ratio.

    Args:
        chunks: List of text chunks to summarize.

    Returns:
        List of summary strings, one per chunk.
    """
    summarizer = _get_pipeline()
    summaries = []
    total_chars_in = 0
    total_chars_out = 0
    gen_start = time.time()

    logger.info(
        "Generating summaries — chunks=%d model_load=%.2fs",
        len(chunks), _model_load_time or 0,
    )

    for i, chunk in enumerate(chunks):
        # Truncate to model's token limit if needed
        words = chunk.split()
        if len(words) > MAX_INPUT_TOKENS:
            chunk = " ".join(words[:MAX_INPUT_TOKENS])

        chunk_start = time.time()
        try:
            result = summarizer(
                "summarize: " + chunk,
                max_length=120,
                min_length=40,
                do_sample=False,
            )
            summary_text = result[0]["summary_text"]
            chunk_time = time.time() - chunk_start
            total_chars_in += len(chunk)
            total_chars_out += len(summary_text)

            logger.debug(
                "Chunk %d/%d — input=%dchars output=%dchars time=%.2fs",
                i + 1, len(chunks), len(chunk), len(summary_text), chunk_time,
            )

            summaries.append(summary_text)
        except Exception as e:
            chunk_time = time.time() - chunk_start
            logger.warning(
                "Chunk %d/%d failed after %.2fs — %s",
                i + 1, len(chunks), chunk_time, e,
            )
            summaries.append(chunk[:200])  # fallback: first 200 chars

    total_time = time.time() - gen_start
    ratio = (total_chars_out / total_chars_in * 100) if total_chars_in > 0 else 0

    logger.info(
        "Summary generation complete — chunks=%d time=%.2fs "
        "input=%dchars output=%dchars ratio=%.1f%% avg=%.2fs/chunk",
        len(chunks), total_time,
        total_chars_in, total_chars_out, ratio,
        total_time / len(chunks) if chunks else 0,
    )

    return summaries
