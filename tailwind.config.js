/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)", // Dynamic via CSS variables
          dark: "#0f172a", // Slate-900 for black theme
          light: "#f8fafc", // Slate-50 for white theme
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "#1e293b", // Slate-800
          light: "#e2e8f0", // Slate-200
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          DEFAULT: "#2dd4bf", // Teal-400 for both themes
        },
        text: {
          DEFAULT: "var(--color-text)",
          dark: "#f1f5f9", // Slate-100 for black theme
          light: "#1e293b", // Slate-800 for white theme
        },
      },
      boxShadow: {
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        "dark-md":
          "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.06)",
        "dark-xl":
          "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)",
        "dark-2xl": "0 25px 50px -12px rgba(255, 255, 255, 0.15)",
        "dark-3xl": "0 35px 60px -15px rgba(255, 255, 255, 0.2)",
      },
      spacing: {
        navbar: "80px", // Matches navbar height for consistent offsets
      },
    },
  },
  plugins: [],
  darkMode: "class", // Ensure dark mode is enabled with [data-theme] attribute
};
