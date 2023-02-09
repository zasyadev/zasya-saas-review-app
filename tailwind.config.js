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
        "primary-gray": "#F5F5F5",
        "primary-green": "#64A15E",
        brandGray: {
          50: "#F5F6FC",
          100: "#FCFCFC",
        },
      },
      lineHeight: {
        0: "0",
      },
      fontSize: {
        17: "17px",
      },
    },
  },
  plugins: [],
};
