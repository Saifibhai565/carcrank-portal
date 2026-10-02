import { NextResponse } from "next/server";
import { handleBrowserAction } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { action, url } = await req.json();
    await handleBrowserAction(action, url);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}