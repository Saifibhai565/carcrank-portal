import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    const updatedBank = await prisma.bank.update({
      where: { id },
      data: {
        name: body.name ?? "Bank",
        subtitle: body.subtitle ?? "Multiple available",
        subOptions: body.subOptions ?? "Business, Personal, Commercial",
        logoUrl: body.logoUrl ?? null,
        order: Number(body.order) || 1,
        personalUrl: body.personalUrl ?? null,
        businessUrl: body.businessUrl ?? null,
        commercialUrl: body.commercialUrl ?? null,
        enablePersonal: Boolean(body.enablePersonal),
        enableBusiness: Boolean(body.enableBusiness),
        enableCommercial: Boolean(body.enableCommercial),
        popupStatus: body.popupStatus ?? "SUCCESS",
      },
    });

    return NextResponse.json({ success: true, data: updatedBank });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to update bank" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await prisma.bank.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to delete bank" }, { status: 500 });
  }
}