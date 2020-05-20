const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  mode: 'production',
  devtool: 'source-map',
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
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'src', 'shared-worker.js'),
          to: path.resolve(__dirname, 'dist', 'shared-worker-inline.js')
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