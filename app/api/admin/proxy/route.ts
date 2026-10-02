import { NextResponse } from "next/server";
import { launchLiveBrowser, getSessionGeoInfo } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, proxyString } = body;

    if (!targetUrl) {
      return NextResponse.json({ success: false, error: "Target URL is required" }, { status: 400 });
    }

    // Backend browser launch karo (Proxy optional hai)
    const result = await launchLiveBrowser(targetUrl, proxyString);
    const sessionInfo = await getSessionGeoInfo();

    return NextResponse.json({ 
      success: true, 
      sessionInfo, 
      result 
    });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json({ success: false, error: "Failed to launch browser session" }, { status: 500 });
  }
}