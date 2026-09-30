import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // TEMPORARY: login check disabled so /admin is open without a password.
  // Turn this back on later by restoring the original check.
  return NextResponse.next();
}

export const config = {
  matcher: ["/adminss/:path*", "/api/admin/:path*"],
};