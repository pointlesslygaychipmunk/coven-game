module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../shared/src/**/*.{ts,tsx}"
  ],
  theme: { extend: {} },
  plugins: [require("tailwindcss-animate")]
};