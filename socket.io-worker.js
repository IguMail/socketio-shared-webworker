'use strict';

const EventEmitter = require('eventemitter3')
const io = require('socket.io-client')

class SharedWorkerSocketIO {

    workerUri = null
    socketUri = null
    events = new EventEmitter()
    socket = {}

    constructor(socketUri) {
        this.log('SharedWorkerSocketIO ', socketUri)
        this.socketUri = socketUri
    }

    startSocketIo() {
        this.socket = io(this.socketUri)
    }

    startWorker() {
        this.log('Connecting to SharedWorker', this.workerUri)
        this.worker = new window.SharedWorker(this.workerUri)
        this.worker.port.addEventListener('message', function (event) {
            this.log('<< message:', event.data.type, event.data.message)
            events.emit(event.data.type, event.data.message)

        }, false)

        this.worker.onerror = function (event) {
            this.log('this.worker error', event)
            events.emit('error', event)
        }

        this.worker.port.start()
    }

    emit(event, data, cb) {
        this.log('>> emit:', event, data, cb)
        if (this.worker) {
            // todo: ack cb
            this.worker.port.postMessage({
                eventType: 'emit',
                event: event,
                data: data
            })
        } else {
            this.socket.emit.apply(this, arguments)
        }
    }

    on(event, cb) {
        this.log('on event', event)
        if (this.worker) {
            this.worker.port.postMessage({
                eventType: 'on',
                event: event
            })
            this.events.on(event, cb)
        } else {
            this.socket.on.apply(this, arguments)
        }
    }

    start() {
        this.started = true
        try {
            this.log('Attempting to start socket.io shared webworker')
            this.startWorker()
        } catch (e) {
            this.log('Error starting socket.io shared webwoker', e)
            this.log('Starting socket.io instead')
            this.startSocketIo()
        }
    }

    setWorker(uri) {
        this.workerUri = uri
        if (!this.started) {
            this.start()
        }
    }

}

SharedWorkerSocketIO.prototype.log = console.log.bind(console)

module.exports = window.wio = uri => new SharedWorkerSocketIO(uri)