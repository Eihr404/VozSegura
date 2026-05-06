import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vozsegura: {
          oscuro: "#140c2e",
          verde: "#1fa971",
          negro: "#0b0b0f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
