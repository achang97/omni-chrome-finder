const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
// const ZipPlugin = require('zip-webpack-plugin');

require('dotenv').config({ path: path.join(__dirname, '../env/.prod.env') });

// const targetBrowser = process.env.TARGET_BROWSER;

// const getExtensionFileType = (browser) => {
//   switch (browser) {
//     case 'opera':
//       return 'crx';
//     case 'firefox':
//       return 'xpi';
//     default:
//       return 'zip';
//   }
// };

module.exports = require('./base.config.js')({
  mode: 'production',
  output: 'build',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/)
    // new ZipPlugin({
    //   path: path.join(__dirname, '../build'),
    //   extension: `${getExtensionFileType(targetBrowser)}`,
    //   filename: `${targetBrowser}`
    // })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
});
