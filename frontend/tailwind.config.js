/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'flash-grow': 'flash-grow 0.5s ease-in-out',
      },
      keyframes: {
        'flash-grow': {
          '0%': { transform: 'scale(1)', backgroundColor: '#fff8dc' },
          '50%': { transform: 'scale(1.05)', backgroundColor: '#facc15' },
          '100%': { transform: 'scale(1)', backgroundColor: '#fefce8' },
        },
      },
    },
  },
  plugins: [],
}
