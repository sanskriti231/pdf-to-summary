export interface UploadResult {
  filename: string;
  page_count: number;
  file_size: number;
}

export interface ProcessResult {
  summary: string;
  summary_word_count: number;
  original_word_count: number;
  chunks_processed: number;
  page_count: number;
  id: string;
  gen_time?: number;
  total_time?: number;
  compression_ratio?: number;
}

export interface SummaryHistoryItem {
  id: string;
  original_filename: string;
  page_count: number;
  summary_word_count: number;
  original_word_count: number;
  created_at: string;
}

export interface SummaryDetail {
  id: string;
  original_filename: string;
  page_count: number;
  original_word_count: number;
  summary_word_count: number;
  chunks_processed: number;
  summary: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  gen_time?: number;
  total_time?: number;
  compression_ratio?: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
