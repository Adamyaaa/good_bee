/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#FAF7F2',
          cream: '#F4ECE1',
          sand: '#E8DDCF',
          gold: {
            DEFAULT: '#C5A880',
            light: '#EADBC8',
            dark: '#9F8055',
            rich: '#B59363'
          },
          charcoal: {
            DEFAULT: '#1A1918',
            soft: '#2D2B29',
            muted: '#635F59'
          },
          sage: '#586959',
          border: 'rgba(197, 168, 128, 0.25)'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(26, 25, 24, 0.07)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.25)'
      }
    },
  },
  plugins: [],
}
