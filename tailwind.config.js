/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3085C3',
        secondary: '#5CD2E6',
        info: '#F4E869'
      }
    },
  },
  plugins: [],
}

