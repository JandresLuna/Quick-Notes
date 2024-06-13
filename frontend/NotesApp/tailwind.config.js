/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html","./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        "primary": "#778DA9",
        "secondary": "#0D1B2A"
      },
    },
  },
  plugins: [],
}

