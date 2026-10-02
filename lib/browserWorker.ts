import puppeteer, { Browser, Page } from "puppeteer";

declare global {
  var cachedBrowser: Browser | null;
  var cachedPage: Page | null;
}

if (!global.cachedBrowser) {
  global.cachedBrowser = null;
  global.cachedPage = null;
}

let isSessionLive = true;
let lastValidFrame: string | null = null;
let lastTargetUrl = "https://zentralmall.com/login";
let lastCaptureTime = 0;
const CACHE_DURATION = 400;

export async function launchProxyBrowser(targetUrl: string, proxyString?: string) {
  try {
    isSessionLive = true;
    if (targetUrl && targetUrl.trim() !== "") {
      lastTargetUrl = targetUrl;
    }

    if (global.cachedBrowser && global.cachedPage && !global.cachedPage.isClosed()) {
      try {
        await global.cachedPage.goto(lastTargetUrl, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
        return { success: true, sessionInfo: { ip: "Direct Connection", status: "Live & Streaming" } };
      } catch (e) {}
    }

    const args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1280,800",
      "--ignore-certificate-errors",
    ];

    if (proxyString && proxyString.trim() !== "" && !proxyString.includes("undefined")) {
      try {
        const parsed = new URL(proxyString);
        args.push(`--proxy-server=${parsed.protocol}//${parsed.hostname}:${parsed.port}`);
      } catch (e) {
        args.push(`--proxy-server=${proxyString}`);
      }
    }

    global.cachedBrowser = await puppeteer.launch({
      headless: true,
      channel: "chrome",
      defaultViewport: { width: 1280, height: 800 },
      args,
    });

    const pages = await global.cachedBrowser.pages();
    global.cachedPage = pages[0] || (await global.cachedBrowser.newPage());

    if (global.cachedPage) {
      await global.cachedPage.goto(lastTargetUrl, { waitUntil: "domcontentloaded", timeout: 25000 }).catch(() => {});
    }

    return { success: true, sessionInfo: { ip: "Direct Connection", status: "Live & Streaming" } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function isSessionActive() {
  return isSessionLive;
}

export async function captureBrowserFrame(): Promise<string | null> {
  const now = Date.now();

  if (lastValidFrame && (now - lastCaptureTime < CACHE_DURATION)) {
    return lastValidFrame;
  }

  try {
    if (!global.cachedBrowser || !global.cachedPage || global.cachedPage.isClosed()) {
      await launchProxyBrowser(lastTargetUrl);
    }

    if (global.cachedPage) {
      const screenshot = await global.cachedPage.screenshot({ 
        encoding: "base64", 
        type: "jpeg", 
        quality: 75,
        optimizeForSpeed: true 
      });
      lastValidFrame = `data:image/jpeg;base64,${screenshot}`;
      lastCaptureTime = now;
      return lastValidFrame;
    }
  } catch (err) {
    if (lastValidFrame) return lastValidFrame;
  }

  return lastValidFrame;
}

export async function handleBrowserClick(x: number, y: number, button: 'left' | 'right' = 'left') {
  try {
    if (global.cachedPage && !global.cachedPage.isClosed()) {
      await global.cachedPage.mouse.click(x, y, { button });
      return true;
    }
  } catch (err) {}
  return false;
}


export async function handleBrowserType(text: string) {
  try {
    if (global.cachedPage && !global.cachedPage.isClosed()) {
      await global.cachedPage.keyboard.type(text);
      return true;
    }
  } catch (err) {}
  return false;
}

// Scroll handler add karein
export async function handleBrowserScroll(deltaY: number) {
  try {
    if (global.cachedPage && !global.cachedPage.isClosed()) {
      await global.cachedPage.mouse.wheel({ deltaY });
      return true;
    }
  } catch (err) {}
  return false;
}

// Special keys mein "Delete" bhi shamil kar dein
export async function handleBrowserSpecialKey(keyName: "Backspace" | "Enter" | "Delete") {
  try {
    if (global.cachedPage && !global.cachedPage.isClosed()) {
      await global.cachedPage.keyboard.press(keyName);
      return true;
    }
  } catch (err) {}
  return false;
}


export async function terminateBrowserSession() {
  isSessionLive = false;
  lastValidFrame = null;
  if (global.cachedBrowser) {
    try {
      await global.cachedBrowser.close();
    } catch (e) {}
    global.cachedBrowser = null;
    global.cachedPage = null;
  }
  return true;
}

export async function handleBrowserMove(x: number, y: number) {
  try {
    if (global.cachedPage && !global.cachedPage.isClosed()) {
      await global.cachedPage.mouse.move(x, y);
      return true;
    }
  } catch (err) {}
  return false;
}