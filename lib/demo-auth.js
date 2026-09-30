import crypto from "crypto";

// Server reload/requests ke darmiyan memory bachi rahe iske liye globalThis use kiya hai
const globalForSessions = globalThis;
if (!globalForSessions.activeSessions) {
  globalForSessions.activeSessions = new Map();
}
const activeSessions = globalForSessions.activeSessions;

export function createDemoSession(transactionId) {
  const sessionId = crypto.randomUUID();
  const sessionData = {
    sessionId,
    transactionId,
    user: "Demo User",
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour validity
  };

  activeSessions.set(sessionId, sessionData);
  console.log(`[AUTH] Local demo session created: ${sessionId}`);
  return sessionId;
}

export function getDemoSession(sessionId) {
  if (!sessionId) return null;
  const session = activeSessions.get(sessionId);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return null;
  }
  return session;
}

export function destroyDemoSession(sessionId) {
  if (activeSessions.has(sessionId)) {
    activeSessions.delete(sessionId);
    console.log(`[AUTH] Local demo session destroyed: ${sessionId}`);
    return true;
  }
  return false;
}