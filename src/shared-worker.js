'use strict';

const log = console.log.bind(console)

log('Loading shared worker', self.name)

const io = require('socket.io-client')

var socket = io(self.name),
    ports = [],
    socketConnected = false

// handle shared webworker clients already with ports
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

// shared worker handle new clients
addEventListener('connect', function(event) {
    var port = event.ports[0]
    ports.push(port)
    port.start()

    log('client connected to shared worker', event)

    port.addEventListener('message', event => handleMessage(event, port))
})

// regular worker handle messages
addEventListener('message', event => handleMessage(event, self))
if (typeof Worker !== 'undefined') {
    setTimeout(() => postMessage({
        type: 'connect',
        message: null
    }))
}

// handle messages
function handleMessage(event, port) {
        
    var model = event.data
    log('port received message', model.eventType, model.event, model.data)
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
                log('socket received message', msg)
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

}

if (typeof module === 'object') module.exports = socket