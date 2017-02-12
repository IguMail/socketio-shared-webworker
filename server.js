var io, connectedSockets;
var port = process.env.PORT || 8000
 
console.log('Starting socket.io on port ', port)
io = require('socket.io').listen(port);
connectedSockets = 0;
 
io.sockets.on('connection', function (socket) {
    connectedSockets++;
    console.log("Socket connected! Conected sockets:", connectedSockets);
 
    socket.on('disconnect', function () {
        connectedSockets--;
        console.log("Socket disconnect! Conected sockets:", connectedSockets);
    });

    socket.on('message', function (data) {
        console.log("Received message: ", data);
        io.sockets.emit('message', data) // echo
    });

});
 
setInterval(function() {
    io.emit("message", "Hola! " + new Date().getTime());
}, 10000);