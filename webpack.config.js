var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './socket.io-worker.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'socket.io-worker.bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader?presets[]=es2015,presets[]=stage-0'],
      include: path.join(__dirname)
    }]
  }
}