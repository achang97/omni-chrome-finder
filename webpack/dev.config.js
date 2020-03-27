const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const tailwindConfig = require('../tailwind.config');

const host = 'localhost';
const port = 3000;
const customPath = path.join(__dirname, './customPublicPath');
const hotScript = 'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';
require('dotenv').config();

const baseDevConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  entry: {
    background: [customPath, hotScript, path.join(__dirname, '../chrome/extension/background')],
  },
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
  mode: 'development',
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        plugins: ['react-hot-loader/babel']
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [tailwindcss(tailwindConfig), autoprefixer]
          }
        }
      ]
    }, {
      test: /\.css$/,
      include: /node_modules/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true, // webpack@1.x
            disable: true, // webpack@2.x and newer
          },
        },
      ],
    }]
  }
});

const injectPageConfig = baseDevConfig();
injectPageConfig.entry = [
  customPath,
  path.join(__dirname, '../chrome/extension/inject')
];
delete injectPageConfig.hotMiddleware;
delete injectPageConfig.module.rules[0].options;
injectPageConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectPageConfig.output = {
  path: path.join(__dirname, '../dev/js'),
  filename: 'inject.bundle.js',
};
const appConfig = baseDevConfig();

module.exports = [
  injectPageConfig,
  appConfig
];
