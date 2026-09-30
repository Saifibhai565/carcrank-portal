"use client";

export default function ProxyManagerTab() {
  return (
    <div className="space-y-6 text-zinc-100">
      <div className="bg-[#141418] border border-zinc-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-2">
          🛡️ GenLogin Residential Proxy Manager Pro
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Configure clean UK residential proxies to bypass Akamai and Cloudflare anti-bot WAF checks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            <p className="text-[11px] text-zinc-400">Active Proxy Node</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">UK London (Residential)</p>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            <p className="text-[11px] text-zinc-400">Rotation Interval</p>
            <p className="text-sm font-bold text-indigo-400 mt-1">Every 10 Minutes</p>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            <p className="text-[11px] text-zinc-400">Connection Status</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">🟢 Connected & Secure</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Proxy Host & Port</label>
            <input
              type="text"
              readOnly
              value="uk.residential.genlogin.proxy:9050"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-300 font-mono"
            />
          </div>
          <button
            onClick={() => alert("Proxy settings saved successfully!")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Save Proxy Configuration
          </button>
        </div>
      </div>
    </div>
  );
}