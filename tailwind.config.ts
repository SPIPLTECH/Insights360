import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#EC1E63",
          orange: "#F5762E",
          50: "#FFF4EF",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #EC1E63 0%, #F5762E 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
