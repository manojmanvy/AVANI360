/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep Muted Sage-Slate & Earthy Charcoal (replaces cold blues)
        navy: {
          50: '#f4f6f4',
          100: '#e5eae4',
          200: '#cbd5ca',
          300: '#a7b8a5',
          400: '#7f947d',
          500: '#5f735d',
          600: '#4a5b48',
          700: '#384637',
          800: '#273226',
          900: '#1a2219',
          950: '#101510',
        },
        // Muted Sage Grey scale
        sage: {
          50: '#f4f6f3',
          100: '#e6ece4',
          200: '#cfdbcc',
          300: '#aec0aa',
          400: '#8ca187',
          500: '#6d8368',
          600: '#546850',
          700: '#435240',
          800: '#354133',
          900: '#252e23',
          950: '#131912',
        },
        // Warm Cream Beige scale
        cream: '#faf6ef',
        beige: {
          50: '#fcfbf8',
          100: '#f7f3ea',
          200: '#ede4d3',
          300: '#ded0b8',
          400: '#cbb695',
          500: '#b59a72',
          600: '#9b7e56',
          700: '#7d6343',
          800: '#5f4b33',
          900: '#423424',
        },
        // Vibrant Signature Green (Emerald / Leaf)
        leaf: {
          50: '#eefbf4',
          100: '#d6f5e3',
          200: '#aeeacb',
          300: '#79d8ac',
          400: '#43bf8b',
          500: '#1fa572',
          600: '#118a5e',
          700: '#0d6f4d',
          800: '#0d583f',
          900: '#0b4936',
          950: '#052a20',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(35, 45, 33, 0.12)',
        card: '0 20px 45px -24px rgba(35, 45, 33, 0.18)',
        float: '0 28px 60px -20px rgba(35, 45, 33, 0.25)',
        glow: '0 0 45px -12px rgba(31, 165, 114, 0.55)',
        'glow-warm': '0 0 45px -14px rgba(181, 154, 114, 0.5)',
        ring: '0 0 0 1px rgba(120, 138, 116, 0.14), 0 18px 40px -28px rgba(35, 45, 33, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0.4' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-up': 'scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.2s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
