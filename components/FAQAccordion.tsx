"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Why can't I find my bank?",
    a: "If your bank isn't listed, please search using the full institution name or check back shortly as new institutions are added frequently.",
  },
  {
    q: "I'm having issues connecting my bank account. What should I do?",
    a: "Ensure your mobile banking app or online portal credentials are up to date and you have a stable internet connection.",
  },
  {
    q: "I don't have a business bank, can I connect my personal bank account?",
    a: "Yes, you can connect a personal account as long as your primary trading activity and sales cashflow are reflected within it.",
  },
  {
    q: "Why can't I connect my bank account on my mobile device?",
    a: "Make sure pop-ups and third-party cookies are enabled in your mobile browser settings to complete the authentication securely.",
  },
  {
    q: "Why do you need me to connect my account?",
    a: "Connecting your account allows us to verify your trading cashflow safely in real time without requiring manual paper statements.",
  },
  {
    q: "What is Plaid/Open Banking?",
    a: "Open Banking is a secure, FCA-regulated technology standard that allows you to share financial data safely with read-only permissions.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto flex max-w-[650px] flex-col gap-2.5">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-[6px] bg-[#f6f8fc] transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-5 py-3.5 text-left select-none"
              aria-expanded={isOpen}
            >
              <span className="text-[14.5px] font-normal text-[#0c1938]">
                {item.q}
              </span>
              <span className="text-[20px] font-light leading-none text-[#55627a] ml-4">
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-[13.5px] leading-relaxed text-[#55627a]">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}