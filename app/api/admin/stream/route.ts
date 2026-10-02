import { NextResponse } from "next/server";
import { captureBrowserFrame, isSessionActive, getPendingRedirect, getSelectedSession } from "@/lib/browserWorker";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const sessionId = urlObj.searchParams.get("sessionId") || undefined;

    if (!isSessionActive(sessionId)) {
      return NextResponse.json({ success: false, error: "Session not active" });
    }

    const frame = await captureBrowserFrame(sessionId);
    const redirectUrl = getPendingRedirect();

    if (frame) {
      return NextResponse.json({ success: true, frame, redirectUrl });
    }

    return NextResponse.json({ success: false, error: "Frame not available yet" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Stream error" }, { status: 500 });
  }
}