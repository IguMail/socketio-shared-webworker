const path = require('path');
const http = require('http')
const express = require('express');
const favicon = require('serve-favicon');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const debug = require('debug')

app.use(express.static('./public'))
app.use(express.static('./dist'))
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

server.listen(8000, err => {
  if (err) {
    return console.error(err);
  } else {
    const { family, address, port } = server.address()
    console.log(`Listening at ${family} http://${address}:${port}`);
  }
})