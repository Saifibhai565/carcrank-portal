import { NextResponse } from "next/server";
import { handleBrowserClick } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { sessionId, x, y, button } = await req.json();
    
    if (typeof x === "number" && typeof y === "number") {
      // Yahan check kar lein ke function parameters ka order kya hai (sessionId, x, y, button)
      await handleBrowserClick(sessionId, x, y, (button === "right" ? "right" : "left"));
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: "Invalid coordinates" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}