import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST() {
  try {
    // Backend initializes DB on startup automatically via lifespan
    const res = await fetch(`${API_URL}/api/health`);
    const data = await res.json();

    return NextResponse.json({
      success: true,
      message: "Database initialized (backend auto-initializes on startup)",
      health: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Failed to connect to backend",
        hint: "Make sure the FastAPI backend is running on port 8000",
      },
      { status: 500 }
    );
  }
}
