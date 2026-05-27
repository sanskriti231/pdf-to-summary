import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all proxy route for all /api/summarize/* endpoints.
 * Forwards requests to the FastAPI backend.
 * (Except /process which has its own dedicated route with a longer timeout.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return proxyRequest(request, proxy);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return proxyRequest(request, proxy);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return proxyRequest(request, proxy);
}

async function proxyRequest(request: NextRequest, proxy: string[]) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
  const path = proxy.join("/");
  const search = request.nextUrl.search;
  const targetUrl = `${backendUrl}/api/summarize/${path}${search}`;

  const method = request.method;

  const headers: Record<string, string> = {};
  if (method !== "GET" && method !== "DELETE") {
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
  }

  try {
    const body = method !== "GET" && method !== "DELETE" ? await request.text() : undefined;

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    // For non-JSON responses (e.g., file downloads)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/plain")) {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": response.headers.get("Content-Disposition") || "",
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to connect to backend" },
      { status: 502 }
    );
  }
}
