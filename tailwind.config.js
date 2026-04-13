/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(0.97 0.012 250)',
          100: 'oklch(0.93 0.032 250)',
          200: 'oklch(0.87 0.058 250)',
          300: 'oklch(0.77 0.10 250)',
          400: 'oklch(0.68 0.14 250)',
          500: 'oklch(0.58 0.16 250)',
          600: 'oklch(0.50 0.15 250)',
          700: 'oklch(0.42 0.13 250)',
          800: 'oklch(0.35 0.10 250)',
          900: 'oklch(0.28 0.08 250)',
          950: 'oklch(0.18 0.05 250)',
        },
        accent: {
          50: 'oklch(0.97 0.015 190)',
          100: 'oklch(0.93 0.04 190)',
          200: 'oklch(0.87 0.07 190)',
          300: 'oklch(0.78 0.10 190)',
          400: 'oklch(0.70 0.12 190)',
          500: 'oklch(0.60 0.13 190)',
          600: 'oklch(0.52 0.12 190)',
        },
        warm: {
          50: 'oklch(0.98 0.02 85)',
          100: 'oklch(0.95 0.05 85)',
          200: 'oklch(0.90 0.09 85)',
          300: 'oklch(0.84 0.12 85)',
          400: 'oklch(0.78 0.14 85)',
          500: 'oklch(0.72 0.15 85)',
        },
        error: {
          50: 'oklch(0.97 0.03 25)',
          100: 'oklch(0.93 0.06 25)',
          200: 'oklch(0.88 0.10 25)',
          400: 'oklch(0.70 0.18 25)',
          500: 'oklch(0.60 0.20 25)',
          600: 'oklch(0.50 0.18 25)',
        },
        surface: {
          0: 'oklch(1 0 0)',
          50: 'oklch(0.98 0.003 250)',
          100: 'oklch(0.96 0.005 250)',
          200: 'oklch(0.92 0.008 250)',
          300: 'oklch(0.86 0.010 250)',
          400: 'oklch(0.71 0.012 250)',
          500: 'oklch(0.56 0.014 250)',
          600: 'oklch(0.45 0.015 250)',
          700: 'oklch(0.36 0.014 250)',
          800: 'oklch(0.26 0.012 250)',
          900: 'oklch(0.17 0.010 250)',
          950: 'oklch(0.11 0.008 250)',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'Sora', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float-slow 8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slide-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ripple': 'ripple 4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin 25s linear infinite reverse',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.02)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
