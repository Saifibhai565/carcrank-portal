"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ClientViewContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  const [frame, setFrame] = useState<string | null>(null);
  const [isTerminated, setIsTerminated] = useState(false);

  // 🔥 1. Admin Redirect & Close Listener Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/redirect`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.redirectUrl && data.redirectUrl.trim() !== "") {
            setIsTerminated(true);
            setFrame(null);
            window.location.href = data.redirectUrl;
          }
        }
      } catch (err) {}
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 🔥 2. Frame Fetching Polling
  useEffect(() => {
    if (isTerminated) return;
    let isMounted = true;

    const fetchFrame = async () => {
      try {
        const res = await fetch(`/api/admin/stream${sessionId ? `?sessionId=${sessionId}` : ""}`);
        const data = await res.json();
        if (data.success && isMounted && data.frame) {
          setFrame(data.frame);
        } else if (!data.success) {
          setFrame(null);
        }
      } catch (err) {}
    };

    fetchFrame();
    const interval = setInterval(fetchFrame, 600);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId, isTerminated]);

  // 🔥 3. Mouse Click Handler (Sends coordinates to backend Playwright)
  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTerminated) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    try {
      await fetch("/api/admin/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, sessionId }),
      });
    } catch (err) {}
  };

  // 🔥 4. Mouse Wheel / Scroll Handler
  const handleWheel = async (e: React.WheelEvent<HTMLDivElement>) => {
    if (isTerminated) return;
    try {
      await fetch("/api/admin/scroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deltaY: e.deltaY, sessionId }),
      });
    } catch (err) {}
  };

  // 🔥 5. Keyboard Typing / KeyDown Handler
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isTerminated) return;
    try {
      if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete") {
        await fetch("/api/admin/type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: e.key, sessionId }),
        });
      } else if (e.key.length === 1) {
        await fetch("/api/admin/type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: e.key, sessionId }),
        });
      }
    } catch (err) {}
  };

  if (isTerminated) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center text-white font-sans select-none">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-center space-y-3 max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto text-lg font-bold">✕</div>
          <h2 className="text-sm font-bold text-zinc-100">Session Closed</h2>
          <p className="text-xs text-zinc-400">The administrator has ended this session.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleContainerClick}
      onWheel={handleWheel}
      className="fixed inset-0 bg-black flex items-center justify-center outline-none cursor-default select-none overflow-hidden focus:outline-none"
    >
      {frame ? (
        <img 
          src={frame} 
          alt="Remote Browser Viewport" 
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-medium">Connecting to remote screen {sessionId ? `(${sessionId})` : ""}...</p>
        </div>
      )}
    </div>
  );
}

export default function ClientViewPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black text-white flex items-center justify-center text-xs">Loading client session...</div>}>
      <ClientViewContent />
    </Suspense>
  );
}