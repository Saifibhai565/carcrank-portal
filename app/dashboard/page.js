import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDemoSession, destroyDemoSession } from "@/lib/demo-auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("carcrank_demo_session");
  const session = getDemoSession(sessionCookie?.value);

  if (!session) {
    redirect("/qr-lab");
  }

  async function handleLogout() {
    "use server";
    const store = await cookies();
    const current = store.get("carcrank_demo_session");
    if (current) {
      destroyDemoSession(current.value);
      store.delete("carcrank_demo_session");
    }
    redirect("/qr-lab");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6 sm:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-emerald-400">CarCrank Dashboard</h1>
            <p className="text-xs text-slate-400">QR Login Successful</p>
          </div>
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full">
            Active Session
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-6 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700 flex justify-between">
            <span className="text-slate-400">Authenticated User:</span>
            <span className="font-semibold text-slate-200">{session.user}</span>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700 flex justify-between">
            <span className="text-slate-400">Isolation Status:</span>
            <span className="font-semibold text-blue-400">New Isolated Browser Context ✓</span>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700 flex justify-between">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-mono text-slate-300">{session.transactionId}</span>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700 flex justify-between">
            <span className="text-slate-400">Session Cookie:</span>
            <span className="font-mono text-emerald-400">carcrank_demo_session (HttpOnly)</span>
          </div>
        </div>

        {/* Action Logout */}
        <form action={handleLogout} className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Logout & Clear Session
          </button>
        </form>

      </div>
    </div>
  );
}