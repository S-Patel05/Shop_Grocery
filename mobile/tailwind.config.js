/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#749af2", // spotify green
          light: "#22C55E",
          dark: "#22C55E",
        },
        background: {
          DEFAULT: "#F2F0EA", // dark background
          light: "#181818",
          lighter: "#282828",
        },
        surface: {
          DEFAULT: "#f28a8a",
          light: "#3E3E3E",
        },
        text: {
          primary: "#000000",
          secondary: "#000000",
          tertiary: "#6A6A6A",
        },
        accent: {
          DEFAULT: "#1DB954",
          red: "#F44336",
          yellow: "#FFC107",
        },
      },
    },
  },
  plugins: [],
}; 