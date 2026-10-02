import { NextResponse } from "next/server";
import { captureBrowserFrame, isSessionActive } from "@/lib/browserWorker";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isSessionActive()) {
      return NextResponse.json({ success: false, error: "Session not active" });
    }

    const frame = await captureBrowserFrame();
    if (frame) {
      return NextResponse.json({ success: true, frame });
    }

    return NextResponse.json({ success: false, error: "Frame not available yet" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Stream error" }, { status: 500 });
  }
}