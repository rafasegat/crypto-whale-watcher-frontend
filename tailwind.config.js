module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {

    extend: {
      colors: {
        'black': '#3A3838',
        'tacao': '#F49D85',
        'gray': '#707070'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // function ({ addComponents }) {
    //   addComponents({
    //     '.container': {
    //       maxWidth: '100%',
    //       // '@screen sm': {
    //       //   maxWidth: '600px',
    //       // },
    //       '@screen md': {
    //         maxWidth: '930px',
    //       },
    //       '@screen lg': {
    //         maxWidth: '930px',
    //       },
    //       '@screen xl': {
    //         maxWidth: '930px',
    //       },
    //     }
    //   })
    // }
  ]
}
