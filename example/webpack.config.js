var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    "socket.io": [
      './node_modules/socket.io-client/dist/socket.io.js'
    ],
    "socket.io-worker": [
      './socket.io-worker.js'
    ],
    "example": [
      'webpack-hot-middleware/client',
      './example/app.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dev.js',
    publicPath: '/dist/'
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