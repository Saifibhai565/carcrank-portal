"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-100 font-sans select-none">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-center space-y-4 max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold animate-bounce">
          ✓
        </div>
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Verification Complete</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your account and trading activity have been successfully verified. You may now close this window or return to the portal.
        </p>
        <div className="pt-2">
          <span className="inline-block bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-[11px] font-bold">
            Status: Secured & Approved
          </span>
        </div>
      </div>
    </div>
  );
}