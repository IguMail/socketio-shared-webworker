const path = require('path');
const webpack = require('webpack');
const http = require('http')
const express = require('express');
const config = require('./webpack.config');
const favicon = require('serve-favicon');

const compiler = webpack(config);
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const debug = require('debug')

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static('./example/public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

connectedSockets = 0;
 
io.on('connection',  socket => {
    connectedSockets++;
    debug("Socket connected! Conected sockets:", connectedSockets);
 
    socket.on('disconnect',  () => {
        connectedSockets--;
        debug("Socket disconnect! Conected sockets:", connectedSockets);
    });

    socket.on('message',  data => {
        debug("Received message: ", data);
        io.sockets.emit('message', data) // echo
    });
});

server.listen(3000, err => {
  if (err) {
    return console.error(err);
  } else {
    const { family, address, port } = server.address()
    console.log(`Listening at ${family} http://${address}:${port}`);
  }
})