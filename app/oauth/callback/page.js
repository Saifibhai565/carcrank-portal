"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error) {
      setErrorMessage("Consent was rejected or cancelled.");
      setLoading(false);
      return;
    }

    if (!code) {
      setErrorMessage("Missing authorization code.");
      setLoading(false);
      return;
    }

    fetch("/api/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.message || "Failed to exchange token");
        } else {
          setAccountData(data.account_data);
        }
      })
      .catch(() => setErrorMessage("Network error during token exchange"))
      .finally(() => setLoading(false));
  }, [code, error]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-center">
        {loading && (
          <div className="py-8">
            <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-500 font-semibold">Exchanging secure Open Banking token...</p>
          </div>
        )}

        {errorMessage && (
          <div className="py-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mb-3">
              ✕
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Authorization Incomplete</h3>
            <p className="text-xs text-slate-500 mb-4">{errorMessage}</p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Back to Home
            </a>
          </div>
        )}

        {accountData && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Account Linked Successfully</h2>
              <p className="text-xs text-slate-400">Open Banking Sandbox Verification Complete</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Holder:</span>
                <span className="font-semibold text-slate-700">{accountData.account_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sort Code:</span>
                <span className="font-mono text-slate-700">{accountData.sort_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account No:</span>
                <span className="font-mono text-slate-700">{accountData.account_number}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-bold">Verified Balance:</span>
                <span className="font-bold text-emerald-600 font-mono">
                  £{accountData.balance.toLocaleString()} {accountData.currency}
                </span>
              </div>
            </div>

            <a
              href="/"
              className="block w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow"
            >
              Proceed to Vehicle Proposal
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Completing authentication...</div>}>
      <CallbackContent />
    </Suspense>
  );
}