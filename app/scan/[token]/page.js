"use client";

import { use, useState } from "react";

export default function MobileScanPage({ params }) {
  const unwrappedParams = use(params);
  const token = unwrappedParams.token;

  const [status, setStatus] = useState("pending"); // pending | approved | rejected | error
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/qr-session/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Action failed");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Could not reach CarCrank local server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl text-center">
        
        {/* Header Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z" />
          </svg>
        </div>

        <h1 className="text-lg font-bold text-slate-100 mb-1">CarCrank QR Login</h1>
        <p className="text-xs text-slate-400 mb-6">Local Authentication Request</p>

        {status === "pending" && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Account:</span>
                <span className="text-slate-200 font-semibold">Demo User</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Environment:</span>
                <span className="text-slate-200 font-mono">localhost:3000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Token Ref:</span>
                <span className="text-slate-300 font-mono">{token.slice(0, 8)}...</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Approve this login to launch an authenticated browser session on your PC.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleAction("reject")}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleAction("approve")}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                {loading ? "Processing..." : "Approve Login"}
              </button>
            </div>
          </div>
        )}

        {status === "approved" && (
          <div className="py-4 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <h2 className="text-sm font-bold text-emerald-400">Login Approved</h2>
            <p className="text-xs text-slate-400">
              Authorization code issued. Playwright browser will now launch on your PC.
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="py-4 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">
              ✕
            </div>
            <h2 className="text-sm font-bold text-red-400">Login Rejected</h2>
            <p className="text-xs text-slate-400">This login request has been cancelled.</p>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 space-y-2">
            <h2 className="text-sm font-bold text-amber-400">Request Error</h2>
            <p className="text-xs text-slate-400">{errorMessage}</p>
          </div>
        )}

      </div>
    </div>
  );
}