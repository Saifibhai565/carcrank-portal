"use client";

import { useState, useEffect } from "react";

export default function BankSelectorModal({ isOpen, onClose, onSelectBank }: any) {
  const [banks, setBanks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/banks")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setBanks(data.data);
        })
        .catch((err) => console.error("Error fetching banks:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 relative overflow-hidden text-slate-900">
        
        {/* Header with Plaid Logo & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 text-lg font-bold cursor-pointer">
            ←
          </button>
          <div className="flex items-center gap-1.5 font-black text-sm tracking-widest text-slate-900">
            <span className="w-3 h-3 bg-black rounded-xs inline-block"></span> PLAID
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Select your business bank
          </h2>

          {/* Search Input Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-4 text-xs outline-none focus:border-blue-600 bg-white font-medium shadow-2xs text-slate-900"
            />
          </div>

          {/* Bank List from Database */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 space-y-1">
            {filteredBanks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => onSelectBank(bank)}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-xs overflow-hidden">
                    {bank.logoUrl ? (
                      <img src={bank.logoUrl} alt={bank.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="font-bold text-xs text-slate-700">{bank.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{bank.name}</p>
                    <p className="text-[11px] text-slate-400">{bank.subtitle}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">›</span>
              </div>
            ))}

            {filteredBanks.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No institutions found. Add them from Admin Panel.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}