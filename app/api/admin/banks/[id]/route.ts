import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const updatedBank = await prisma.bank.update({
      where: { id },
      data: {
        name: body.name,
        subtitle: body.subtitle,
        subOptions: body.subOptions,
        logoUrl: body.logoUrl,
        order: body.order !== undefined ? Number(body.order) : undefined,
        popupStatus: body.popupStatus,
        popupHeading: body.popupHeading,
        popupTitle: body.popupHeading || body.popupTitle,
        popupSubheading: body.popupSubheading,
        popupSubtitle: body.popupSubheading || body.popupSubtitle,
        popupBody: body.popupBody,
        popupMessage: body.popupBody || body.popupMessage,
        buttonText: body.buttonText,
        popupButtonText: body.buttonText || body.popupButtonText,
        redirectUrl: body.redirectUrl,
        popupRedirectUrl: body.redirectUrl || body.popupRedirectUrl,
        browserAddressBar: body.browserAddressBar,
        supportPhone: body.supportPhone !== undefined ? body.supportPhone : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedBank });
  } catch (error) {
    console.error("Error updating bank:", error);
    return NextResponse.json(
      { success: false, message: "Database update failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.bank.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bank:", error);
    return NextResponse.json(
      { success: false, message: "Database delete failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}