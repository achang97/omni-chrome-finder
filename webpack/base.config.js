const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const WextManifestWebpackPlugin = require('wext-manifest-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const tailwindcss = require('tailwindcss');
const tailwindConfig = require('../tailwind.config');

const customPath = path.join(__dirname, './customPublicPath');
const sourcePath = path.join(__dirname, '../extension');

const targetBrowser = process.env.TARGET_BROWSER;

module.exports = ({ mode, output, plugins, ...options }) => {
  const destPath = path.join(__dirname, '..', output, targetBrowser);

  return {
    mode,
    output: {
      path: path.join(destPath),
      filename: 'js/[name].bundle.js'
    },
    entry: {
      manifest: path.join(sourcePath, `manifest.${mode}.json`),
      background: [customPath, path.join(sourcePath, 'scripts/background')],
      inject: [customPath, path.join(sourcePath, 'scripts/inject')]
    },
    resolve: {
      modules: ['app', 'node_modules'],
      extensions: ['*', '.js', '.jsx', '.json'],
      alias: {
        'webextension-polyfill': path.resolve(
          path.join(__dirname, '../node_modules', 'webextension-polyfill')
        )
      }
    },
    module: {
      rules: [
        {
          type: 'javascript/auto', // prevent webpack handling json with its own loaders,
          test: /manifest\.(development|production)\.json$/,
          use: {
            loader: 'wext-manifest-loader',
            options: {
              usePackageJSONVersion: false
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.(js|ts)x?$/,
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
            {
              loader: 'file-loader',
              options: {
                outputPath: 'public/img'
              }
            },
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
      // Plugin to not generate js bundle for manifest entry
      new WextManifestWebpackPlugin(),
      // Define env variables
      new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER', 'SEGMENT_KEY', 'FROALA_KEY']),
      // Copy static assets
      new CopyWebpackPlugin([
        {
          from: path.join(sourcePath, 'assets'),
          to: path.join(destPath, 'assets')
        }
      ]),
      // Remove  manifest.bundle.js file
      new RemovePlugin({
        after: {
          include: [path.join(destPath, 'js/manifest.bundle.js')]
        }
      })
    ],
    ...options
  };
};
