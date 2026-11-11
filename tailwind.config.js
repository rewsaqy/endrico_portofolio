/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        p5: {
          red: '#E60012',
          darkred: '#99000B',
          black: '#0D0D0D',
          charcoal: '#1A1A1A',
          cream: '#FFFBEA',
        }
      },
      fontFamily: {
        sans: ['Impact', 'Arial Black', 'system-ui', 'sans-serif'],
        comic: ['Bangers', 'Impact', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
