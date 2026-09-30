"use client";

import React, { useState, useEffect } from "react";

export type ModalStatusType = "success" | "pending" | "action_required" | "failed";

export interface VerificationStatusModalProps {
  isOpen: boolean;
  bankName: string;
  statusType?: ModalStatusType;
  referenceId?: string;
  customTitle?: string;
  customMessage?: string;
  supportPhone?: string;
  onClose: () => void;
  onProceed?: () => void;
}

export default function VerificationStatusModal({
  isOpen,
  bankName,
  statusType = "pending",
  referenceId = "REF-100234",
  customTitle,
  customMessage,
  supportPhone = "0800 000 1234",
  onClose,
  onProceed,
}: VerificationStatusModalProps) {
  const [otpCode, setOtpCode] = useState("");
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    setOtpCode("");
    setOtpError("");
  }, [isOpen, statusType]);

  if (!isOpen) {
    return null;
  }

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) {
      setOtpError("Enter the full 6-digit one-time passcode.");
      return;
    }
    setSubmittingOtp(true);
    setTimeout(() => {
      setSubmittingOtp(false);
      if (onProceed) {
        onProceed();
      }
    }, 1000);
  };

  const getHeading = () => {
    if (customTitle) return customTitle;
    if (statusType === "success") return "Verification Complete";
    if (statusType === "pending") return "Verification In Progress";
    if (statusType === "action_required") return "Security Verification Required";
    return "Verification Unsuccessful";
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    if (statusType === "success") return "Your bank profile has been confirmed.";
    if (statusType === "pending") return "Your institution is processing the authorization request.";
    if (statusType === "action_required") return "Please enter the one-time verification passcode sent to your device.";
    return "We were unable to confirm the details provided.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-sky-400">CarCrank Verification</span>
            <span className="text-slate-400 text-xs">| {bankName}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-2xl font-bold">
            {statusType === "success" && <span className="text-emerald-600">&#10003;</span>}
            {statusType === "pending" && <span className="text-amber-600 animate-pulse">&#9203;</span>}
            {statusType === "action_required" && <span className="text-blue-600">&#128274;</span>}
            {statusType === "failed" && <span className="text-red-600">&times;</span>}
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">{getHeading()}</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-5">{getMessage()}</p>

          {statusType === "action_required" && (
            <form onSubmit={handleOtpSubmit} className="space-y-3 mb-5 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  One-Time Passcode (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    if (otpError) setOtpError("");
                  }}
                  className="w-full text-center tracking-widest font-mono text-base py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
                {otpError ? <p className="text-[11px] text-red-500 mt-1">{otpError}</p> : null}
              </div>

              <button
                type="submit"
                disabled={submittingOtp}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
              >
                {submittingOtp ? "Validating Passcode..." : "Confirm Security Passcode"}
              </button>
            </form>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left space-y-1.5 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Reference:</span>
              <span className="font-mono text-slate-700 font-medium">{referenceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bank Portal:</span>
              <span className="text-slate-700 font-semibold">{bankName}</span>
            </div>
            {supportPhone ? (
              <div className="flex justify-between">
                <span className="text-slate-400">Helpline:</span>
                <span className="text-blue-600 font-mono">{supportPhone}</span>
              </div>
            ) : null}
          </div>

          {statusType !== "action_required" && (
            <button
              type="button"
              onClick={onProceed || onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {statusType === "success" ? "Go to Dashboard" : "Close Window"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}