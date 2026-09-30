export const ADMIN_COOKIE = "carcrank_admin";

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return bytesToHex(sig);
}

export async function createSessionValue() {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me";
  return sign("admin-session", secret);
}

export async function isValidSession(value: string | undefined | null) {
  if (!value) return false;
  const expected = await createSessionValue();
  return value === expected;
}
