/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': {
          light: '#F2ECEB',
          DEFAULT: '#D9A7A7',
          dark: '#BF8A8A',
        },
        'yellow-gold': {
          light: '#F2C744',
          DEFAULT: '#D99E32',
          dark: '#8C5511',
        }
      },
    },
  },
  plugins: [],
}