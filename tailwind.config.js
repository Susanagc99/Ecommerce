const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // todos los archivos de tu app
    "./components/**/*.{js,ts,jsx,tsx}", // si tienes carpeta components
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // HeroUI
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
