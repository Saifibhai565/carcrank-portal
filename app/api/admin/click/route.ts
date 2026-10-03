import { NextResponse } from "next/server";
import { handleBrowserClick } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { x, y, button, sessionId } = await req.json();
    
    if (typeof x === "number" && typeof y === "number") {
      // 🔥 sessionId lazmi pass honi chahiye taaki sahi session par click ho
      await handleBrowserClick(sessionId, x, y, button || "left");
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: "Invalid coordinates" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}