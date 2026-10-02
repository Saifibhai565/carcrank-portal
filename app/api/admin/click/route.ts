import { NextResponse } from "next/server";
import { handleBrowserClick } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { x, y, button } = await req.json();
    if (typeof x === "number" && typeof y === "number") {
      await handleBrowserClick(x, y, button || "left");
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}