const webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    app: ['@babel/polyfill', __dirname + '/src/ui/index.jsx'],
    vendor: ['@babel/preset-react', 'react-dom', 'simplemde']
  },
  resolve: {
    extensions: [".jsx", ".js"],
    alias: { react: require.resolve("react") }
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }, {
      test: /\.(css|sass|scss)$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "sass-loader" // compiles Sass to CSS
      }]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      FRONTEND_VERSION: JSON.stringify(require("./package.json").version)
    })
  ]
};
