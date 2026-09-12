/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fdfbf7',   // Adjust hex to your exact cream shade
        charcoal: '#2d2d2d',// Adjust hex to your exact charcoal shade
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Work Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
