
/**
 * add colors as string keys. ex: purple-light
 * if we add them as objects they override default palette
 * if still want to add objects then import defaultTheme from tailwind and add its colors also
 * ex: purple: {...defaultTheme.colors.purple, light: '#bcc9f826'}
 */

exports.colors = {
  purple: {
    xlight: '#bcc9f826',
    light: '#F5F7FE',
    reg: '#7a7daf',
    dark: '#5453af',
    'gray-10': '#777BAD1A',
    'gray-50': '#777BAD80'
  },
  gray: {
    xlight: '#211A1D0D',
    light: '#211A1D40',
    dark: '#211A1DBF'
  },
  green: {
    xlight: '#E3F2EB',
    reg: '#20B56A'
  }
};
