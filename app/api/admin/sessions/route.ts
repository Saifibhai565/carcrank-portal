import { NextResponse } from "next/server";
import { getActiveSessions } from "@/lib/browserWorker";

export async function GET() {
  try {
    const sessions = getActiveSessions ? getActiveSessions() : [];
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json({ success: false, sessions: [] }, { status: 500 });
  }
}