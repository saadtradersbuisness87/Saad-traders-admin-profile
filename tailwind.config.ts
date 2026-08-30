import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e3a5f',
          light: '#2d5586',
          dark: '#152a45',
        },
      },
    },
  },
  plugins: [],
}
export default config
