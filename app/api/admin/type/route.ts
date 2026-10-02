import { NextResponse } from "next/server";
import { handleBrowserType, handleBrowserSpecialKey } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { text, key } = await req.json();

    if (key === "Backspace") {
      await handleBrowserSpecialKey("Backspace");
    } else if (key === "Enter") {
      await handleBrowserSpecialKey("Enter");
    } else if (text) {
      await handleBrowserType(text);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Type error" }, { status: 500 });
  }
}