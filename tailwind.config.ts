import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'minecraft': ['var(--font-minecraft)', 'monospace'],
      },
      colors: {
        // MBA Brand Colors (from logo)
        'mba-blue': '#00A8E8',
        'mba-dark': '#0A0E27',
        'mba-light': '#F5F5F5',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
