/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
