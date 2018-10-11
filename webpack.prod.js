// This is used to build all remote dev/prod/fallback instances.

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: __dirname + '/build',
    filename: '[name].[chunkhash].js',
    publicPath: '/gifts'
  },
  // devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('/gifts'),
      API_URL: JSON.stringify('/gifts/api'),
      AUTH_CALLBACK_URL: JSON.stringify('http://www.ebi.ac.uk/gifts/login'),
      READ_ONLY: JSON.stringify((process.argv.indexOf('--READ_ONLY') > -1) || false)
    }),
    new HtmlWebPackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html'
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        ecma: 6,
        sourceMap: false,
        keep_fnames: false,
        keep_classnames: true,
        ie8: false,
        safari10: false,
        warnings: false,
        compress: {
          passes: 1
        },
        output: {
          beautify: false
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
