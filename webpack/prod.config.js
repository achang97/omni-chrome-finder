const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const TerserPlugin = require('terser-webpack-plugin');
const tailwindConfig = require('../tailwind.config');
require('dotenv').config();

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
  entry: {
    background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    inject: [customPath, path.join(__dirname, '../chrome/extension/inject')]
  },
  mode: 'production',
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        HEAP_APP_ID: JSON.stringify(process.env.PROD_HEAP_APP_ID),
        SEGMENT_KEY: JSON.stringify(process.env.PROD_SEGMENT_KEY)
      }
    })
  ],
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['*', '.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [
            /* 'optimize-react' */
          ]
        }
      },
      {
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
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
