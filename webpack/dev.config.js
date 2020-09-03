const path = require('path');
const webpack = require('webpack');
const ExtensionReloader = require('webpack-extension-reloader');

require('dotenv').config({ path: path.join(__dirname, '../env/.dev.env') });

module.exports = require('./base.config.js')({
  mode: 'development',
  output: 'dev',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new ExtensionReloader({
      reloadPage: true,
      entries: {
        // The entries used for the content/background scripts or extension pages
        background: 'background',
        contentScript: 'inject'
      }
    })
  ]
});
