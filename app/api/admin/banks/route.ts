import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: banks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBank = await prisma.bank.create({
      data: {
        name: body.name || "New Bank",
        subtitle: body.subtitle || "Multiple available",
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
  } catch (error: any) {
    console.error("POST Bank Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create bank" }, { status: 500 });
  }
}