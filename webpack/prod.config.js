const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

require('dotenv').config({ path: path.join(__dirname, '../env/.prod.env') });

module.exports = require('./base.config.js')({
  mode: 'production',
  output: 'build',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/)
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
});
