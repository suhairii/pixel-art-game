import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#060709",
        cardBg: "#0d0e12",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        cardBorderHighlight: "rgba(255, 255, 255, 0.2)",
        cyberCyan: "#00f0ff",
        neonEmerald: "#10b981",
        pixelGold: "#facc15",
        retroViolet: "#a855f7",
        arcadeRose: "#f43f5e",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow-cyan": "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        "glow-gold": "0 0 25px -5px rgba(250, 204, 21, 0.35)",
        "inner-bezel": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      },
      transitionTimingFunction: {
        awwwards: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
