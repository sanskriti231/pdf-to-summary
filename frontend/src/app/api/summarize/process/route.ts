import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy POST /api/summarize/process to the backend with a 300-second timeout.
 * This is necessary because the built-in Next.js rewrite proxy has a default
 * timeout (~30s) that is too short for processing large PDFs through Groq.
 */
export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
  const targetUrl = `${backendUrl}/api/summarize/process`;

  const body = await request.text();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300_000); // 5 minutes

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      signal: controller.signal,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. The PDF may be too large to process." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to connect to backend" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
