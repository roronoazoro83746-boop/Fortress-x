/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0b0e14',
          surface: '#151921',
          primary: '#00d4ff',
          secondary: '#7000ff',
          success: '#00ff9d',
          warning: '#ffae00',
          danger: '#ff0055',
        }
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
