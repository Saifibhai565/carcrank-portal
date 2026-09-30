const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const banks = [
  {
    name: "Barclays (UK)",
    subtitle: "Multiple available",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.barclays.co.uk",
    order: 1,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Tide",
    subtitle: "Business Account",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.tide.co",
    order: 2,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "NatWest",
    subtitle: "Multiple available",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.natwest.com",
    order: 3,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Lloyds Bank",
    subtitle: "Multiple available",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/lloyds-logo.png",
    redirectUrl: "https://www.lloydsbank.com",
    order: 4,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Starling Bank",
    subtitle: "starlingbank.com",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.starlingbank.com",
    order: 5,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "HSBC UK",
    subtitle: "Multiple available",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.hsbc.co.uk",
    order: 6,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Santander",
    subtitle: "www.santander.co.uk",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.santander.co.uk",
    order: 7,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Monzo",
    subtitle: "monzo.com",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://monzo.com",
    order: 8,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Royal Bank of Scotland",
    subtitle: "Multiple available",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.rbs.co.uk",
    order: 9,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Halifax",
    subtitle: "www.halifax.co.uk",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.halifax.co.uk",
    order: 10,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "TSB Bank",
    subtitle: "www.tsb.co.uk",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.tsb.co.uk",
    order: 11,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Revolut",
    subtitle: "revolut.com",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.revolut.com",
    order: 12,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Metro Bank",
    subtitle: "www.metrobankonline.co.uk",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://www.metrobankonline.co.uk",
    order: 13,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
  {
    name: "Virgin Money",
    subtitle: "uk.virginmoney.com",
    subOptions: "Business, Personal, Corporate",
    logoUrl: "/plaid-logo.png",
    redirectUrl: "https://uk.virginmoney.com",
    order: 14,
    popupStatus: "success",
    popupTitle: "Account Verification in Progress",
    popupButtonText: "Complete Verification",
    popupRedirectUrl: "https://google.com",
    isActive: true,
  },
];

async function main() {
  console.log("Syncing banks to local database...");
  for (const b of banks) {
    const existing = await prisma.bank.findFirst({ where: { name: b.name } });
    if (!existing) {
      await prisma.bank.create({ data: b });
      console.log(`Added: ${b.name}`);
    } else {
      console.log(`Already exists: ${b.name}`);
    }
  }
  console.log("All 14 banks synced successfully!");
}

main()
  .catch((e) => {
    console.error("Error syncing banks:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });