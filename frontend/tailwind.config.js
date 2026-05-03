/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif:   ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:    ['"Outfit"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      colors: {
        // Accent – keep hex so opacity modifiers work via direct Tailwind calc
        accent: {
          DEFAULT: '#C0392B',
          light:   '#E74C3C',
          dark:    '#96281B',
        },
        gold: {
          DEFAULT: '#E8A000',
          light:   '#F5C842',
        },
        // Semantic tokens — linked to CSS variables (RGB channel format)
        // This lets `bg-bg/80`, `text-ink/60` etc. work correctly.
        bg: {
          DEFAULT: 'rgb(var(--rgb-bg) / <alpha-value>)',
          warm:    'rgb(var(--rgb-bg-warm) / <alpha-value>)',
        },
        surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
        border: {
          DEFAULT: 'rgb(var(--rgb-border) / <alpha-value>)',
          strong:  'rgb(var(--rgb-border-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--rgb-text) / <alpha-value>)',
          muted:   'rgb(var(--rgb-text-muted) / <alpha-value>)',
          faint:   'rgb(var(--rgb-text-faint) / <alpha-value>)',
        },
        // League badge colours (non-themeable — always bold)
        c9:   '#7C3AED',
        l985: '#1D4ED8',
        l211: '#0369A1',
        hk:   '#047857',
        us:   '#B45309',
        uk:   '#9F1239',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08)',
        accent:      '0 4px 24px rgba(192,57,43,0.2)',
      },
    },
  },
  plugins: [],
}
