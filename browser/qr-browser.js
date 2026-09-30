const { WebSocketServer } = require("ws");
const { chromium } = require("playwright");

const wss = new WebSocketServer({ port: 8080 });
console.log("[WS] WebSocket Server listening on ws://localhost:8080");

let activeBrowser = null;

async function launchAuthBrowser(authorizationCode) {
  console.log("[BROWSER] Launching Chromium...");

  if (!activeBrowser) {
    activeBrowser = await chromium.launch({
      headless: false,
    });
  }

  // Ensure isolated context (no shared cookies)
  console.log("[BROWSER] New isolated context created");
  const context = await activeBrowser.newContext();
  const page = await context.newPage();

  const authUrl = `http://localhost:3000/auth/complete?code=${authorizationCode}`;
  console.log("[BROWSER] Opening local CarCrank authentication");

  try {
    await page.goto(authUrl, { waitUntil: "load" });
    console.log("[BROWSER] Dashboard opened successfully ✓");
  } catch (err) {
    console.error("[BROWSER] Navigation failed:", err.message);
  }
}

wss.on("connection", (ws) => {
  console.log("[WS] Client connected");

  ws.on("message", async (data) => {
    try {
      const payload = JSON.parse(data.toString());
      if (payload.type === "qr_login_approved") {
        console.log(`[QR] Mobile approval received for: ${payload.transactionId}`);
        await launchAuthBrowser(payload.authorizationCode);
      }
    } catch (err) {
      console.error("[WS] Message parsing error:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("[WS] Client disconnected");
  });
});