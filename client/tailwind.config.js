/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        bpGreen: "#59FFA0",
        bpYellow: "#FFBF00",
        bpRed: "#CF293A",
        bpDarkPrimary: "#0F0E0E",
        bpDarkSecondary: "#171717",
      },
    },
  },
  plugins: [],
};
