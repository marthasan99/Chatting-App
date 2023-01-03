/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'sans': ['Open Sans', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
      colors: {
        'primary': '#11175D',
        'input-box': '#C3C5D7',
        'button': '#570861',//#5F35F5
        'account': '#03014C',
        'sign-up': '#EA6C00',
        'sub': 'rgba(77, 77, 77, 0.75)'
      },
      boxShadow: {
        'search': '0px 4px 4px rgba(0, 0, 0, 0.25);',
        'chat': '5px 5px 10px rgba(0, 0, 0, 0.25);'
      },
      dropShadow: {
        'group': '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
