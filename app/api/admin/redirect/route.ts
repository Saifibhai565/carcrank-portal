import { NextResponse } from "next/server";
import { setPendingRedirect } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (url) {
      setPendingRedirect(url);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}