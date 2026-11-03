import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2044',
          sidebar: '#0F2044',
          dark: '#0A152E',
          light: '#1B3160',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        teal: {
          DEFAULT: '#0D9488',
          dark: '#0B7662',
          light: '#E2F4EF',
        },
        danger: {
          DEFAULT: '#EF4444',
          dark: '#B3261E',
          light: '#FDE8E6',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#8A5A00',
          light: '#FFF3D6',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

