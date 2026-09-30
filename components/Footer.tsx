export default function Footer() {
  return (
    <>
      <footer className="mt-20 bg-[#081126] px-6 py-14 text-white md:px-16">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 md:flex-row md:items-start">
          
          {/* Left Column: Logo & Trustpilot */}
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              
             <div className="mb-6 flex items-center">
  <img
    src="/youland-white-logo.png"
    alt="YouLend"
   className="h-12 md:h-15 w-auto object-contain"
    onError={(e) => {
      // Agar file extension .svg ya .jpg ho to fallback check
      const target = e.currentTarget;
      if (!target.src.endsWith(".svg")) {
        target.src = "/youland-white-logo.svg";
      }
    }}
  />
</div>
            </div>

            {/* Trustpilot Box */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-base font-bold text-white">
                <span className="text-xl text-[#00b67a]">★</span>
                <span>Trustpilot</span>
              </div>
              
              {/* Trustpilot 5 Stars */}
              <div className="flex gap-[3px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-6 w-6 items-center justify-center bg-[#00b67a] text-xs font-bold text-white select-none"
                  >
                    ★
                  </div>
                ))}
              </div>

              {/* TrustScore Text */}
              <p className="mt-1 text-xs text-[#9aa4b5]">
                TrustScore 4.8 |{" "}
                <span className="font-semibold text-white underline cursor-pointer">
                  12,689 reviews
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Help, Contact & Social */}
          <div className="flex flex-col items-start gap-2.5 text-[13px] md:items-end">
            <div className="text-[#ffffff]">
              Visit our{" "}
              <a href="#" className="font-medium underline hover:text-white/80">
                Help Centre
              </a>
            </div>

            <div>
              <a href="#" className="font-medium underline hover:text-white/80">
                Chat to us
              </a>
            </div>

            <div className="mt-1 font-semibold text-white tracking-wide">
              020 3514 8421
            </div>

            <div className="text-[#a4b1c7]">
              application@youlend.com
            </div>

            {/* Social Icons (LinkedIn & X) */}
            <div className="mt-2 flex items-center gap-4">
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white hover:text-white/80 transition-opacity"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="X"
                className="text-white hover:text-white/80 transition-opacity"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="mt-3 text-xs text-[#7b889e]">
              © YouLend. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Left SSL Lock Icon */}
      <div
        className="fixed bottom-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#081126] border border-white/20 shadow-md cursor-pointer"
        title="Secure SSL Connection"
      >
        <svg
          className="h-4 w-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Floating Bottom Right Chat Widget */}
      <div
        className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#009da0] shadow-[0_4px_14px_rgba(0,157,160,0.4)] cursor-pointer hover:scale-105 transition-transform"
        title="Live Chat"
      >
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    </>
  );
}