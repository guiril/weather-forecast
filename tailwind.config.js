/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          0: '#F8F8F8'
        },
        primary: '#0076FF'
      }
    },
  },
  plugins: [],
}

