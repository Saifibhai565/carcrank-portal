export default function Header() {
  return (
    <header className="flex items-center px-6 py-9 md:px-16">
      <div className="flex items-center gap-3">
        {/* Exact Geometric Diamond Logo from Image 1 */}
        <svg
          width="26"
          height="22"
          viewBox="0 0 48 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left top polygon */}
          <polygon points="10,4 20,4 14,16 4,16" fill="#0C1938" />
          {/* Center primary diamond */}
          <polygon points="24,2 34,18 24,34 14,18" fill="#0C1938" />
          {/* Bottom right polygon */}
          <polygon points="34,22 44,22 38,34 28,34" fill="#0C1938" />
        </svg>

        {/* Wide-spaced Brand Name */}
        <span className="font-sans text-[17px] font-bold tracking-[0.38em] text-[#0C1938] uppercase select-none">
          YOULEND
        </span>
      </div>
    </header>
  );
}