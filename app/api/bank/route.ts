import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banks = await prisma.bank.findMany();
    return NextResponse.json({ success: true, data: banks });
  } catch (error) {
    console.error("Failed to fetch banks:", error);
    return NextResponse.json(
      { success: false, message: "Banks load nahi ho sake" },
      { status: 500 }
    );
  }
}