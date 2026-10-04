/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#050418',
        hull: { DEFAULT: '#2a1a5e', light: '#3d2a7a', edge: '#5b4bb5' },
        brass: { DEFAULT: '#f0a830', light: '#ffd75e', dark: '#b96d1f' },
        foam: '#eaf2ff',
        haze: '#9aa8e0',
        glow: '#4de3e6',
        coral: '#e30050',
        ember: '#e32e01',
        sun: '#fbbe00',
        mint: '#5ce6a5',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        telemetry: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        blob: '1.75rem',
      },
      animation: {
        'rise-in': 'rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        bob: 'bob 4s ease-in-out infinite',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
