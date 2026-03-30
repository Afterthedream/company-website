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
          50: '#f0f7ff',
          100: '#dfeeff',
          200: '#b8dcfe',
          300: '#79c2fc',
          400: '#3aa5f8',
          500: '#1088e9',
          600: '#046bc7',
          700: '#0555a1',
          800: '#084985',
          900: '#0c3d6e',
          950: '#08274a',
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafb',
          100: '#f0f4f7',
          200: '#e2e8ed',
          300: '#ccd5dc',
          400: '#9baab8',
          500: '#6b7f90',
          600: '#4d5f6e',
          700: '#374554',
          800: '#1f2b36',
          900: '#111820',
          950: '#0a0f14',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'DM Sans', 'system-ui', 'sans-serif'],
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
