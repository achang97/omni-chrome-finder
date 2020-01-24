const colors = require('./app/styles/colors');

const config = {
  important: true,
  theme: {
    extend: {
      colors: colors.colors,
    },
    fontSize: {
      'xs': '12px',
      'sm': '14px',
      'reg': '16px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px',
    },
    spacing: {
      '0': '0px',
      'xs': '4px',
      'sm': '8px',
      'reg': '12px',
      'lg': '16px',
      'xl': '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '48px',
    },
    borderRadius: {
      'none': '0px',
      'sm': '2px',
      'default': '4px',
      'lg': '8px',
      'xl': '16px',
      'full': '9999px',
    }
  },
  variants: {},
  plugins: []
};

module.exports = config;
