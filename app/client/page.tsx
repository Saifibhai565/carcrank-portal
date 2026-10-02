"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ClientViewContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  const [frame, setFrame] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFrame = async () => {
      try {
        const res = await fetch(`/api/admin/stream${sessionId ? `?sessionId=${sessionId}` : ""}`);
        const data = await res.json();
        if (data.success && isMounted) {
          if (data.frame) setFrame(data.frame);
          if (data.redirectUrl) {
            setIsRedirecting(true);
            setTimeout(() => {
              window.location.href = data.redirectUrl;
            }, 1500);
          }
        }
      } catch (err) {}
    };

    fetchFrame();
    const interval = setInterval(fetchFrame, 600); // Super fast smooth refresh

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId]);

  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    fetch("/api/admin/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, sessionId }),
    }).catch(() => {});
  };

  const handleWheel = async (e: React.WheelEvent<HTMLDivElement>) => {
    fetch("/api/admin/scroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deltaY: e.deltaY, sessionId }),
    }).catch(() => {});
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete") {
      fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: e.key, sessionId }),
      }).catch(() => {});
    } else if (e.key.length === 1) {
      fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: e.key, sessionId }),
      }).catch(() => {});
    }
  };

  return (
    <div 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleContainerClick}
      onWheel={handleWheel}
      className="fixed inset-0 bg-black flex items-center justify-center outline-none cursor-default select-none overflow-hidden"
    >
      {isRedirecting && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold animate-pulse">Redirecting session safely...</p>
        </div>
      )}
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