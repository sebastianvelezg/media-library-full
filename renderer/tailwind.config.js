const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      primary: "#222222",
      primary2: "#111111",
      secondary: "#0077b6",
      secondary2: "#e5e5e5",
      tertiary: "#ffffff",
    },
    extend: {},
  },
  plugins: [],
};
