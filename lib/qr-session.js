import crypto from "crypto";

// Local in-memory session store (Development demo lab)
const qrTransactions = new Map();

export function createQrTransaction() {
  const transactionId = crypto.randomUUID();
  const temporaryToken = crypto.randomBytes(16).toString("hex");
  const authorizationCode = crypto.randomBytes(24).toString("hex");

  const data = {
    transactionId,
    temporaryToken,
    authorizationCode,
    status: "pending", // pending | approved | consumed | expired
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minute validity
  };

  qrTransactions.set(temporaryToken, data);
  console.log(`[QR] Created transaction: ${transactionId}`);

  return { transactionId, temporaryToken, expiresAt: data.expiresAt };
}

export function getQrTransaction(temporaryToken) {
  const tx = qrTransactions.get(temporaryToken);
  if (!tx) return null;

  if (Date.now() > tx.expiresAt) {
    tx.status = "expired";
    return { error: "expired" };
  }

  return tx;
}

export function approveQrTransaction(temporaryToken) {
  const tx = qrTransactions.get(temporaryToken);
  if (!tx) return { error: "not_found" };
  if (Date.now() > tx.expiresAt) {
    tx.status = "expired";
    return { error: "expired" };
  }
  if (tx.status !== "pending") {
    return { error: `already_${tx.status}` };
  }

  tx.status = "approved";
  console.log(`[QR] Mobile approval received for: ${tx.transactionId}`);
  return { success: true, transactionId: tx.transactionId, authorizationCode: tx.authorizationCode };
}

export function consumeAuthorizationCode(code) {
  for (const [token, tx] of qrTransactions.entries()) {
    if (tx.authorizationCode === code) {
      if (tx.status !== "approved") {
        return { error: "invalid_state" };
      }
      if (Date.now() > tx.expiresAt) {
        tx.status = "expired";
        return { error: "expired" };
      }

      tx.status = "consumed";
      console.log(`[AUTH] One-time authorization code consumed: ${tx.transactionId}`);
      return { success: true, transactionId: tx.transactionId };
    }
  }
  return { error: "invalid_code" };
}