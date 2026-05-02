/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#C0392B',
          light: '#E74C3C',
          dark: '#96281B',
        },
        gold: {
          DEFAULT: '#E8A000',
          light: '#F5C842',
        },
        bg: {
          DEFAULT: '#F8F7F4',
          warm: '#F0EDE7',
        },
        surface: '#FFFFFF',
        border: {
          DEFAULT: '#E2DFD9',
          strong: '#C8C4BC',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#6B6B6B',
          faint: '#9B9B9B',
        },
        c9: '#7C3AED',
        l985: '#1D4ED8',
        l211: '#0369A1',
        hk: '#047857',
        us: '#B45309',
        uk: '#9F1239',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08)',
        accent: '0 4px 24px rgba(192,57,43,0.2)',
      },
    },
  },
  plugins: [],
}
