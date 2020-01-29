const customColors = require('./app/styles/colors');
const tailwindColors = require('tailwindcss/defaultTheme');

Object.entries(customColors.colors).forEach(([customColorName, customColorPallete]) => {
  customColors.colors[customColorName] = { ...tailwindColors.colors[customColorName], ...customColorPallete };
})

const config = {
  important: true,
  theme: {
    extend: {
      colors: customColors.colors,
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
  plugins: [
    function({ addUtilities, theme, config }) {

      let newUtilities      = {};
      const boxShadowPrefix = '0 0 0 3px';
      const colors          = theme('colors');
      Object.keys( colors ).forEach(color => {

        const colorData = colors[color];
        if(typeof colorData === 'string') {
          newUtilities[`.outline-${color}`] = {
            boxShadow: `${boxShadowPrefix} ${colorData}`,
          }
        }
        else {
          Object.keys(colorData).forEach(colorVariation => {
            newUtilities[`.outline-${color}-${colorVariation}`] = {
              boxShadow: `${boxShadowPrefix} ${colorData[colorVariation]}`,
            }
          });
        }
      });
      addUtilities(newUtilities);
    }
  ]
};

module.exports = config;
