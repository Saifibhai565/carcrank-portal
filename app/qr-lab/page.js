"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrLabPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrStatus, setQrStatus] = useState("Waiting");
  const [browserStatus, setBrowserStatus] = useState("Waiting");

  const generateNewSession = async () => {
    setLoading(true);
    setQrStatus("Waiting");
    setBrowserStatus("Waiting");
    try {
      const res = await fetch("/api/qr-session", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSession(data);
      }
    } catch (err) {
      console.error("Session load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNewSession();
  }, []);

  const scanUrl = session
    ? `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/scan/${session.temporaryToken}`
    : "";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-6 sm:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-blue-600">CarCrank QR Login Lab</h1>
            <p className="text-xs text-slate-500">Localhost Authentication & Browser Automation Flow</p>
          </div>
          <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-mono">
            Demo Mode
          </span>
        </div>

        {/* Status Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block mb-1">WebSocket</span>
            <span className="font-bold text-blue-600">Port 8080 Ready</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block mb-1">QR Status</span>
            <span className="font-bold text-emerald-600">{qrStatus}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block mb-1">Playwright</span>
            <span className="font-bold text-amber-600">{browserStatus}</span>
          </div>
        </div>

        {/* QR Section */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-xl border border-slate-200 mb-6">
          {loading ? (
            <div className="h-44 flex items-center justify-center text-sm text-slate-500">
              Generating secure temporary transaction...
            </div>
          ) : session ? (
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <QRCodeSVG value={scanUrl} size={180} level="H" />
              </div>
              <p className="mt-3 text-xs text-slate-500 font-mono text-center">
                Open Scanner Page:<br />
                <a href={scanUrl} target="_blank" className="text-blue-600 underline font-semibold">
                  {scanUrl}
                </a>
              </p>
            </div>
          ) : (
            <p className="text-xs text-red-500">Failed to initialize session.</p>
          )}

          <button
            onClick={generateNewSession}
            className="mt-4 text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded transition cursor-pointer"
          >
            ↻ Generate Fresh QR
          </button>
        </div>

        {/* Educational Info */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-slate-600 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-800">Local Authentication Flow:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
            <li>Neeche diye gaye link par click karein ya mobile se scan karein.</li>
            <li>Approval milte hi local single-use authorization code create hoga.</li>
            <li>Step 3 mein local Playwright process naya browser open karega.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}