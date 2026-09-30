import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Single light, professional palette — used across public site AND admin
        navy: "#0B1130",
        ink: "#141B3C",
        brand: "#3D4FE7",
        brandDark: "#2E3ECF",
        lavender: "#EEF0FA",
        lavenderLine: "#E2E5F5",
        slate: "#6B7280",
        mint: "#22C55E",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        panel: "16px",
        pill: "999px",
        admin: "6px",
      },
    },
  },
  plugins: [],
};
export default config;