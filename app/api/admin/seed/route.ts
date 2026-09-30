import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ukBanks = [
  {
    name: "Barclays (UK)",
    subtitle: "Multiple available",
    logoUrl: "https://asset.brandfetch.io/idw_1Qy39B/idJ_28d2sR.png",
    redirectUrl: "https://www.barclays.co.uk",
    sortOrder: 1,
  },
  {
    name: "Tide",
    subtitle: "www.tide.co/",
    logoUrl: "https://asset.brandfetch.io/id1oR_53zR/idV-c_2f6Y.png",
    redirectUrl: "https://www.tide.co",
    sortOrder: 2,
  },
  {
    name: "NatWest",
    subtitle: "Multiple available",
    logoUrl: "https://asset.brandfetch.io/id-eF6K5Vw/idX9iK948t.png",
    redirectUrl: "https://www.natwest.com",
    sortOrder: 3,
  },
  {
    name: "Lloyds Bank",
    subtitle: "Multiple available",
    logoUrl: "https://asset.brandfetch.io/idT2bU4LdY/id4WjJ9102.png",
    redirectUrl: "https://www.lloydsbank.com",
    sortOrder: 4,
  },
  {
    name: "Starling Bank",
    subtitle: "starlingbank.com",
    logoUrl: "https://asset.brandfetch.io/idJ0vU3z0j/idbF1c6G1k.png",
    redirectUrl: "https://www.starlingbank.com",
    sortOrder: 5,
  },
  {
    name: "HSBC UK",
    subtitle: "Multiple available",
    logoUrl: "https://asset.brandfetch.io/idb_dO90zW/id86d7f6c3.png",
    redirectUrl: "https://www.hsbc.co.uk",
    sortOrder: 6,
  },
  {
    name: "Santander",
    subtitle: "www.santander.co.uk",
    logoUrl: "https://asset.brandfetch.io/idwX56_p2E/idm9i-zHw2.png",
    redirectUrl: "https://www.santander.co.uk",
    sortOrder: 7,
  },
  {
    name: "Monzo",
    subtitle: "monzo.com",
    logoUrl: "https://asset.brandfetch.io/idO-G69PqP/idbO_fM18J.png",
    redirectUrl: "https://monzo.com",
    sortOrder: 8,
  },
  {
    name: "Royal Bank of Scotland",
    subtitle: "Multiple available",
    logoUrl: "https://asset.brandfetch.io/idPq-5gL1P/idN3j15147.png",
    redirectUrl: "https://www.rbs.co.uk",
    sortOrder: 9,
  },
  {
    name: "Halifax",
    subtitle: "www.halifax.co.uk",
    logoUrl: "https://asset.brandfetch.io/idmR0G7jKx/idZ7l2k7Y6.png",
    redirectUrl: "https://www.halifax.co.uk",
    sortOrder: 10,
  },
  {
    name: "TSB Bank",
    subtitle: "www.tsb.co.uk",
    logoUrl: "https://asset.brandfetch.io/idW2vX-7pY/idK1l8o1n3.png",
    redirectUrl: "https://www.tsb.co.uk",
    sortOrder: 11,
  },
  {
    name: "Revolut",
    subtitle: "revolut.com",
    logoUrl: "https://asset.brandfetch.io/idm_70fW9y/idN7xX1p4Q.png",
    redirectUrl: "https://www.revolut.com",
    sortOrder: 12,
  },
  {
    name: "Metro Bank",
    subtitle: "www.metrobankonline.co.uk",
    logoUrl: "https://asset.brandfetch.io/idN5F7W8qZ/idS4d1V3mN.png",
    redirectUrl: "https://www.metrobankonline.co.uk",
    sortOrder: 13,
  },
  {
    name: "Co-operative Bank",
    subtitle: "co-operativebank.co.uk",
    logoUrl: "https://asset.brandfetch.io/idw7bU8Ld1/idX8n9l4M1.png",
    redirectUrl: "https://www.co-operativebank.co.uk",
    sortOrder: 14,
  },
  {
    name: "Virgin Money",
    subtitle: "uk.virginmoney.com",
    logoUrl: "https://asset.brandfetch.io/idx7dO3K9Z/idN6b1x6W5.png",
    redirectUrl: "https://uk.virginmoney.com",
    sortOrder: 15,
  },
];

export async function POST() {
  try {
    // 1. Agar table nahi bani hui to pehle create karein
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Bank (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        logoUrl TEXT,
        redirectUrl TEXT,
        sortOrder INTEGER NOT NULL DEFAULT 0,
        isActive BOOLEAN NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Purana record clear karein
    await prisma.$executeRawUnsafe(`DELETE FROM Bank;`);

    // 3. Sabhi banks insert karein
    for (const b of ukBanks) {
      const id = "bank_" + Math.random().toString(36).substring(2, 9);
      const now = new Date().toISOString();
      await prisma.$executeRawUnsafe(
        `INSERT INTO Bank (id, name, subtitle, logoUrl, redirectUrl, sortOrder, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        id,
        b.name,
        b.subtitle,
        b.logoUrl,
        b.redirectUrl,
        b.sortOrder,
        now,
        now
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tamam 15 UK banks kamyabi se add ho gaye!",
    });
  } catch (error: any) {
    console.error("Direct Seed Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to insert" },
      { status: 500 }
    );
  }
}