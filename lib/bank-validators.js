// Formatting helpers
export function formatSortCode(value) {
  // Sirf numbers allow karein aur max 6 digits
  const cleaned = value.replace(/\D/g, "").slice(0, 6);
  // Auto-hyphenate: 12-34-56
  const parts = cleaned.match(/.{1,2}/g);
  return parts ? parts.join("-") : cleaned;
}

export function formatAccountNumber(value) {
  // Sirf numbers allow karein, max 8 digits
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatCardNumber(value) {
  // 16 digits card formatting: 1234 5678 1234 5678
  const cleaned = value.replace(/\D/g, "").slice(0, 16);
  const parts = cleaned.match(/.{1,4}/g);
  return parts ? parts.join(" ") : cleaned;
}

// Validation rules
export function validateUkSortCode(sortCode) {
  const digits = sortCode.replace(/\D/g, "");
  if (digits.length !== 6) {
    return "Sort code must be exactly 6 digits (e.g. 12-34-56)";
  }
  return null;
}

export function validateUkAccountNumber(accountNumber) {
  const digits = accountNumber.replace(/\D/g, "");
  if (digits.length !== 8) {
    return "Account number must be exactly 8 digits";
  }
  return null;
}

export function validatePasscode(passcode, requiredLength = 6) {
  const cleaned = passcode.trim();
  if (cleaned.length < requiredLength) {
    return `Security code must be at least ${requiredLength} characters`;
  }
  return null;
}