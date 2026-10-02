import { NextResponse } from "next/server";
import { launchProxyBrowser } from "@/lib/browserWorker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, proxyString } = body;

    if (!targetUrl) {
      return NextResponse.json({ success: false, error: "Target URL zaroori hai" }, { status: 400 });
    }

    const result = await launchProxyBrowser(targetUrl, proxyString);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Server error during launch" }, { status: 500 });
  }
}