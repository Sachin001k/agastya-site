/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f4',
          100: '#dcebe2',
          200: '#bbd7c8',
          300: '#90bba6',
          400: '#669a82',
          500: '#477e67',
          600: '#356452',
          700: '#2a5043',
          800: '#1a4a2a',
          900: '#0d2318',
          950: '#060f0b',
        },
        solar: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        paper: {
          50:  '#fdfcf8',
          100: '#faf7ee',
          200: '#f3edd9',
          300: '#ebe0bf',
        },
        ink: {
          DEFAULT: '#1a1f1c',
          muted:   '#5a6661',
          soft:    '#8a948f',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans:  ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
