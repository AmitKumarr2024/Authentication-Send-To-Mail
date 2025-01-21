/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ringColor: {
        DEFAULT: "#1D4ED8", // Customize default ring color
      },
    },
  },
  plugins: [],
};
