"use client";

export default function PlaidStepZero({ onContinue, isLoading }: any) {
  return (
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
          disabled={isLoading}
          onClick={onContinue}
          className="w-full rounded-[14px] bg-[#111625] py-3.5 text-[14.5px] font-bold text-white flex items-center justify-center gap-2 hover:bg-black transition active:scale-[0.99] cursor-pointer shadow-sm"
        >
          {isLoading ? (
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
  );
}