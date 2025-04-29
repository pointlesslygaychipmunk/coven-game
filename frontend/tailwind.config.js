/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f5ef',
          100: '#f0e6d8',
          200: '#e2ccb3',
          300: '#d3b38e',
          400: '#c49969',
          500: '#b58044',
          600: '#9a6836',
          700: '#80502c',
          800: '#653823',
          900: '#4a201a',
        },
        accent: {
          50: '#f0e6f5',
          100: '#dfc6eb',
          200: '#c99cd7',
          300: '#b373c3',
          400: '#9c4aaf',
          500: '#85219a',
          600: '#6d1b81',
          700: '#561768',
          800: '#3e134f',
          900: '#271036',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#121212',
        },
      },
      fontFamily: {
        serif: ['Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 15px 5px rgba(156, 106, 183, 0.2)',
        'glow': '0 0 15px 5px rgba(156, 106, 183, 0.2)',
      },
      backgroundImage: {
        'moon-gradient': 'radial-gradient(circle, rgba(244,244,255,1) 0%, rgba(230,230,250,1) 70%, rgba(220,220,240,1) 100%)',
        'paper-texture': "url('/images/textures/paper-texture.png')",
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px 0 rgba(156, 106, 183, 0.3)' },
          '100%': { boxShadow: '0 0 20px 10px rgba(156, 106, 183, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}