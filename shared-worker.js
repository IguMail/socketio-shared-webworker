'use strict';

const log = (...args) => {
    console.log(...args)
}

log('Loading shared worker')

// try each possible socket.io location
try {
    importScripts('node_modules/socket.io-client/dist/socket.io.js')
} catch(e) {
    try {
        importScripts('/node_modules/socket.io-client/dist/socket.io.js')
    } catch(e) {
        importScripts('../../node_modules/socket.io-client/dist/socket.io.js')
    }
}

var socket = io(self.name),
    ports = [],
    socketConnected = false

// handle webworker clients already with ports
socket.on('connect', function(msg) {
    socketConnected = true
    ports.forEach(function(port) {
        port.postMessage({
            type: 'connect',
            message: msg
        })
    })
})
socket.on('disconnect', function(msg) {
    socketConnected = false
    ports.forEach(function(port) {
        port.postMessage({
            type: 'disconnect',
            message: msg
        })
    })
})

// handle new clients
addEventListener('connect', function(event) {
    var port = event.ports[0]
    ports.push(port)
    port.start()

    log('client connected to worker', event)

    port.addEventListener('message', function(event) {
        
        var model = event.data
        log('received message', model.eventType, model.event, model.data)
        switch(model.eventType) {
            case 'on':
                const eventName = model.event
                if (eventName == 'connect') {
                    if (socketConnected) {
                        port.postMessage({
                            type: eventName
                        })
                    }
                    break;
                }
                if (eventName == 'disconnect') {
                    break;
                }
                socket.on(eventName, function(msg) {
                    port.postMessage({
                        type: eventName,
                        message: msg
                    })
                })
            break;
            case 'emit':
                socket.emit(model.event, model.data) // todo: ack cb
            break;
        }
 
    })
})

module.exports = socket