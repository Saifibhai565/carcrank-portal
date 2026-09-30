import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { code, state } = await request.json();

    if (!code || !code.startsWith("ob_code_")) {
      return NextResponse.json({ error: "invalid_grant", message: "Invalid authorization code" }, { status: 400 });
    }

    // Generate mock access token
    const accessToken = "mock_at_" + crypto.randomBytes(16).toString("hex");

    // Return dummy banking ledger snapshot
    return NextResponse.json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: "accounts transactions",
      state: state || null,
      account_data: {
        account_name: "CarCrank Business Fleet Ltd",
        account_number: "88219043",
        sort_code: "20-00-15",
        currency: "GBP",
        balance: 14250.75,
        status: "Verified",
      },
    });
  } catch (error) {
    console.error("Token exchange failed:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}