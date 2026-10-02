import { NextResponse } from "next/server";
import { 
  handleBrowserClick, 
  handleBrowserScroll, 
  handleBrowserMove, 
  handleBrowserType, 
  handleBrowserSpecialKey 
} from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, x, y, button, deltaY, keyName, text, sessionId } = body;

    let success = false;

    if (action === "click") {
      success = await handleBrowserClick(x, y, button || "left", sessionId);
    } else if (action === "scroll") {
      success = await handleBrowserScroll(deltaY, sessionId);
    } else if (action === "move") {
      success = await handleBrowserMove(x, y, sessionId);
    } else if (action === "type") {
      success = await handleBrowserType(text, sessionId);
    } else if (action === "specialKey") {
      success = await handleBrowserSpecialKey(keyName, sessionId);
    }

    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}