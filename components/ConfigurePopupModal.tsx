"use client";

export default function ConfigurePopupModal({
  configModalBank,
  setConfigModalBank,
  editForm,
  setEditForm,
  handleSaveConfig,
}: any) {
  if (!configModalBank) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md text-zinc-100 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100">
            Configure Bank & Popup: {configModalBank.name}
          </h3>
          <button
            type="button"
            onClick={() => setConfigModalBank(null)}
            className="text-zinc-400 hover:text-white font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-300 mb-1">Popup Status & Icon Theme:</label>
            <select
              value={editForm.popupStatus || "SUCCESS"}
              onChange={(e) => setEditForm({ ...editForm, popupStatus: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 p-2.5 outline-none font-semibold text-zinc-200 bg-zinc-950 shadow-inner cursor-pointer"
            >
              <option value="SUCCESS">🟢 SUCCESS (Green Theme)</option>
              <option value="PENDING">🟡 PENDING (Yellow Warning)</option>
              <option value="ACTION">🔴 ACTION REQUIRED (Red Challenge)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1">Popup Heading:</label>
            <input
              type="text"
              value={editForm.popupHeading || ""}
              onChange={(e) => setEditForm({ ...editForm, popupHeading: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 p-2.5 outline-none bg-zinc-950 text-zinc-100 font-medium shadow-inner"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1">Popup Message / Body:</label>
            <textarea
              rows={2}
              value={editForm.popupBody || ""}
              onChange={(e) => setEditForm({ ...editForm, popupBody: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 p-2.5 outline-none bg-zinc-950 text-zinc-100 font-medium shadow-inner"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1">Browser Address Bar:</label>
            <input
              type="text"
              value={editForm.browserAddressBar || ""}
              onChange={(e) => setEditForm({ ...editForm, browserAddressBar: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 p-2.5 font-mono text-[11px] outline-none bg-zinc-950 text-zinc-200 shadow-inner"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleSaveConfig}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-sm text-xs"
            >
              Save Bank & Popup Settings
            </button>
            <button
              type="button"
              onClick={() => setConfigModalBank(null)}
              className="px-5 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition cursor-pointer text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}