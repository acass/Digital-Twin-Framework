/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05080f',
        panel: 'rgba(10, 20, 35, 0.55)',
        cyan: {
          glow: '#5ec8ff',
          dim: '#2a6a90',
        },
      },
      fontFamily: {
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
