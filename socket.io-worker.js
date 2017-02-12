'use strict';

const EventEmitter = require('eventemitter3')
const io = require('socket.io-client')

let uri, workerUri, events, worker, socket = {}

events = new EventEmitter

function startWorker() {
    console.log('Connecting to SharedWorker', workerUri, uri)
    worker = new SharedWorker(workerUri, uri)
    worker.port.addEventListener('message', function (event) {
        console.log('<< message:', event.data.type, event.data.message)
        events.emit(event.data.type, event.data.message)

    }, false)

    worker.onerror = function (event) {
        console.log('worker error', event)
        events.emit('error', event)
    }

    worker.port.start()
}
 
function startSocketIo() {
    socket = io(uri)
}

class SharedWorkerSocketIO 
{

    constructor(socketUri) {
        console.log('SharedWorkerSocketIO ', socketUri)
        uri = socketUri
    }

    emit(event, data, cb) {
        console.log('>> emit:', event, data, cb)
        if (worker) {
            // todo: ack cb
            worker.port.postMessage({eventType: 'emit', event: event, data: data})
        } else {
            socket.emit.apply(this, arguments)
        }
    }

    on(event, cb) {
        console.log('on', event)
        if (worker) {
            worker.port.postMessage({eventType: 'on', event: event})
            events.on(event, cb)
        } else {
            socket.on.apply(this, arguments)
        }
    }

    start() {
        this.started = true
        try {
            startWorker()
        } catch(e) {
            console.log('Could not start shared webwoker', e)
            startSocketIo()
        }
    }

    setWorker(uri) {
        workerUri = uri
        if (!this.started) {
            this.start()
        }
    }

}

module.exports = window.wio = function(uri) {
    console.log('wio', uri)
    return new SharedWorkerSocketIO(uri)
}