const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: __dirname + '/build',
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('/gifts'),
      API_URL: JSON.stringify('https://wwwdev.ebi.ac.uk/gifts/api'),
      AUTH_CALLBACK_URL: JSON.stringify('http://localhost:39093/login'),
      READ_ONLY: JSON.stringify((process.argv.indexOf('--READ_ONLY') > -1) || false)
    }),
    new HtmlWebPackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html'
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3100,
      open: false,
      ui: false
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    host: 'localhost',
    port: 39093,
    historyApiFallback: true,
    openPage: 'gifts/'
  }
});
