const path = require('path');
const webpack = require('webpack');
const ExtensionReloader = require('webpack-extension-reloader');

const host = 'localhost';
const port = 3000;

require('dotenv').config({ path: path.join(__dirname, '../env/.dev.env') });

module.exports = require('./base.config.js')({
  mode: 'development',
  output: 'dev',
  devtool: 'eval-cheap-module-source-map',
  devMiddleware: {
    publicPath: `http://${host}:${port}/js`,
    stats: {
      colors: true
    },
    noInfo: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  hotMiddleware: {
    path: '/js/__webpack_hmr'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new ExtensionReloader({
      reloadPage: true,
      entries: {
        // The entries used for the content/background scripts or extension pages
        background: 'background',
        contentScript: 'inject'
      }
    }),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port
    })
  ]
});
