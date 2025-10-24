/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        'theme-bg': {
          dark: '#000000',
          light: '#ffffff',
        },
        'theme-text': {
          dark: '#ffffff',
          light: '#000000',
        },
        'theme-border': {
          dark: '#374151',
          light: '#e5e7eb',
        },
        'theme-card': {
          dark: '#1f2937',
          light: '#f9fafb',
        },
      },
    },
  },
  plugins: [],
}

