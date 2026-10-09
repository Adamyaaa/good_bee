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
        serif: ['"Marcellus"', '"Bodoni Moda"', 'Georgia', 'serif'],
        editorial: ['"Bodoni Moda"', '"Marcellus"', 'serif'],
        sans: ['"Tenor Sans"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        'luxury': '0.22em',
        'subtle': '0.08em',
        'headline': '-0.02em'
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(26, 25, 24, 0.07)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.25)'
      }
    },
  },
  plugins: [],
}
