import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  '#fdf8f0',
          100: '#f9edda',
          200: '#f2d9b0',
          300: '#e8c07a',
          400: '#dda049',
          500: '#c8862e',
          600: '#a86a22',
          700: '#87501e',
          800: '#6e401e',
          900: '#5a351c',
        },
        ink: {
          DEFAULT: '#2c1d0e',
          light: '#4a3020',
          fade: '#7a5c40',
        },
        mystic: {
          100: '#ede8f5',
          300: '#c3b4e8',
          500: '#8b6fc4',
          700: '#5c3f99',
          900: '#2e1a5e',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['"IM Fell English"', 'serif'],
      },
      backgroundImage: {
        'card-back': "url('/cards/back.png')",
      },
    },
  },
  plugins: [],
} satisfies Config
