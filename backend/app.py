import os
import re
import textwrap
from contextlib import asynccontextmanager

import logging

from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from werkzeug.utils import secure_filename

from db import (init_db, find_or_create_user, find_user_by_clerk_id,
                get_or_create_default_user, create_summary,
                get_summaries, get_summary, delete_summary)
from summarizer import generate_summary
from groq_summarizer import chat_with_summary
from models import (
    UploadResponse,
    ProcessRequest,
    ProcessResponse,
    SummaryHistoryResponse,
    SummaryHistoryItem,
    SummaryDetailResponse,
    ChatRequest,
    ChatResponse,
    ErrorResponse,
)

# Always load .env from the backend directory regardless of CWD
dotenv_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path)

UPLOAD_FOLDER = os.path.abspath(os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(__file__), "uploads")))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf"}

# Max file size: 100MB
MAX_FILE_SIZE = 100 * 1024 * 1024


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: ensure DB tables exist."""
    db_ok = init_db()
    if not db_ok:
        logging.warning("Database not available at startup — will retry on first request")
    yield


app = FastAPI(
    title="PDF-to-Summary API",
    description="Upload PDFs, get AI-powered summaries, and chat with your documents.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Helper ────────────────────────────────────────────────────────────


def _extract_pdf_text(pdf_path: str) -> tuple[str, list[str]]:
    """Extract text from PDF. Returns (full_text, per_page_texts)."""
    import fitz

    doc = fitz.open(pdf_path)
    full_text = ""
    pages_text = []
    for page in doc:
        page_text = page.get_text()
        pages_text.append(page_text)
        full_text += page_text
    doc.close()
    return full_text, pages_text


def _get_pdf_page_count(pdf_path: str) -> int:
    import fitz

    try:
        doc = fitz.open(pdf_path)
        count = len(doc)
        doc.close()
        return count
    except Exception:
        return 0


def _remove_citations(text: str) -> str:
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\(\w+ et al\., \d{4}\)", "", text)
    return text


def _chunk_text(text: str, chunk_size: int = 240) -> list[str]:
    words = text.split()
    return [" ".join(words[i: i + chunk_size]) for i in range(0, len(words), chunk_size)]


# ─── Scalar API Docs ───────────────────────────────────────────────────


@app.get("/scalar", include_in_schema=False)
async def scalar_docs():
    """Render Scalar API reference page."""
    return HTMLResponse(f"""
<!doctype html>
<html>
<head>
    <title>PDF-to-Summary API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>" />
</head>
<body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
""")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "pdf-to-summary"}


# ─── Upload ────────────────────────────────────────────────────────────


@app.post(
    "/api/summarize/upload",
    response_model=UploadResponse,
    responses={400: {"model": ErrorResponse}},
)
async def upload_pdf(
    file: UploadFile = File(...),
):
    """Upload a PDF file. No authentication required. Max file size: 100MB."""
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs allowed.")

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 100MB.")

    with open(filepath, "wb") as f:
        f.write(contents)

    page_count = _get_pdf_page_count(filepath)
    if page_count == 0:
        os.remove(filepath)
        raise HTTPException(status_code=400, detail="Invalid PDF file. Could not read pages.")

    file_size = os.path.getsize(filepath)

    return UploadResponse(filename=filename, page_count=page_count, file_size=file_size)


# ─── Process ───────────────────────────────────────────────────────────


@app.post(
    "/api/summarize/process",
    response_model=ProcessResponse,
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
def process_pdf(
    body: ProcessRequest,
):
    """Process an uploaded PDF and generate a summary using the local T5-small model.
    Optionally provide a `clerk_id` to associate the summary with a signed-in user.
    """
    filename = secure_filename(body.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found. Upload the PDF first.")

    full_text, pages_text = _extract_pdf_text(filepath)
    if not full_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF. The file may contain scanned images.",
        )

    original_word_count = len(full_text.split())
    cleaned_text = _remove_citations(full_text)
    cleaned_text = " ".join(cleaned_text.split())
    # Use 240-word chunks for T5-small (512 token limit)
    chunks = _chunk_text(cleaned_text, 240)

    # Summarize chunks using local T5-small model
    summary_parts = generate_summary(chunks)

    final_summary = "\n".join(summary_parts)
    formatted = textwrap.fill(final_summary, width=100).capitalize()

    # Save summary file
    summary_filename = filename.rsplit(".", 1)[0] + "_summary.txt"
    summary_path = os.path.join(UPLOAD_FOLDER, summary_filename)
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(formatted)

    summary_word_count = len(formatted.split())

    # Determine user — use clerk_id if provided, otherwise use default anonymous user
    if body.clerk_id:
        user_id = find_or_create_user(body.clerk_id)
    else:
        user_id = get_or_create_default_user()

    file_size = os.path.getsize(filepath)
    summary_id = create_summary(
        user_id=user_id,
        original_filename=filename,
        page_count=len(pages_text),
        original_word_count=original_word_count,
        summary_word_count=summary_word_count,
        chunks_processed=len(chunks),
        summary=formatted,
        file_size=file_size,
    )

    return ProcessResponse(
        summary=formatted,
        summary_word_count=summary_word_count,
        original_word_count=original_word_count,
        chunks_processed=len(chunks),
        page_count=len(pages_text),
        id=summary_id,
    )


# ─── History ───────────────────────────────────────────────────────────


@app.get("/api/summarize/history", response_model=SummaryHistoryResponse)
def list_summaries(
    clerk_id: str = Query(None, description="Optional — filter summaries by Clerk user ID"),
):
    """List summaries. Optionally filter by `clerk_id`. No authentication required."""
    user_id = None
    if clerk_id:
        user_id = find_user_by_clerk_id(clerk_id)

    rows = get_summaries(user_id)

    items = [
        SummaryHistoryItem(
            id=r["id"],
            original_filename=r["original_filename"],
            page_count=int(r["page_count"]),
            summary_word_count=int(r["summary_word_count"]),
            original_word_count=int(r["original_word_count"]),
            created_at=r.get("created_at", ""),
        )
        for r in rows
    ]
    return SummaryHistoryResponse(summaries=items)


# ─── Single Summary ────────────────────────────────────────────────────


@app.get(
    "/api/summarize/{summary_id}",
    response_model=SummaryDetailResponse,
    responses={404: {"model": ErrorResponse}},
)
def get_summary_detail(
    summary_id: str,
):
    """Get a single summary by ID. No authentication required."""
    summary = get_summary(summary_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")

    return SummaryDetailResponse(
        id=summary["id"],
        original_filename=summary["original_filename"],
        page_count=int(summary["page_count"]),
        original_word_count=int(summary["original_word_count"]),
        summary_word_count=int(summary["summary_word_count"]),
        chunks_processed=int(summary["chunks_processed"]),
        summary=summary["summary"],
        file_size=int(summary["file_size"]),
        created_at=summary.get("created_at", ""),
        updated_at=summary.get("updated_at", ""),
    )


# ─── Delete ────────────────────────────────────────────────────────────


@app.delete(
    "/api/summarize/{summary_id}",
    responses={404: {"model": ErrorResponse}},
)
def delete_summary_endpoint(
    summary_id: str,
):
    """Delete a summary by ID. No authentication required."""
    deleted = delete_summary(summary_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Summary not found")
    return {"success": True}


# ─── Download ──────────────────────────────────────────────────────────


@app.get(
    "/api/summarize/download/{filename:path}",
    responses={404: {"model": ErrorResponse}},
)
def download_summary(
    filename: str,
):
    """Download a summary text file. No authentication required."""
    if not filename.endswith("_summary.txt"):
        raise HTTPException(status_code=400, detail="Invalid filename")

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(filepath, filename=filename, media_type="text/plain")


# ─── Chat with PDF ─────────────────────────────────────────────────────


@app.post(
    "/api/summarize/chat",
    response_model=ChatResponse,
    responses={404: {"model": ErrorResponse}},
)
def chat_with_document(
    body: ChatRequest,
):
    """Chat with a previously summarized PDF document. No authentication required."""
    summary = get_summary(body.summary_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")

    # Re-read the original PDF to get full text
    original_filename = summary["original_filename"]
    filepath = os.path.join(UPLOAD_FOLDER, original_filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Original PDF file not found")

    full_text, _ = _extract_pdf_text(filepath)

    answer = chat_with_summary(full_text, body.message)
    return ChatResponse(response=answer)


# ─── Entry point ───────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True, timeout_keep_alive=300)
