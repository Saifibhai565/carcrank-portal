"use client";

export default function InstitutionsTab({
  banks,
  editingBankId,
  bankName,
  setBankName,
  subtitle,
  setSubtitle,
  subOptions,
  setSubOptions,
  logoBase64,
  setLogoBase64,
  order,
  setOrder,
  personalUrl,
  setPersonalUrl,
  businessUrl,
  setBusinessUrl,
  commercialUrl,
  setCommercialUrl,
  enablePersonal,
  setEnablePersonal,
  enableBusiness,
  setEnableBusiness,
  enableCommercial,
  setEnableCommercial,
  isSubmitting,
  handleSubmitBank,
  handleCancelEdit,
  handleStartEdit,
  handleOpenConfig,
  handleDeleteBank,
  handleLogoUpload,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-zinc-100">
      {/* Add / Edit Institution Form Card */}
      <div className={`lg:col-span-4 bg-zinc-900 rounded-2xl p-6 border shadow-2xl h-fit transition ${
        editingBankId ? "border-amber-500/60 ring-2 ring-amber-500/20" : "border-zinc-800"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-zinc-100 tracking-tight">
            {editingBankId ? "Edit Institution Details" : "Add New Institution"}
          </h2>
          {editingBankId && (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Editing
            </span>
          )}
        </div>
        <form onSubmit={handleSubmitBank} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Bank Name *</label>
            <input
              type="text"
              placeholder="e.g. Lloyds Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 p-2.5 text-xs outline-none focus:border-blue-500 bg-zinc-950 text-zinc-100 font-medium shadow-inner placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Subtitle *</label>
            <input
              type="text"
              placeholder="e.g. Multiple available"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 p-2.5 text-xs outline-none focus:border-blue-500 bg-zinc-950 text-zinc-100 font-medium shadow-inner placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Sub-Options</label>
            <input
              type="text"
              value={subOptions}
              onChange={(e) => setSubOptions(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 p-2.5 text-xs outline-none focus:border-blue-500 bg-zinc-950 text-zinc-100 font-medium shadow-inner placeholder:text-zinc-600"
            />
          </div>

          {/* 🌍 Category-wise Dedicated Bank URLs & Checkboxes */}
          <div className="space-y-3.5 pt-3 border-t border-zinc-800">
            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Category-Wise Portal URLs & Checkboxes</p>
            
            {/* Personal Category */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200">Personal Account</label>
                <input
                  type="checkbox"
                  checked={enablePersonal}
                  onChange={(e) => setEnablePersonal(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
              <input
                type="text"
                placeholder="Personal Portal URL"
                value={personalUrl}
                onChange={(e) => setPersonalUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 p-2 text-xs outline-none focus:border-blue-500 bg-zinc-900 text-zinc-100 font-mono"
              />
            </div>

            {/* Business Category */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200">Business Account</label>
                <input
                  type="checkbox"
                  checked={enableBusiness}
                  onChange={(e) => setEnableBusiness(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
              <input
                type="text"
                placeholder="Business Portal URL"
                value={businessUrl}
                onChange={(e) => setBusinessUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 p-2 text-xs outline-none focus:border-blue-500 bg-zinc-900 text-zinc-100 font-mono"
              />
            </div>

            {/* Commercial Category */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200">Commercial / Corporate</label>
                <input
                  type="checkbox"
                  checked={enableCommercial}
                  onChange={(e) => setEnableCommercial(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
              <input
                type="text"
                placeholder="Commercial Portal URL"
                value={commercialUrl}
                onChange={(e) => setCommercialUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 p-2 text-xs outline-none focus:border-blue-500 bg-zinc-900 text-zinc-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Logo</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
              />
              {logoBase64 && (
                <div className="relative">
                  <img src={logoBase64} alt="Preview" className="w-8 h-8 rounded-full object-contain border border-zinc-700 bg-white" />
                  <button
                    type="button"
                    onClick={() => setLogoBase64(null)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold shadow"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Order / Sort Number</label>
            <input
              type="number"
              value={order !== undefined && order !== null ? order : ""}
              onChange={(e) => {
                const val = e.target.value;
                setOrder(val === "" ? "" : Number(val));
              }}
              className="w-full rounded-xl border border-zinc-700 p-2.5 text-xs outline-none focus:border-blue-500 bg-zinc-950 text-zinc-100 font-medium shadow-inner"
            />
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm text-white ${
                editingBankId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : editingBankId ? "💾 Update Bank Details" : "+ Publish Bank"}
            </button>
            {editingBankId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full py-2 rounded-xl font-bold text-xs border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Configured Institutions Table Card */}
      <div className="lg:col-span-8 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
          <h2 className="text-base font-black text-zinc-100 tracking-tight">Configured Institutions</h2>
          <span className="text-[11px] text-zinc-500 font-medium">Configure popups per institution</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px] font-black bg-zinc-950">
                <th className="py-3 px-4">Logo</th>
                <th className="py-3 px-4">Bank Name</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Popup Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {banks.map((bank: any) => (
                <tr key={bank.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center overflow-hidden bg-white shadow-inner">
                      {bank.logoUrl ? (
                        <img src={bank.logoUrl} alt={bank.name} className="h-7 w-7 object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-zinc-900">
                          {bank.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-extrabold text-zinc-100">{bank.name}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{bank.subtitle}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    {bank.order ?? 1}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-extrabold px-2.5 py-1 rounded-md text-[10px] tracking-wider border shadow-2xs ${
                      (bank.popupStatus || "").toLowerCase().includes("action")
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : (bank.popupStatus || "").toLowerCase().includes("pending")
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {bank.popupStatus || "SUCCESS"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(bank)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-2xs"
                    >
                      ✎ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenConfig(bank)}
                      className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-2xs"
                    >
                      ⚙ Configure Popup
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBank(bank.id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-2xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {banks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500 text-xs">
                    No configured institutions found.
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