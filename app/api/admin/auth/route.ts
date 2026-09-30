import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Simple custom access credentials 
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin4321@";

// 1. Session status check function (GET)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session && session.value === "authenticated") {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// 2. Authentication Login Handler (POST)
export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const cookieStore = await cookies();
      
      // Cookie parameters precise check to avoid authorization state failure on localhost
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // Keep live for 24 hours
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth process error:", error);
    return NextResponse.json({ success: false, message: "Authentication service error" }, { status: 500 });
  }
}

// 3. User Session Removal / Log out (DELETE)
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}