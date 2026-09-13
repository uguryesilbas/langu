/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1565C0',
        secondary: '#E65100',
        background: '#F5F7FA',
        card: '#FFFFFF',
        text: '#1A1A2E',
        muted: '#555555',
        success: '#2E7D32',
        border: '#E0E0E0',
      },
    },
  },
  plugins: [],
};
