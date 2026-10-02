"use client";

import { useEffect, useState } from "react";

export default function ClientViewPage() {
  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFrame = async () => {
      try {
        const res = await fetch("/api/admin/stream");
        const data = await res.json();
        if (data.success && data.frame && isMounted) {
          setFrame(data.frame);
        }
      } catch (err) {}
    };

    fetchFrame();
    const interval = setInterval(fetchFrame, 600); // Super fast smooth refresh

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    // Non-blocking instant click request
    fetch("/api/admin/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y }),
    }).catch(() => {});
  };

  const handleWheel = async (e: React.WheelEvent<HTMLDivElement>) => {
    // Instant scrolling
    fetch("/api/admin/scroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deltaY: e.deltaY }),
    }).catch(() => {});
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete") {
      fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: e.key }),
      }).catch(() => {});
    } else if (e.key.length === 1) {
      fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: e.key }),
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
      {frame ? (
        <img 
          src={frame} 
          alt="Remote Browser Viewport" 
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-medium">Connecting to remote screen...</p>
        </div>
      )}
    </div>
  );
}