module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./component/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "#0f123f",
        secondary: "#ff7473",
        light: "#f8f8ff",
        peach: "#fb7185",
        "peach-light": "#fda4af",
        "primary-gray": "#f3f3fc",
      },
      lineHeight: {
        0: "0",
      },
    },
  },
  plugins: [],
};
