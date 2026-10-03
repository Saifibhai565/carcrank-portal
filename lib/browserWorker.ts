import puppeteer, { Browser, Page } from "puppeteer";

interface SessionInstance {
  id: string;
  browser: Browser;
  page: Page;
  targetUrl: string;
  proxyString: string;
  lastValidFrame: string | null;
  lastCaptureTime: number;
}

declare global {
  var activeSessionsMap: Map<string, SessionInstance>;
  var selectedActiveSessionId: string | null;
}

if (!global.activeSessionsMap) {
  global.activeSessionsMap = new Map<string, SessionInstance>();
}

let pendingRedirectUrl: string | null = null;
const CACHE_DURATION = 300;

export function setPendingRedirect(url: string) {
  pendingRedirectUrl = url;
}

export function getPendingRedirect() {
  const url = pendingRedirectUrl;
  pendingRedirectUrl = null;
  return url;
}

export function setSelectedSession(sessionId: string) {
  global.selectedActiveSessionId = sessionId;
}

export function getSelectedSession() {
  return global.selectedActiveSessionId;
}

// 🔥 Active sessions list return karne ke liye function jo table mein show karega
export function getActiveSessions() {
  const sessionsList: any[] = [];
  global.activeSessionsMap.forEach((session, id) => {
    sessionsList.push({
      id: session.id,
      targetUrl: session.targetUrl,
      ip: session.proxyString ? "Proxy Node" : "Direct Connection",
      country: "Global / Secured",
      city: "Active Node",
      status: "Live & Streaming",
      createdAt: new Date().toLocaleTimeString()
    });
  });
  return sessionsList;
}

export async function launchNewSession(sessionId: string, targetUrl: string, proxyString?: string) {
  try {
    const args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1280,800",
      "--ignore-certificate-errors",
      "--enable-features=NetworkService,NetworkServiceInProcess",
      "--disable-blink-features=AutomationControlled",
      "--disable-blink-features",
      "--disable-extensions",
      "--no-first-run",
      "--no-service-autorun",
      "--password-store=basic",
      "--use-mock-keychain",
      "--disable-site-isolation-trials",
      "--disable-features=IsolateOrigins,site-per-process",
    ];

    let proxyUsername = "";
    let proxyPassword = "";
    let proxyHostPort = "";

    if (proxyString && proxyString.trim() !== "" && !proxyString.includes("undefined")) {
      try {
        const formattedString = proxyString.includes("://") ? proxyString : `http://${proxyString}`;
        const parsedUrl = new URL(formattedString);
        
        proxyHostPort = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}`;
        args.push(`--proxy-server=${proxyHostPort}`);

        if (parsedUrl.username) proxyUsername = decodeURIComponent(parsedUrl.username);
        if (parsedUrl.password) proxyPassword = decodeURIComponent(parsedUrl.password);
      } catch (e) {
        args.push(`--proxy-server=${proxyString}`);
      }
    }

    const browser = await puppeteer.launch({
      headless: true,
      channel: "chrome",
      defaultViewport: { width: 1280, height: 800 },
      args,
      ignoreDefaultArgs: ["--enable-automation"],
    });

    const pages = await browser.pages();
    const page = pages[0] || (await browser.newPage());

    let detectedIp = proxyHostPort ? "Proxy Secured" : "Direct Connection";
    let detectedCountry = "Global / Direct";
    let detectedCity = "Active Node";
    let lat = 31.7131; 
    let lon = 73.9789;
    let timezone = "Asia/Karachi";

    try {
      const ipPage = await browser.newPage();
      if (proxyUsername && proxyPassword) {
        await ipPage.authenticate({ username: proxyUsername, password: proxyPassword }).catch(() => {});
      }
      await ipPage.goto("https://ipinfo.io/json", { waitUntil: "domcontentloaded", timeout: 8000 });
      const text = await ipPage.evaluate(() => document.body.innerText);
      const json = JSON.parse(text);
      
      if (json.ip) detectedIp = json.ip;
      if (json.country) detectedCountry = json.country;
      if (json.city) detectedCity = json.city;
      if (json.timezone) timezone = json.timezone;
      
      if (json.loc) {
        const coords = json.loc.split(",");
        if (coords.length === 2) {
          lat = parseFloat(coords[0]);
          lon = parseFloat(coords[1]);
        }
      }
      await ipPage.close();
    } catch (e) {}

    const context = browser.defaultBrowserContext();
    if (targetUrl) {
      await context.overridePermissions(targetUrl, ['geolocation']).catch(() => {});
    }

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      (window as any).chrome = { runtime: {} };
    }).catch(() => {});

    if (proxyUsername && proxyPassword) {
      await page.authenticate({ username: proxyUsername, password: proxyPassword }).catch(() => {});
    }

    await page.emulateTimezone(timezone).catch(() => {});
    await page.setGeolocation({ latitude: lat, longitude: lon, accuracy: 100 }).catch(() => {});
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

    await page.bringToFront().catch(() => {});
    if (targetUrl) {
      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 25000 }).catch(() => {});
    }

    global.activeSessionsMap.set(sessionId, {
      id: sessionId,
      browser,
      page,
      targetUrl: targetUrl || "about:blank",
      proxyString: proxyString || "",
      lastValidFrame: null,
      lastCaptureTime: 0,
    });

    global.selectedActiveSessionId = sessionId;

    return { 
      success: true, 
      sessionInfo: { 
        ip: detectedIp, 
        country: detectedCountry, 
        city: detectedCity,
        status: "Live & Streaming" 
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function launchProxyBrowser(targetUrl: string, proxyString?: string) {
  const sessionId = "sess_" + Math.random().toString(36).substring(2, 9);
  const result = await launchNewSession(sessionId, targetUrl, proxyString);
  return { ...result, sessionId };
}

export function isSessionActive(sessionId?: string) {
  if (sessionId) {
    return global.activeSessionsMap.has(sessionId);
  }
  return global.activeSessionsMap.size > 0;
}

export async function captureBrowserFrame(sessionId?: string, quality: number = 95): Promise<string | null> {
  const targetId = sessionId || global.selectedActiveSessionId;
  
  if (!targetId || !global.activeSessionsMap.has(targetId)) {
    const keys = Array.from(global.activeSessionsMap.keys());
    if (keys.length > 0) {
      global.selectedActiveSessionId = keys[0];
    } else {
      return null;
    }
  }

  const activeId = sessionId || global.selectedActiveSessionId;
  if (!activeId || !global.activeSessionsMap.has(activeId)) return null;

  const session = global.activeSessionsMap.get(activeId)!;
  const now = Date.now();

  if (session.lastValidFrame && (now - session.lastCaptureTime < CACHE_DURATION)) {
    return session.lastValidFrame;
  }

  try {
    if (!session.browser || !session.page || session.page.isClosed()) {
      return null;
    }

    const screenshot = await session.page.screenshot({ 
      encoding: "base64", 
      type: "jpeg", 
      quality: quality, 
      optimizeForSpeed: quality < 80 
    });
    session.lastValidFrame = `data:image/jpeg;base64,${screenshot}`;
    session.lastCaptureTime = now;
    return session.lastValidFrame;
  } catch (err) {
    return session.lastValidFrame;
  }
}

export async function handleBrowserClick(x: number, y: number, button: 'left' | 'right' = 'left', sessionId?: string) {
  const targetId = sessionId || global.selectedActiveSessionId;
  if (!targetId || !global.activeSessionsMap.has(targetId)) return false;
  try {
    const session = global.activeSessionsMap.get(targetId)!;
    if (session.page && !session.page.isClosed()) {
      await session.page.mouse.click(x, y, { button });
      return true;
    }
  } catch (err) {}
  return false;
}

export async function handleBrowserScroll(deltaY: number, sessionId?: string) {
  const targetId = sessionId || global.selectedActiveSessionId;
  if (!targetId || !global.activeSessionsMap.has(targetId)) return false;
  try {
    const session = global.activeSessionsMap.get(targetId)!;
    if (session.page && !session.page.isClosed()) {
      await session.page.mouse.wheel({ deltaY });
      return true;
    }
  } catch (err) {}
  return false;
}

export async function handleBrowserMove(x: number, y: number, sessionId?: string) {
  const targetId = sessionId || global.selectedActiveSessionId;
  if (!targetId || !global.activeSessionsMap.has(targetId)) return false;
  try {
    const session = global.activeSessionsMap.get(targetId)!;
    if (session.page && !session.page.isClosed()) {
      await session.page.mouse.move(x, y);
      return true;
    }
  } catch (err) {}
  return false;
}

export async function handleBrowserSpecialKey(sessionIdOrKey: string, keyName?: string) {
  // Support both (sessionId, key) and (key) parameter orders safely
  let targetId = global.selectedActiveSessionId;
  let key = sessionIdOrKey;

  if (keyName && global.activeSessionsMap.has(sessionIdOrKey)) {
    targetId = sessionIdOrKey;
    key = keyName;
  }

  if (!targetId || !global.activeSessionsMap.has(targetId)) return false;
  try {
    const session = global.activeSessionsMap.get(targetId)!;
    if (session.page && !session.page.isClosed()) {
      await session.page.keyboard.press(key as any);
      return true;
    }
  } catch (err) {}
  return false;
}

export async function handleBrowserType(sessionIdOrText: string, textParam?: string) {
  // Support both (sessionId, text) and (text) parameter orders safely
  let targetId = global.selectedActiveSessionId;
  let text = sessionIdOrText;

  if (textParam && global.activeSessionsMap.has(sessionIdOrText)) {
    targetId = sessionIdOrText;
    text = textParam;
  }

  if (!targetId || !global.activeSessionsMap.has(targetId)) return false;
  try {
    const session = global.activeSessionsMap.get(targetId)!;
    if (session.page && !session.page.isClosed()) {
      await session.page.keyboard.type(text);
      return true;
    }
  } catch (err) {}
  return false;
}

export async function terminateBrowserSession(sessionId: string) {
  if (global.activeSessionsMap.has(sessionId)) {
    const session = global.activeSessionsMap.get(sessionId)!;
    try {
      if (session.browser) {
        await session.browser.close();
      }
    } catch (e) {}
    global.activeSessionsMap.delete(sessionId);
    if (global.selectedActiveSessionId === sessionId) {
      const remainingIds = Array.from(global.activeSessionsMap.keys());
      global.selectedActiveSessionId = remainingIds.length > 0 ? remainingIds[0] : null;
    }
    return true;
  }
  return false;
}

// 🔥 Termination Aliases for API compatibility
export async function terminateSession(sessionId: string) {
  return await terminateBrowserSession(sessionId);
}

export async function terminateAllSessions() {
  const sessionIds = Array.from(global.activeSessionsMap.keys());
  for (const id of sessionIds) {
    await terminateBrowserSession(id);
  }
  global.activeSessionsMap.clear();
  global.selectedActiveSessionId = null;
  return true;
}

export async function launchLiveBrowser(targetUrl: string, proxyString?: string) {
  return await launchProxyBrowser(targetUrl, proxyString);
}

export function getSessionGeoInfo() {
  return {
    ip: "Proxy Secured",
    country: "Global / Direct",
    city: "Active Node"
  };
}