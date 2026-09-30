"use client";

export default function PlaidStepOne({ banks, search, setSearch, onSelectBank, renderLogo }: any) {
  const filteredBanks = banks.filter(
    (b: any) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
        {filteredBanks.map((bank: any) => {
          const hasArrow =
            bank.subOptions?.length ||
            bank.subtitle?.toLowerCase().includes("multiple");

          return (
            <div
              key={bank.id}
              onClick={() => onSelectBank(bank)}
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
  );
}