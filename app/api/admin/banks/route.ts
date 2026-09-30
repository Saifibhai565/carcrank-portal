import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: banks });
  } catch (error) {
    console.error("Failed to fetch banks:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBank = await prisma.bank.create({
      data: {
        name: body.name,
        subtitle: body.subtitle,
        subOptions: body.subOptions || "Business, Personal, Commercial",
        logoUrl: body.logoUrl || null,
        order: Number(body.order) || 1,
        personalUrl: body.personalUrl || null,
        businessUrl: body.businessUrl || null,
        commercialUrl: body.commercialUrl || null,
        enablePersonal: Boolean(body.enablePersonal),
        enableBusiness: Boolean(body.enableBusiness),
        enableCommercial: Boolean(body.enableCommercial),
        popupStatus: body.popupStatus || "SUCCESS",
      },
    });
    return NextResponse.json({ success: true, data: newBank });
  } catch (error) {
    console.error("Failed to create bank:", error);
    return NextResponse.json({ success: false, error: "Failed to create bank" }, { status: 500 });
  }
}