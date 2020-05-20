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
        this.worker = new window.SharedWorker(this.workerUri, this.socketUri)
        this.worker.port.addEventListener('message', event => {
            this.log('<< worker received message:', event.data.type, event.data.message)
            this.events.emit(event.data.type, event.data.message)
        }, false)

        this.worker.onerror = event => {
            this.log('worker error', event)
            this.events.emit('error', event)
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
        if (this.worker) {
            this.log('worker add handler on event:', event)
            this.worker.port.postMessage({
                eventType: 'on',
                event: event
            })
            this.events.on(event, cb)
        } else {
            this.log('socket add handler on event:', event)
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
        this.log('Setting worker', uri)
        this.workerUri = uri
        if (!this.started) {
            this.start()
        }
    }

}

SharedWorkerSocketIO.prototype.log = console.log.bind(console)

module.exports = window.wio = uri => new SharedWorkerSocketIO(uri)