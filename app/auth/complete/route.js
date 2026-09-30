import { NextResponse } from "next/server";
import { consumeAuthorizationCode } from "@/lib/qr-session";
import { createDemoSession } from "@/lib/demo-auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  // Validate and single-use consume
  const result = consumeAuthorizationCode(code);
  if (result.error) {
    return NextResponse.json({ error: `Auth failed: ${result.error}` }, { status: 401 });
  }

  // Create local demo session
  const sessionId = createDemoSession(result.transactionId);

  // Redirect to Dashboard with HttpOnly cookie
  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  response.cookies.set("carcrank_demo_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });

  return response;
}