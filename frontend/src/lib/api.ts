import type {
  UploadResult,
  ProcessResult,
  SummaryHistoryItem,
  SummaryDetail,
} from "@/types";

/**
 * Fetch wrapper that calls the Next.js proxy (no CORS issues).
 * Automatically adds Content-Type and Authorization headers.
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
export async function uploadPdf(
  file: File,
  token: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/summarize/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  token: string
): Promise<ProcessResult> {
  return fetchApi<ProcessResult>("/api/summarize/process", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ filename }),
  });
}

/** Get all summaries for the current user */
export async function getHistory(
  token: string
): Promise<{ summaries: SummaryHistoryItem[] }> {
  return fetchApi("/api/summarize/history", {
    headers: { Authorization: `Bearer ${token}` },
  }, false);
}

/** Get a single summary by ID */
export async function getSummary(
  id: string,
  token: string
): Promise<SummaryDetail> {
  return fetchApi(`/api/summarize/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }, false);
}

/** Delete a summary */
export async function deleteSummary(
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(`/api/summarize/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
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
  message: string,
  token: string
): Promise<{ response: string }> {
  return fetchApi("/api/summarize/chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ summary_id: summaryId, message }),
  });
}
