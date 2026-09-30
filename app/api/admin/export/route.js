import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    // CSV Headers
    const headers = [
      "ID",
      "Registration",
      "Bank",
      "User / Name",
      "Memorable Info / Details",
      "Extra Data",
      "Status",
      "Created At",
    ];

    // Build CSV Rows
    const rows = leads.map((lead) => [
      `"${lead.id}"`,
      `"${lead.registration || "N/A"}"`,
      `"${lead.bank || "N/A"}"`,
      `"${(lead.userId || "").replace(/"/g, '""')}"`,
      `"${(lead.memorableInfo || "").replace(/"/g, '""')}"`,
      `"${(lead.extraData || "").replace(/"/g, '""')}"`,
      `"${lead.status || "Pending"}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="carcrank-leads-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}