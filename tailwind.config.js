/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      colors: {
        cream: '#FBF7F1',
        ink: '#1F2A24',
        forest: {
          DEFAULT: '#1F5D4F',
          dark: '#153F35',
          light: '#2E7A68',
        },
        clay: {
          DEFAULT: '#C97B63',
          dark: '#B0604A',
          light: '#E3A791',
        },
        gold: '#D9A441',
        sage: '#CBDAD1',
        line: '#E4DDD0',
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [],
}
