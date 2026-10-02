import { NextResponse } from "next/server";
import { handleBrowserMove } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { x, y } = await req.json();
    if (typeof x === "number" && typeof y === "number") {
      await handleBrowserMove(x, y);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}