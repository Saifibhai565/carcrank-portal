import puppeteer from 'puppeteer';

if (!global.chromeProSessions) {
  global.chromeProSessions = new Map<string, {
    browser: any;
    page: any;
    lastValidFrame: string | null;
    lastCaptureTime: number;
    targetUrl: string;
  }>();
}

export async function launchChromeProSession(sessionId: string, targetUrl: string) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1280,800',
        '--disable-blink-features=AutomationControlled', // 🔥 Hide automation flag
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    global.chromeProSessions.set(sessionId, {
      browser,
      page,
      lastValidFrame: null,
      lastCaptureTime: Date.now(),
      targetUrl
    });

    return { success: true, sessionId };
  } catch (err: any) {
    // Fallback if Chrome is in Program Files (x86)
    try {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1280,800']
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      global.chromeProSessions.set(sessionId, {
        browser,
        page,
        lastValidFrame: null,
        lastCaptureTime: Date.now(),
        targetUrl
      });
      return { success: true, sessionId };
    } catch (innerErr: any) {
      return { success: false, error: innerErr.message || err.message };
    }
  }
}

export async function captureChromeProFrame(sessionId: string): Promise<string | null> {
  const session = global.chromeProSessions.get(sessionId);
  if (!session || !session.page || session.page.isClosed()) return null;

  try {
    const pages = await session.browser.pages();
    if (pages.length > 0) {
      session.page = pages[pages.length - 1];
    }

    const screenshot = await session.page.screenshot({
      encoding: "base64",
      type: "jpeg",
      quality: 85
    });

    session.lastValidFrame = `data:image/jpeg;base64,${screenshot}`;
    return session.lastValidFrame;
  } catch (err) {
    return session.lastValidFrame;
  }
}

export async function handleChromeProClick(sessionId: string, x: number, y: number) {
  const session = global.chromeProSessions.get(sessionId);
  if (!session || !session.page) return;
  try {
    await session.page.mouse.click(x, y);
  } catch (err) {}
}

export async function handleChromeProType(sessionId: string, text?: string, key?: string) {
  const session = global.chromeProSessions.get(sessionId);
  if (!session || !session.page) return;
  try {
    if (key) {
      if (key === "ControlLeft" || key === "ControlRight") {
        await session.page.keyboard.down("Control");
      } else {
        await session.page.keyboard.press(key);
      }
    } else if (text) {
      await session.page.keyboard.type(text);
    }
  } catch (err) {}
}