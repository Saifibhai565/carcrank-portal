"use client";

import { useState, useEffect } from "react";
import LiveStreamViewer from "@/components/LiveStreamViewer";

export default function ProxyAndStreamManager() {
  const [proxyType, setProxyType] = useState("socks5");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [embedding, setEmbedding] = useState(false);
  const [proxyEnabled, setProxyEnabled] = useState(true);

  const [proxyStatusData, setProxyStatusData] = useState<{
    ip: string;
    country: string;
    state: string;
    city: string;
    timezone: string;
    time: string;
    org: string;
    status: string;
  } | null>(null);
  
  const [sessions, setSessions] = useState<Array<{
    id: string;
    targetUrl: string;
    ip: string;
    country: string;
    city: string;
    status: string;
    createdAt: string;
  }>>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [connectingSessionId, setConnectingSessionId] = useState<string | null>(null);

  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  // 🔥 1. Ghost Session Fix & LocalStorage Sync on Component Mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("rbi_active_session_id");
    if (savedSessionId) {
      setActiveSessionId(savedSessionId);
    }
    
    // Refresh par backend se sessions fetch karna
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/admin/sessions");
        const data = await res.json();
        if (data.success && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        }
      } catch (err) {}
    };
    fetchSessions();
  }, []);

  const handleEmbedProxy = async () => {
    if (!proxyEnabled || !ip || !port) {
      alert("Please enter valid Proxy IP and Port, and ensure Proxy is enabled.");
      return;
    }

    setEmbedding(true);
    const proxyString = `${proxyType.toLowerCase()}://${username ? `${username}:${password}@` : ""}${ip}:${port}`;

    try {
      const res = await fetch("/api/admin/proxy-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proxyString })
      });
      const data = await res.json();
      if (data.success && data.details) {
        setProxyStatusData(data.details);
        alert("Proxy successfully embedded and verified!");
      } else {
        alert("Proxy Error: " + (data.error || "Connection refused"));
      }
    } catch (err) {
      alert("Failed to embed proxy network!");
    } finally {
      setEmbedding(false);
    }
  };

  const handleLaunchBrowser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const proxyString = proxyEnabled && ip && port 
      ? `${proxyType.toLowerCase()}://${username ? `${username}:${password}@` : ""}${ip}:${port}`
      : "";

    try {
      const res = await fetch("/api/admin/proxy-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proxyString, targetUrl })
      });
      const data = await res.json();
      
      if (data.success && data.sessionId) {
        const info = data.sessionInfo || {};
        
        const newSession = {
          id: data.sessionId,
          targetUrl,
          ip: proxyStatusData?.ip || info.ip || (proxyEnabled && ip ? ip : "Direct Connection"),
          country: proxyStatusData?.country || info.country || (proxyEnabled && ip ? "Proxy Node" : "Local"),
          city: proxyStatusData?.city || info.city || "Secured",
          status: "Live & Streaming",
          createdAt: new Date().toLocaleTimeString()
        };

        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(data.sessionId);
        localStorage.setItem("rbi_active_session_id", data.sessionId);
        
        await fetch("/api/admin/session/select", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: data.sessionId }),
        }).catch(() => {});

        alert("Browser session successfully launched with active location!");
      } else {
        alert("Error: " + (data.error || "Failed to launch browser"));
      }
    } catch (err) {
      alert("Network request failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    if (!confirm("Terminate this active session?")) return;
    try {
      const res = await fetch("/api/admin/session/terminate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          localStorage.removeItem("rbi_active_session_id");
        }
        alert("Session terminated successfully!");
      }
    } catch (err) {
      alert("Failed to terminate session.");
    }
  };

  // 🔥 Master Terminate All Sessions Function
  const handleTerminateAll = async () => {
    if (!confirm("Kya aap waqai saare active sessions ko terminate karna chahte hain?")) return;
    try {
      await fetch("/api/admin/session/terminate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terminateAll: true }),
      });
      setSessions([]);
      setActiveSessionId(null);
      localStorage.removeItem("rbi_active_session_id");
      alert("All sessions terminated successfully!");
    } catch (err) {
      alert("Failed to terminate all sessions.");
    }
  };

  const handleRedirectUser = async () => {
    if (!redirectUrl) {
      alert("Please enter a valid redirect URL.");
      return;
    }
    setRedirecting(true);
    try {
      const res = await fetch("/api/admin/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: redirectUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Redirect signal successfully sent!");
      } else {
        alert("Failed to send redirect signal.");
      }
    } catch (err) {
      alert("Network request failed!");
    } finally {
      setRedirecting(false);
    }
  };

  const handleOpenClientTab = (sessionId?: string) => {
    const query = sessionId ? `?sessionId=${sessionId}` : "";
    window.open(`/client${query}`, "_blank");
  };

  return (
    <div className="p-6 space-y-6 text-zinc-100 bg-zinc-950 min-h-screen">
      
      {/* Top Pro Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight">RBI Command Center Pro</h1>
          <p className="text-xs text-zinc-400">Manage proxy nodes with real-time location tracking and isolated browser streams.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            System Online
          </div>
        </div>
      </div>

      {/* Configuration & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Proxy Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 lg:col-span-1 shadow-xl text-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <span>🌐 Proxy Node Settings</span>
              {proxyEnabled && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={proxyEnabled} 
                onChange={(e) => setProxyEnabled(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-[10px] font-bold text-zinc-400">{proxyEnabled ? "Active" : "Bypass"}</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Protocol:</label>
              <select 
                value={proxyType} 
                onChange={(e) => setProxyType(e.target.value)}
                disabled={!proxyEnabled}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none cursor-pointer disabled:opacity-50 font-mono"
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
                disabled={!proxyEnabled}
                placeholder="1081"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">Proxy IP Address / Host:</label>
            <input 
              type="text" 
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              disabled={!proxyEnabled}
              placeholder="e.g. 216.26.225.108"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Username:</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!proxyEnabled}
                placeholder="username"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-bold">Password:</label>
              <input 
                type="text" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!proxyEnabled}
                placeholder="password"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-bold">Tunnel Status:</span>
              <span className={proxyStatusData ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {proxyStatusData ? "Connected & Verified" : "Direct / Unsecured"}
              </span>
            </div>
            <button 
              onClick={handleEmbedProxy}
              disabled={embedding}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {embedding ? "Embedding & Testing Proxy..." : "🔗 Proxy Embed & Verify"}
            </button>
          </div>

          {proxyStatusData && (
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-emerald-500/30 space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-emerald-400 font-bold">
                <span>📍 Live Proxy Telemetry</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-zinc-300">
                <div><span className="text-zinc-500">IP:</span> {proxyStatusData.ip}</div>
                <div><span className="text-zinc-500">Country:</span> {proxyStatusData.country}</div>
                <div><span className="text-zinc-500">State:</span> {proxyStatusData.state}</div>
                <div><span className="text-zinc-500">City:</span> {proxyStatusData.city}</div>
                <div><span className="text-zinc-500">Timezone:</span> {proxyStatusData.timezone}</div>
                <div><span className="text-zinc-500">Local Time:</span> {proxyStatusData.time}</div>
              </div>
              <div className="text-[10px] text-zinc-400 truncate pt-1 border-t border-zinc-800">
                <span className="text-zinc-500">ISP / Org:</span> {proxyStatusData.org}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Launcher & Global Redirect Controls */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 lg:col-span-2 shadow-xl flex flex-col justify-between space-y-4">
          
          <form onSubmit={handleLaunchBrowser} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3 text-xs">
            <div>
              <p className="font-bold text-zinc-200 text-xs">Quick Browser URL Launcher</p>
              <p className="text-[10px] text-zinc-400">Launch a new isolated session with custom proxy location tracking.</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="url" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                required
                placeholder="https://example.com"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2.5 rounded-xl text-xs text-zinc-200 font-mono outline-none w-full"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer whitespace-nowrap"
              >
                {loading ? "Launching..." : "Launch New Session"}
              </button>
            </div>
          </form>

          {/* Redirect Control */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-zinc-200">Global User Redirect Control</p>
              <p className="text-[10px] text-zinc-400">Redirect client to any specified URL instantly.</p>
            </div>
            <div className="flex items-center gap-2 w-full max-w-md">
              <input 
                type="text" 
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="http://localhost:3000/success"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-zinc-200 font-mono outline-none w-full"
              />
              <button 
                onClick={handleRedirectUser}
                disabled={redirecting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg cursor-pointer whitespace-nowrap"
              >
                {redirecting ? "Redirecting..." : "Redirect Client"}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Active Browser Sessions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-zinc-200">Active Browser Sessions & Location Tracking</h2>
            <span className="text-[10px] text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
              Active Sessions: {sessions.length}
            </span>
          </div>
          {sessions.length > 0 && (
            <button 
              onClick={handleTerminateAll}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow cursor-pointer"
            >
              Terminate All Sessions
            </button>
          )}
        </div>
        {sessions.length === 0 ? (
          <div className="flex items-center justify-between py-6">
            <p className="text-xs text-zinc-500">Koi active session table mein nahi hai (Lekin background mein chal raha ho sakta hai).</p>
            {activeSessionId && (
              <button 
                onClick={() => handleEndSession(activeSessionId)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                End Active Session ({activeSessionId})
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-3">Session ID</th>
                  <th className="p-3">Target URL</th>
                  <th className="p-3">Proxy IP</th>
                  <th className="p-3">Country / State / City</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">View Browser</th>
                  <th className="p-3">Client Link</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-mono">
                {sessions.map((sess) => {
                  const isSelected = activeSessionId === sess.id;
                  const isConnecting = connectingSessionId === sess.id;
                  return (
                    <tr 
                      key={sess.id} 
                      className={`transition hover:bg-zinc-800/50 ${isSelected ? 'bg-blue-950/40 border-l-4 border-blue-500' : ''}`}
                    >
                      <td className="p-3 text-emerald-400 font-bold">{sess.id}</td>
                      <td className="p-3 text-zinc-300 truncate max-w-xs">{sess.targetUrl}</td>
                      <td className="p-3 text-zinc-200 font-bold">{sess.ip}</td>
                      <td className="p-3 text-zinc-400">{sess.country} / {sess.city}</td>
                      <td className="p-3 text-emerald-400">● {sess.status}</td>
                      
                      <td className="p-3">
                        <button 
                          onClick={async () => {
                            setConnectingSessionId(sess.id);
                            setActiveSessionId(sess.id);
                            localStorage.setItem("rbi_active_session_id", sess.id);
                            
                            await fetch("/api/admin/session/select", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ sessionId: sess.id }),
                            }).catch(() => {});
                            
                            setTimeout(() => {
                              setConnectingSessionId(null);
                            }, 800);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition shadow cursor-pointer whitespace-nowrap ${
                            isConnecting 
                              ? "bg-amber-600 text-white animate-pulse" 
                              : isSelected 
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {isConnecting ? "⏳ Connecting..." : isSelected ? "🟢 Connected" : "🔵 View Browser"}
                        </button>
                      </td>

                      {/* 🔥 Dedicated Open Client Button in Table Row */}
                      <td className="p-3">
                        <button 
                          onClick={() => handleOpenClientTab(sess.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition shadow cursor-pointer flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>🔗 Open Client</span>
                        </button>
                      </td>

                      <td className="p-3 text-right space-x-2">
                        <button 
                          onClick={() => handleEndSession(sess.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded text-[10px] font-bold cursor-pointer"
                        >
                          End Session
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live Stream Viewport Container */}
      <div className="mt-6 flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-zinc-200">
          {activeSessionId ? `Live Stream Viewport (Active Session: ${activeSessionId})` : "Live Stream Viewport (Session select karne ke liye table par click karein)"}
        </h2>
        {activeSessionId && (
          <button 
            onClick={() => handleEndSession(activeSessionId)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded text-xs font-bold transition cursor-pointer shadow"
          >
            🛑 End Current Session ({activeSessionId})
          </button>
        )}
      </div>
      <LiveStreamViewer activeSessionId={activeSessionId} />

    </div>
  );
}