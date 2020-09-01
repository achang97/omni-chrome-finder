const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtensionReloader = require('webpack-extension-reloader');

const tailwindcss = require('tailwindcss');
const tailwindConfig = require('../tailwind.config');

const host = 'localhost';
const port = 3000;

const customPath = path.join(__dirname, './customPublicPath');

require('dotenv').config({ path: path.join(__dirname, '../env/.dev.env') });

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    inject: [customPath, path.join(__dirname, '../chrome/extension/inject')]
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
      __PORT__: port,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        SEGMENT_KEY: JSON.stringify(process.env.SEGMENT_KEY),
        FROALA_KEY: JSON.stringify(process.env.FROALA_KEY)
      }
    })
  ],
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules|app\/styles\/overrides/,
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
  }
};
