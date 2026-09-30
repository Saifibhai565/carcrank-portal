import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS GlobalSettings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    const settings: any = await prisma.$queryRawUnsafe(`SELECT * FROM GlobalSettings;`);
    const formatted: Record<string, string> = {};
    settings.forEach((s: any) => {
      formatted[s.key] = s.value;
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS GlobalSettings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    const keys = [
      "browserUrl",
      "popupTitle",
      "popupMessage",
      "popupButtonText",
      "popupRedirectUrl",
    ];

    for (const key of keys) {
      if (body[key] !== undefined) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO GlobalSettings (key, value) VALUES (?, ?)
           ON CONFLICT(key) DO UPDATE SET value = ?;`,
          key,
          body[key],
          body[key]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}