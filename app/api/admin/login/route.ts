import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionValue } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  console.log("TYPED:", JSON.stringify(password), "| ENV:", JSON.stringify(process.env.ADMIN_PASSWORD));

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD isn't set on the server." },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const value = await createSessionValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // <-- Isko false karein taaki HTTP par reload se logout na ho
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 din tak valid rahega
  });
  return res;
}