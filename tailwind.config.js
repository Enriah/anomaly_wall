/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060608',
          900: '#0a0a0f',
          850: '#101017',
          800: '#161622',
          700: '#222234',
        },
        art: {
          purple: '#a855f7',
          violet: '#8b5cf6',
          coral: '#f43f5e',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          emerald: '#10b981',
          gold: '#eab308'
        }
      },
      fontFamily: {
        serif: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        mono: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(30px)' },
        }
      }
    },
  },
  plugins: [],
}
