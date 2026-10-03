"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ClientViewContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("sessionId") || "";
  const [sessionId, setSessionId] = useState(urlSessionId);
  const [frame, setFrame] = useState<string | null>(null);
  const [isTerminated, setIsTerminated] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (urlSessionId) {
      setSessionId(urlSessionId);
    }
  }, [urlSessionId]);

  // 1. Redirect / Termination Polling
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
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // 2. High-speed Frame Streaming
  useEffect(() => {
    if (isTerminated || !sessionId) return;
    let isMounted = true;

    const fetchFrame = async () => {
      try {
        const res = await fetch(`/api/admin/stream?sessionId=${sessionId}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && isMounted && data.frame) {
          setFrame(data.frame);
        } else if (!data.success) {
          setFrame(null);
        }
      } catch (err) {}
    };

    fetchFrame();
    const interval = setInterval(fetchFrame, 350);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId, isTerminated]);

  // 3. Auto-focus hidden input continuously
  useEffect(() => {
    const focusTimer = setInterval(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 500);
    return () => clearInterval(focusTimer);
  }, []);

  // 4. Unified Interaction Handler
  const handleInteraction = async (clientX: number, clientY: number, target: HTMLElement) => {
    if (isTerminated || !sessionId) return;
    
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }

    const rect = target.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);
    
    try {
      await fetch("/api/admin/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, button: "left", sessionId }),
      });
    } catch (err) {}
  };

  // 5. Keyboard Typing Handler
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (isTerminated || !sessionId) return;
    
    try {
      if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete" || e.key === "Tab") {
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
      onClick={(e) => handleInteraction(e.clientX, e.clientY, e.currentTarget)}
      onTouchEnd={(e) => {
        if (e.changedTouches?.[0]) {
          handleInteraction(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.currentTarget);
        }
      }}
      className="fixed inset-0 bg-black flex items-center justify-center outline-none cursor-default select-none overflow-hidden"
    >
      {/* Hidden input to capture keystrokes reliably */}
      <input 
        ref={hiddenInputRef}
        type="text" 
        onKeyDown={handleKeyDown}
        className="absolute opacity-1 w-1 h-1 bg-transparent border-none outline-none"
        style={{ left: "-9999px" }}
        autoFocus
      />

      {frame ? (
        <img 
          src={frame} 
          alt="Remote Browser Viewport" 
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-medium">Connecting to session...</p>
        </div>
      )}
    </div>
  );
}

export default function ClientViewPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black text-white flex items-center justify-center text-xs">Loading...</div>}>
      <ClientViewContent />
    </Suspense>
  );
}