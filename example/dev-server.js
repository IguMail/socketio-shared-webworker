var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var favicon = require('serve-favicon');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static('./example/public'))
app.use(express.static('/'))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
})