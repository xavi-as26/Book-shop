/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'ios-blue': '#007AFF',
        'ios-gray': '#8E8E93',
      },
      backdropBlur: {
        'ios': '20px',
      },
    },
  },
  plugins: [],
}
