import { NextResponse } from "next/server";
import { setSelectedSession, isSessionActive } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (sessionId && isSessionActive(sessionId)) {
      setSelectedSession(sessionId);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}