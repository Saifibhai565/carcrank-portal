"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ConsentContent() {
  const searchParams = useSearchParams();
  const bank = searchParams.get("bank") || "Barclays";
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  const [loading, setLoading] = useState(false);

  const handleApprove = () => {
    setLoading(true);
    if (!redirectUri) return;
    try {
      const target = new URL(redirectUri);
      if (code) target.searchParams.set("code", code);
      if (state) target.searchParams.set("state", state);
      window.location.href = target.toString();
    } catch {
      window.location.href = `/oauth/callback?code=${code}&state=${state}`;
    }
  };

  const handleDeny = () => {
    if (!redirectUri) return;
    try {
      const target = new URL(redirectUri);
      target.searchParams.set("error", "access_denied");
      if (state) target.searchParams.set("state", state);
      window.location.href = target.toString();
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-700 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
            🔒
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{bank} Open Banking</h2>
            <p className="text-[11px] text-slate-400">Secure Consent Authorization</p>
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          <strong className="text-blue-400">CarCrank Portal</strong> is requesting read-only access to verify your business credentials:
        </p>

        {/* Scope list */}
        <div className="space-y-2 mb-6">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <span className="text-emerald-400 text-xs mt-0.5">✓</span>
            <div>
              <p className="text-xs font-semibold text-slate-200">Account Details</p>
              <p className="text-[11px] text-slate-400">Account holder name, sort code, and balance confirmation</p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <span className="text-emerald-400 text-xs mt-0.5">✓</span>
            <div>
              <p className="text-xs font-semibold text-slate-200">Verification Ledger</p>
              <p className="text-[11px] text-slate-400">Past 90-day transaction summary for loan processing</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDeny}
            className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleApprove}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition cursor-pointer"
          >
            {loading ? "Redirecting..." : "Authorize Access"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading consent gateway...</div>}>
      <ConsentContent />
    </Suspense>
  );
}