var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    "socket.io": [
      // error this not defined in worker scope
      // maybe babel is adding it or socket.io is referencing window
      './node_modules/socket.io-client/dist/socket.io.js' 
    ],
    "socket.io-worker": [
      './src/socket.io-worker.js'
    ],
    "shared-worker": [
      './src/shared-worker.js'
    ],
    "example.app": [
      'webpack-hot-middleware/client',
      './example/app.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
    globalObject: 'this' // https://github.com/webpack/webpack/issues/6642
  },
  devServer: {
    hot: true,
    historyApiFallback: {
      index: '/public/index.html'
    }
  }, 
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
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