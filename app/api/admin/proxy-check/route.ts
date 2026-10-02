
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { proxyString } = await req.json();
    if (!proxyString) {
      return NextResponse.json({ success: false, error: "Proxy string is required" }, { status: 400 });
    }

    const args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--ignore-certificate-errors",
    ];

    let proxyUsername = "";
    let proxyPassword = "";

    try {
      const formatted = proxyString.includes("://") ? proxyString : `http://${proxyString}`;
      const parsedUrl = new URL(formatted);
      args.push(`--proxy-server=${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}`);
      if (parsedUrl.username) proxyUsername = decodeURIComponent(parsedUrl.username);
      if (parsedUrl.password) proxyPassword = decodeURIComponent(parsedUrl.password);
    } catch (e) {
      args.push(`--proxy-server=${proxyString}`);
    }

    const browser = await puppeteer.launch({
      headless: true,
      channel: "chrome",
      args,
    });

    const page = await browser.newPage();
    if (proxyUsername && proxyPassword) {
      await page.authenticate({ username: proxyUsername, password: proxyPassword }).catch(() => {});
    }

    // Fetching detailed location stats from ipinfo.io
    await page.goto("https://ipinfo.io/json", { waitUntil: "domcontentloaded", timeout: 15000 });
    const text = await page.evaluate(() => document.body.innerText);
    await browser.close();

    const data = JSON.parse(text);
    
    // Get live timezone time
    let currentTime = "N/A";
    try {
      currentTime = new Date().toLocaleTimeString("en-US", { timeZone: data.timezone || "UTC" });
    } catch (e) {
      currentTime = new Date().toLocaleTimeString();
    }

    return NextResponse.json({
      success: true,
      details: {
        ip: data.ip || "Unknown",
        country: data.country || "Unknown",
        state: data.region || "Unknown",
        city: data.city || "Unknown",
        timezone: data.timezone || "UTC",
        time: currentTime,
        org: data.org || "Encrypted ISP",
        status: "Tunnel Secured & Active"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Proxy connection failed: " + error.message });
  }
}