module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./service/**/*.{js,ts,jsx,tsx}",
      "./stores/**/*.{js,ts,jsx,tsx}",
      "./config/**/*.{js,ts,jsx,tsx}",
      "./public/**/*.{js,ts,jsx,tsx}", 
    ],
    theme: {
      extend: {
        screens: {
          "max-xl2": { max: "900px" },
        },
      },
    },
    plugins: [],
  };
  