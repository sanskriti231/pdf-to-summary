from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    filename: str
    page_count: int
    file_size: int


class ProcessRequest(BaseModel):
    filename: str
    clerk_id: Optional[str] = None


class ProcessResponse(BaseModel):
    summary: str
    summary_word_count: int
    original_word_count: int
    chunks_processed: int
    page_count: int
    id: str
    gen_time: float = 0.0
    total_time: float = 0.0
    compression_ratio: float = 0.0


class SummaryHistoryItem(BaseModel):
    id: str
    original_filename: str
    page_count: int
    summary_word_count: int
    original_word_count: int
    created_at: str


class SummaryHistoryResponse(BaseModel):
    summaries: list[SummaryHistoryItem]


class SummaryDetailResponse(BaseModel):
    id: str
    original_filename: str
    page_count: int
    original_word_count: int
    summary_word_count: int
    chunks_processed: int
    summary: str
    file_size: int
    created_at: str
    updated_at: str
    gen_time: float = 0.0
    total_time: float = 0.0
    compression_ratio: float = 0.0


class ChatRequest(BaseModel):
    summary_id: str
    message: str


class ChatResponse(BaseModel):
    response: str


class ErrorResponse(BaseModel):
    error: str
