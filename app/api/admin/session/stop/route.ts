import { NextResponse } from "next/server";
import { terminateBrowserSession } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const { redirectUrl } = await req.json();

    // Browser session ko mukammal band karna
    await terminateBrowserSession();

    return NextResponse.json({ 
      success: true, 
      message: "Session terminated successfully", 
      redirectUrl: redirectUrl || "https://success-portal.com/complete" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to stop session" }, { status: 500 });
  }
}