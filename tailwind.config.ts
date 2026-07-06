import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#07130d",
        grass: "#22c55e",
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 197, 94, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
