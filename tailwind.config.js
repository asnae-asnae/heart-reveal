/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          deep: '#ff2d7b',
          soft: '#ff6ba0',
        },
      },
    },
  },
  plugins: [],
}
