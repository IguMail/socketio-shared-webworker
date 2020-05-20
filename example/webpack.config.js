const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

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
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/shared-worker.js',
          to: 'dist/shared-worker-inline.js'
        }
      ],
    }),
  ],
  module: {
    noParse: /\/dist\/.*/,
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components|dist)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}