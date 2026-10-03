import { NextResponse } from "next/server";

// Global storage for redirect URL and active sessions reference if needed
let globalRedirectUrl: string | null = null;

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      redirectUrl: globalRedirectUrl 
    });
  } catch (error) {
    return NextResponse.json({ success: false, redirectUrl: null }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, sessionId } = body;
    
    if (url) {
      globalRedirectUrl = url;

      // 🔥 Agar koi active remote browser session chal raha hai, toh Playwright ko direct command dein
      try {
        // Agar aapke paas session manager ya browser instance global hai toh yahan navigate karwa sakte hain:
        // await activePage.goto(url);
      } catch (e) {
        console.log("Puppeteer navigation error:", e);
      }

      return NextResponse.json({ success: true, redirectUrl: globalRedirectUrl });
    }
    
    return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}