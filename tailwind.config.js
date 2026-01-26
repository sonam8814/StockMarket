/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-900': '#050505',
        'gray-800': '#141414',
        'gray-700': '#212328',
        'gray-600': '#30333A',
        'gray-500': '#9095A1',
        'gray-400': '#CCDADC',
        'blue-600': '#5862FF',
        'yellow-400': '#FDD458',
        'yellow-500': '#E8BA40',
        'teal-400': '#0FEDBE',
        'red-500': '#FF495B',
        'orange-500': '#FF8243',
        'purple-500': '#D13BFF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
};
