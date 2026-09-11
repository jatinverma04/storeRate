/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#374151",
          hover: "#1F2937",
        },
        accent: "#6B8E6B",
        background: "#F7F7F5",
        surface: "#FFFFFF",
        "text-primary": "#1F2937",
        "text-secondary": "#6B7280",
        border: "#E5E7EB",
        success: "#4D7C5A",
        error: "#B91C1C",
        warning: "#A16207",
        "rating-unselected": "#D1D5DB",
        "nav-active": "#ECEDE9",
      },
      borderRadius: {
        input: "6px",
        button: "6px",
        card: "8px",
        modal: "8px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
