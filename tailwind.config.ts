import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0A0F2C",
        brand: "#2563EB",
        gold: "#F59E0B",
        soft: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Bricolage Grotesque'", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(at 20% 20%, rgba(37,99,235,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(245,158,11,0.18) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(37,99,235,0.18) 0px, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
