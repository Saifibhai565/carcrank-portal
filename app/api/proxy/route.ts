import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ success: false, error: "Target URL missing" }, { status: 400 });
  }

  try {
    // Target site ko server-side fetch karna with custom browser user-agent
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    const htmlContent = await response.text();

    // Response headers banana aur security blocks ko strip karna
    const res = new NextResponse(htmlContent, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/html",
      },
    });

    // 🛡️ Crucial Step: Stripping framing and CSP restrictions
    res.headers.delete("X-Frame-Options");
    res.headers.delete("Content-Security-Policy");
    res.headers.delete("X-Content-Type-Options");

    return res;
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}