"use client";

import { useEffect, useState, useRef } from "react";

export default function LiveStreamViewer({ activeSessionId }: { activeSessionId: string | null }) {
  const [frame, setFrame] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(5); // Default fast speed (5 FPS)
  const [quality, setQuality] = useState(95); 
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isConnected) {
        setSessionTime((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let isMounted = true;
    
    if (!activeSessionId) {
      setFrame(null);
      setIsConnected(false);
      return;
    }

    setFrame(null); 

    const fetchFrame = async () => {
      try {
        const query = `?sessionId=${activeSessionId}&quality=${quality}`;
        const res = await fetch(`/api/admin/stream${query}`);
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
  }, [fps, quality, activeSessionId]);

  // Unified Interaction Handler for Mouse & Touch on Admin Stream Viewer
  const handleInteraction = async (clientX: number, clientY: number, target: HTMLElement, button: string = "left") => {
    if (!activeSessionId) return;
    const rect = target.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);
    
    fetch("/api/admin/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, button, sessionId: activeSessionId }),
    }).catch(() => {});
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleInteraction(e.clientX, e.clientY, e.currentTarget, "left");
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      handleInteraction(touch.clientX, touch.clientY, e.currentTarget, "left");
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleInteraction(e.clientX, e.clientY, e.currentTarget, "right");
  };

  const handleWheel = async (e: React.WheelEvent<HTMLDivElement>) => {
    if (!activeSessionId) return;
    fetch("/api/admin/scroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deltaY: e.deltaY, sessionId: activeSessionId }),
    }).catch(() => {});
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeSessionId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 800 / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    
    fetch("/api/admin/mousemove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, sessionId: activeSessionId }),
    }).catch(() => {});
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeSessionId) return;
    if (e.key === "Backspace" || e.key === "Enter" || e.key === "Delete" || e.key === "Tab") {
      fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: e.key, sessionId: activeSessionId }),
      }).catch(() => {});
    } else if (e.key.length === 1) {
      fetch("/api/admin/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: e.key, sessionId: activeSessionId }),
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
          <span className="text-zinc-400 font-mono">{activeSessionId ? `Session ID: ${activeSessionId}` : "No Session Selected"}</span>
          {isConnected && (
            <span className="ml-2 bg-zinc-950 text-emerald-400 font-mono px-2 py-0.5 rounded border border-zinc-800 text-[10px]">
              ⏱ {formatTime(sessionTime)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[10px]">
            <span className="text-zinc-500">Status:</span>
            <span className={isConnected ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {isConnected ? "LIVE STREAM ACTIVE" : "NO SESSION"}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[10px]">
            <span className="text-zinc-500">Quality:</span>
            <select 
              value={quality} 
              onChange={(e) => setQuality(Number(e.target.value))}
              className="bg-transparent text-zinc-300 outline-none cursor-pointer font-bold"
            >
              <option value={50} className="bg-zinc-900">50% (Fast)</option>
              <option value={75} className="bg-zinc-900">75% (Balanced)</option>
              <option value={95} className="bg-zinc-900">100% (HD Crystal)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[10px]">
            <span className="text-zinc-500">Speed:</span>
            <select 
              value={fps} 
              onChange={(e) => setFps(Number(e.target.value))}
              className="bg-transparent text-zinc-300 outline-none cursor-pointer"
            >
              <option value={2} className="bg-zinc-900">2 FPS (Standard)</option>
              <option value={5} className="bg-zinc-900">5 FPS (Smooth)</option>
              <option value={10} className="bg-zinc-900">10 FPS (Ultra Fast)</option>
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
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[550px] bg-black flex items-center justify-center overflow-hidden cursor-default select-none touch-none"
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
            <p className="text-xs font-medium">
              {activeSessionId ? "Initializing secure headless stream & binding proxy..." : "Please select or launch a session to view live stream..."}
            </p>
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