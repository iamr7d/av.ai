/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Always dark mode
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo
          dark: "#4338ca",
          light: "#818cf8",
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          DEFAULT: "#8b5cf6", // Purple
          dark: "#6d28d9",
          light: "#a78bfa",
        },
        background: {
          light: "#ffffff",
          dark: "#121212",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.65)",
          dark: "rgba(0, 0, 0, 0.85)",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'slide-right': 'slide-right 1.5s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
}

