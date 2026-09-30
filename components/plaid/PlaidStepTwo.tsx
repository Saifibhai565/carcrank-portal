"use client";

export default function PlaidStepTwo({ selectedBank, options, onSelectOption, onBack, renderLogo }: any) {
  return (
    <div className="flex flex-1 flex-col items-center pt-2 text-center">
      <div className="h-16 w-16 rounded-full border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2 shadow-sm mb-3">
        {renderLogo(selectedBank)}
      </div>

      <h2 className="text-[18px] font-bold text-[#0c1938] leading-tight">
        {selectedBank.name}
      </h2>
      <p className="text-[13px] text-[#64748b] mt-1 mb-5">
        {options.length} associated institutions
      </p>

      <div className="w-full space-y-2.5">
        {options.map((opt: string) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelectOption(opt)}
            className="w-full rounded-[14px] border border-[#e2e8f0] py-3.5 px-4 text-left font-semibold text-[14px] text-[#0c1938] hover:border-slate-400 hover:bg-slate-50 transition cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-8 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="text-[13.5px] font-medium text-[#0c1938] hover:underline cursor-pointer"
        >
          Don't see your bank? Search instead
        </button>
      </div>
    </div>
  );
}