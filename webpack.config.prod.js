var path = require('path');
var webpack = require('webpack');

module.exports = {
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
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader?presets[]=es2015,presets[]=stage-0'],
      include: path.join(__dirname)
    }]
  }
}