import type {
  UploadResult,
  ProcessResult,
  SummaryHistoryItem,
  SummaryDetail,
} from "@/types";

/**
 * Fetch wrapper that calls the Next.js proxy (no CORS issues).
 * No authentication headers needed.
 */
async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
  contentJson: boolean = true
): Promise<T> {
  const headers: Record<string, string> = {};

  // Add content-type for JSON bodies
  if (contentJson && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  // Merge caller headers
  if (options.headers) {
    const callerHeaders = options.headers as Record<string, string>;
    Object.assign(headers, callerHeaders);
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message: string;
    try {
      const body = await res.json();
      message = body.error || body.detail || res.statusText;
    } catch {
      message = res.statusText || `Request failed with status ${res.status}`;
    }
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

/** Upload a PDF file */
export async function uploadPdf(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/summarize/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let message: string;
    try {
      const body = await res.json();
      message = body.error || body.detail || "Upload failed";
    } catch {
      message = "Upload failed";
    }
    throw new Error(message);
  }

  return res.json();
}

/** Process a PDF and get its summary */
export async function processPdf(
  filename: string,
  clerkId?: string
): Promise<ProcessResult> {
  return fetchApi<ProcessResult>("/api/summarize/process", {
    method: "POST",
    body: JSON.stringify({ filename, clerk_id: clerkId || undefined }),
  });
}

/** Get all summaries, optionally filtered by Clerk user ID */
export async function getHistory(
  clerkId?: string
): Promise<{ summaries: SummaryHistoryItem[] }> {
  const params = clerkId ? `?clerk_id=${encodeURIComponent(clerkId)}` : "";
  return fetchApi(`/api/summarize/history${params}`, {}, false);
}

/** Get a single summary by ID */
export async function getSummary(id: string): Promise<SummaryDetail> {
  return fetchApi(`/api/summarize/${id}`, {}, false);
}

/** Delete a summary */
export async function deleteSummary(id: string): Promise<void> {
  const res = await fetch(`/api/summarize/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.detail || "Delete failed");
  }
}

/** Download a summary as text */
export function getDownloadUrl(filename: string) {
  return `/api/summarize/download/${filename}`;
}

/** Chat with a PDF */
export async function chatWithPdf(
  summaryId: string,
  message: string
): Promise<{ response: string }> {
  return fetchApi("/api/summarize/chat", {
    method: "POST",
    body: JSON.stringify({ summary_id: summaryId, message }),
  });
}
