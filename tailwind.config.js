/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dusty-pink': '#d8a7b1',
        'dusty-purple': '#b6a6ca',
        'dusty-yellow': '#e6d3a3',
        'bg-aged': '#f4ece3',
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['"Inter"', 'sans-serif'],
        'balloon': ['"Fredoka One"', 'cursive'], // will use web font
      },
      backgroundImage: {
        'grain': 'url("https://www.transparenttextures.com/patterns/stardust.png")',
        'aged-paper': 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
      }
    },
  },
  plugins: [],
}
