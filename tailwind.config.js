/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage-pink': '#D8A7B1',
        'vintage-lavender': '#B6A6CA',
        'vintage-sage': '#9CAF88',
        'vintage-yellow': '#E6D3A3',
        'vintage-bg': '#F4ECE3',
      },
      fontFamily: {
        'serif-elegant': ['"Playfair Display"', 'serif'],
        'script-retro': ['"Great Vibes"', 'cursive'],
        'body': ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'grain': 'url("https://www.transparenttextures.com/patterns/stardust.png")',
        'paper': 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
      }
    },
  },
  plugins: [],
}
