/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#322B46",
          terracotta: "#BE682D",
          "terracotta-aa": "#B2612A",
          green: "#91BC4A",
          "green-aa": "#617F2F",
          "warm-white": "#FEFDFB",
          gray: "#736F74",
        },
        // Semantic tokens for shadcn/ui alignment
        primary: {
          DEFAULT: "#B2612A", // Terracotta AA
          foreground: "#FEFDFB", // Warm White
        },
        secondary: {
          DEFAULT: "#91BC4A", // Green
          foreground: "#322B46", // Navy
        },
        background: "#FEFDFB",
        foreground: "#322B46",
        muted: {
          DEFAULT: "#FEFDFB",
          foreground: "#736F74",
        },
        accent: {
          DEFAULT: "#BE682D",
          foreground: "#FEFDFB",
        },
        border: "#736F74",
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 2px)",
        sm: "calc(1rem - 4px)",
      },
    },
  },
  plugins: [],
}
