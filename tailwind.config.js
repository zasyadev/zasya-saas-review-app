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
          600: "#9399A9",
        },
        brandSkin: {
          100: "#FFE7C1",
        },
        brandOrange: {
          10: "rgb(254, 176, 25, 0.1)",
          100: "rgb(254, 176, 25)",
          200: "#FFECDF",
          300: "rgba(238, 120, 108, 0.25)",
          400: "#FF6968",
          500: "#FFE9C8",
          600: "#FF9F5B",
        },
        brandBlue: {
          10: "rgb(0, 143, 251, 0.1)",
          100: "rgb(0, 143, 251)",
          200: "#DEDEFF",
          300: "#2196F3",
          700: "#0747A6",
        },
        brandGreen: {
          10: "rgb(0, 227, 150, 0.1)",
          100: "rgb(0, 227, 150)",
          200: "#E0F8E9",
          300: "#4CAF50",
          400: "#C3FFBD",
        },
        brandRed: {
          100: "#F44336",
        },
      },
      lineHeight: {
        0: "0",
      },
      fontSize: {
        17: "17px",
      },
      boxShadow: {
        brand: "0px 20px 70px rgba(86, 89, 146, 0.1)",
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-green-200",
    "text-blue-600",
    "bg-blue-200",
    "text-orange-600",
    "bg-red-200",
    "bg-brandGreen-300",
    "bg-brandBlue-300",
    "bg-orange-500",
    "bg-red-500",
    "bg-gray-500",
  ],
};
