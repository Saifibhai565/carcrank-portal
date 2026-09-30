import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const bank = searchParams.get("bank") || "Sandbox Bank";

  if (!clientId || !redirectUri || !state) {
    return NextResponse.json(
      { error: "invalid_request", message: "Missing client_id, redirect_uri, or state" },
      { status: 400 }
    );
  }

  // Generate temporary mock auth code
  const authCode = "ob_code_" + crypto.randomBytes(12).toString("hex");

  // Redirect to Consent UI
  const consentUrl = new URL("/oauth/consent", request.url);
  consentUrl.searchParams.set("bank", bank);
  consentUrl.searchParams.set("redirect_uri", redirectUri);
  consentUrl.searchParams.set("state", state);
  consentUrl.searchParams.set("code", authCode);

  return NextResponse.redirect(consentUrl);
}