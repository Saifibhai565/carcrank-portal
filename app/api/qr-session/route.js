import { NextResponse } from "next/server";
import { createQrTransaction } from "@/lib/qr-session";

export async function POST() {
  try {
    const tx = createQrTransaction();
    return NextResponse.json({ success: true, ...tx });
  } catch (err) {
    console.error("QR Session generation error:", err);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}