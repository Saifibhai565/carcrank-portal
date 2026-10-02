"use client";

import { useEffect, useState, useRef } from "react";

export default function LiveStreamViewer({ targetUrl }: { targetUrl: string }) {
  const [frame, setFrame] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(2);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFrame = async () => {
      try {
        const res = await fetch("/api/admin/stream");
        const data = await res.json();
        if (data.success && data.frame && isMounted) {
          setFrame(data.frame);
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    fetchFrame();
    const interval = setInterval(fetchFrame, 1000 / fps);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fps]);

  // Left Click handler
  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    fetch("/api/admin/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, button: "left" }),
    }).catch(() => {});
  };

  // Right Click handler
  const handleContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Default browser menu roknay ke liye
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    fetch("/api/admin/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, button: "right" }),
    }).catch(() => {});
  };

  // Smooth Scrolling handler
  const handleWheel = async (e: React.WheelEvent<HTMLDivElement>) => {
    fetch("/api/admin/scroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deltaY: e.deltaY }),
    }).catch(() => {});
  };

  // Mouse Move handler for hover effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    fetch("/api/admin/mousemove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y }),
    }).catch(() => {});
  };

  // Keyboard keys handler (Backspace, Delete, Enter, Typing)
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

  const toggleFullScreen = () => {
    if (!viewerRef.current) return;
    if (!isFullScreen) {
      viewerRef.current.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  return (
    <div 
      ref={viewerRef} 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl mx-auto focus:outline-none focus:border-blue-600"
    >
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
          <span className="font-bold text-zinc-200">RBI Stream Node:</span>
          <span className="text-zinc-400 font-mono">{targetUrl || "about:blank"}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[10px]">
            <span className="text-zinc-500">Status:</span>
            <span className={isConnected ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {isConnected ? "LIVE STREAM ACTIVE" : "CONNECTING..."}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[10px]">
            <span className="text-zinc-500">Speed:</span>
            <select 
              value={fps} 
              onChange={(e) => setFps(Number(e.target.value))}
              className="bg-transparent text-zinc-300 outline-none cursor-pointer"
            >
              <option value={1} className="bg-zinc-900">1 FPS (Eco)</option>
              <option value={2} className="bg-zinc-900">2 FPS (Standard)</option>
              <option value={5} className="bg-zinc-900">5 FPS (Smooth)</option>
            </select>
          </div>

          <button 
            onClick={toggleFullScreen}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded transition text-[10px] font-bold"
          >
            {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      <div 
        onClick={handleContainerClick}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[550px] bg-black flex items-center justify-center overflow-hidden cursor-default select-none"
      >
        {frame ? (
          <img 
            src={frame} 
            alt="Live Remote Browser Stream" 
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-zinc-500">
            <div className="w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Initializing secure headless stream & binding proxy...</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900/80 px-4 py-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-4">
          <span>Resolution: 1280x800</span>
          <span>Protocol: CDP / JPEG Stream</span>
        </div>
        <div className="text-emerald-400 font-mono">
          Secure Encrypted Remote Session
        </div>
      </div>
    </div>
  );
}