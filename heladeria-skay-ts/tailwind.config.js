const { nextui } = require("./node_modules/@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cocoa: { 700: "#5C3317" },
        cream: { 50: "#FFF8F0" }
      }
    }
  },
  darkMode: "class",
  plugins: [nextui()]
};