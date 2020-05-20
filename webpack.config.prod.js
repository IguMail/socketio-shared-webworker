var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: [
    './socket.io-worker.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'socket.io-worker.bundle.js',
    publicPath: '/dist/'
  },
  plugins: [],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}