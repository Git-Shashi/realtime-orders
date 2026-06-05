/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1e1e1e',
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#888888',
          muted: '#555555',
        },
        border: '#2a2a2a',
        accent: {
          pending: '#f59e0b',
          shipped: '#22c55e',
          delivered: '#3b82f6',
          delete: '#ef4444',
          new: '#a855f7',
        },
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
      },
      keyframes: {
        'flash-insert': {
          '0%': { borderLeftColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' },
          '100%': { borderLeftColor: 'transparent', backgroundColor: 'transparent' },
        },
        'flash-update': {
          '0%': { borderLeftColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)' },
          '100%': { borderLeftColor: 'transparent', backgroundColor: 'transparent' },
        },
        'flash-delete': {
          '0%': { borderLeftColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', opacity: 1 },
          '70%': { opacity: 0.3 },
          '100%': { borderLeftColor: 'transparent', opacity: 0 },
        },
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(-4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: 0, transform: 'translateX(-8px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'flash-insert': 'flash-insert 0.6s ease-out forwards',
        'flash-update': 'flash-update 0.6s ease-out forwards',
        'flash-delete': 'flash-delete 0.9s ease-out forwards',
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-in': 'slide-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
