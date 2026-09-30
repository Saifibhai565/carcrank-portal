import { NextResponse } from "next/server";
import { approveQrTransaction, getQrTransaction } from "@/lib/qr-session";

export async function POST(req) {
  try {
    const { token, action } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
    }

    const tx = getQrTransaction(token);
    if (!tx) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    if (tx.error === "expired") {
      return NextResponse.json({ success: false, error: "QR code has expired" }, { status: 410 });
    }

    if (action === "reject") {
      tx.status = "rejected";
      return NextResponse.json({ success: true, status: "rejected" });
    }

    const approval = approveQrTransaction(token);
    if (approval.error) {
      return NextResponse.json({ success: false, error: approval.error }, { status: 400 });
    }

    // Optional: Relay event to local WebSocket server if running
    try {
      const WebSocket = require("ws");
      const ws = new WebSocket("ws://localhost:8080");
      ws.on("open", () => {
        ws.send(
          JSON.stringify({
            type: "qr_login_approved",
            transactionId: approval.transactionId,
            authorizationCode: approval.authorizationCode,
          })
        );
        ws.close();
      });
    } catch (wsErr) {
      console.log("[WS] Local WS server not yet running on port 8080 (Will link in Step 3)");
    }

    return NextResponse.json({
      success: true,
      status: "approved",
      transactionId: approval.transactionId,
    });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}