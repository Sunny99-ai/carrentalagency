/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        soft: '#f8fafc',
        accent: '#0f766e',
      },
      boxShadow: {
        premium: '0 16px 40px -24px rgba(15, 23, 42, 0.35)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
