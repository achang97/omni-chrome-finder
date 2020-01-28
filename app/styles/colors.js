
/**
 * add colors as string keys. ex: purple-light
 * if we add them as objects they override default palette
 * if still want to add objects then import defaultTheme from tailwind and add its colors also
 * ex: purple: {...defaultTheme.colors.purple, light: '#bcc9f826'}
 */

exports.colors = {
  // purple
  'purple-xlight': '#bcc9f826',
  'purple-light': '#F5F7FE',
  'purple-reg': '#7a7daf',
  'purple-dark': '#5453af',
  'purple-grey': '#777BAD1A',
  'purple-grey-50': '#777BAD80',

  //grey
  'grey-light': '#211A1D40',

  //green
  'green-xlight': '#E3F2EB',
  'green-reg': '#20B56A'
};
