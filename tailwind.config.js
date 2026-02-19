module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#0a0a0f',
          card: '#12121a',
          cardHover: '#16161f',
          border: '#1f1f2e',
          borderHover: '#2e2e45',
          accent: '#5b6ef5',
          accentHover: '#4a5ce8',
          accentGlow: 'rgba(91,110,245,0.15)',
        },
      },
    },
  },
  plugins: [],
}
