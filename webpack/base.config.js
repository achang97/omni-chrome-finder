const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const tailwindcss = require('tailwindcss');
const tailwindConfig = require('../tailwind.config');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = ({ mode, output, plugins, ...options }) => ({
  mode,
  output: {
    path: path.join(__dirname, `../${output}/js`),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  entry: {
    background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    inject: [customPath, path.join(__dirname, '../chrome/extension/inject')]
  },
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules|app\/styles\/overrides/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]'
              }
            }
          },
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
        include: /node_modules|app\/styles\/overrides/,
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
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        SEGMENT_KEY: JSON.stringify(process.env.SEGMENT_KEY),
        FROALA_KEY: JSON.stringify(process.env.FROALA_KEY)
      }
    }),
    ...plugins
  ],
  ...options
});
