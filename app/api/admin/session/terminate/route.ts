import { NextResponse } from "next/server";
import { terminateSession, terminateAllSessions } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, terminateAll } = body;
    
    if (terminateAll) {
      if (terminateAllSessions) await terminateAllSessions();
      return NextResponse.json({ success: true, message: "All sessions terminated" });
    }

    if (sessionId) {
      if (terminateSession) await terminateSession(sessionId);
      return NextResponse.json({ success: true, message: `Session ${sessionId} terminated` });
    }

    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}