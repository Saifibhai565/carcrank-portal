import { NextResponse } from "next/server";
import { handleBrowserType, handleBrowserSpecialKey } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { text, key, sessionId } = await req.json();

    if (key === "Backspace" || key === "Enter" || key === "Delete" || key === "Tab") {
      await handleBrowserSpecialKey(sessionId, key);
    } else if (text) {
      await handleBrowserType(sessionId, text);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Type error" }, { status: 500 });
  }
}