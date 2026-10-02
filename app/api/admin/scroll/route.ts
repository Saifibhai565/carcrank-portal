import { NextResponse } from "next/server";
import { handleBrowserScroll } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { deltaY } = await req.json();
    if (typeof deltaY === "number") {
      await handleBrowserScroll(deltaY);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}