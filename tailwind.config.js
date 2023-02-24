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
          150: "#F4F4F4",
          200: "#9399A9",
        },
        brandSkin: {
          100: "#FFE7C1",
        },
        brandOrange: {
          10: "rgb(254, 176, 25, 0.1)",
          100: "rgb(254, 176, 25)",
        },
        brandBlue: {
          10: "rgb(0, 143, 251, 0.1)",
          100: "rgb(0, 143, 251)",
        },
        brandGreen: {
          10: "rgb(0, 227, 150, 0.1)",
          100: "rgb(0, 227, 150)",
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
