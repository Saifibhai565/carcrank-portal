import { NextResponse } from "next/server";
import { terminateBrowserSession, setPendingRedirect } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { sessionId, redirectUrl } = await req.json();
    if (redirectUrl) {
      setPendingRedirect(redirectUrl);
    }
    if (sessionId) {
      await terminateBrowserSession(sessionId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to stop session" }, { status: 500 });
  }
}