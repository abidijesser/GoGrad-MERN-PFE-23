module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: null, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        mygreen: '#1ccaad',
        mygreen2: '#2aa792'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
