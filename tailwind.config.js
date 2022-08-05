// default settings can be found here
// https://unpkg.com/browse/tailwindcss@2.2.17/stubs/defaultConfig.stub.js

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'false' or 'class'
  theme: {
  
    colors: {
      'green': "#58F856",
      'yellow': "#F5E766",
      'gray': '#141414',
      'white': '#F9F9F9',
    },
    fontFamily: {
      // sans: ['Graphik', 'sans-serif'],
      // serif: ['Merriweather', 'serif'],
    },
    extend: {
      backgroundImage: {
        'my_bg_image' : "url('/img/landing_userOn.png')",
      },
      backgroundSize: {
        'background-cover':'cover'
      }
      // spacing: {
      //   '128': '32rem',
      //   '144': '36rem',
      // },
      // borderRadius: {
      //   '4xl': '2rem',
      // }
    },
    customForms: theme => ({
      default: {
        checkbox: {
          iconColor: theme('colors.green'),
          '&:hover': {
            iconColor: theme('colors.green'),
          },
          '&:focus': {
            borderColor: theme('colors.white/50'),
      
          }
        },
        radio: {
          icon: '<svg fill="#58F856" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>',
          borderColor: theme('colors.gray'),
        },
      },
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/custom-forms')
  ],
 
};
