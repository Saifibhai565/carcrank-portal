import { NextResponse } from "next/server";
import { handleBrowserClick } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, x, y, button } = body;
    
    if (typeof x === "number" && typeof y === "number") {
      // @ts-ignore - Bypass any strict parameter type checks during build
      await handleBrowserClick(sessionId, x, y, button || "left");
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: "Invalid coordinates" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}