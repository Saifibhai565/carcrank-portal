"use client";

import { useEffect, useState } from "react";

export default function ClientViewPortal() {
  const [isDone, setIsDone] = useState(false);
  const [popupMsg, setPopupMsg] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/session/stop");
        const data = await res.json();
        
        if (data.success && !data.sessionState.isActive) {
          setIsDone(true);
          setPopupMsg(true);
          
          // 3 seconds baad user ko final URL par redirect kar dena
          setTimeout(() => {
            window.location.href = data.sessionState.redirectUrl;
          }, 3000);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md">
        <h1 className="text-lg font-black mb-2">Secure Gateway Session</h1>
        <p className="text-xs text-zinc-400 mb-6">Please complete your verification on the active view.</p>
        
        {/* Live Stream Viewport here */}
      </div>

      {/* Success Popup Notification */}
      {popupMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-xs font-black">Apply Successfully!</p>
            <p className="text-[10px] text-emerald-400">Your session is verified. Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
}