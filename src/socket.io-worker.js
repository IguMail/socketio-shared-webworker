'use strict';

const EventEmitter = require('eventemitter3')
const io = require('socket.io-client')
require('../dist/shared-worker-inline.js')

class SharedWorkerSocketIO {

    WorkerType = window.SharedWorker || window.Worker
    worker = null
    workerUri = null
    socketUri = null
    events = new EventEmitter()
    socket = null

    constructor(socketUri) {
        this.log('SharedWorkerSocketIO ', socketUri)
        this.socketUri = socketUri
    }

    startSocketIo() {
        this.socket = io(this.socketUri)
    }

    startWorker() {
        const workerUri = this.getWorkerUri()
        this.log('Starting Worker', this.WorkerType, workerUri)
        this.worker = new this.WorkerType(workerUri, {
            name: this.socketUri
        })
        const port = this.worker.port || this.worker
        port.onmessage = event => {
            this.log('<< worker received message:', event.data.type, event.data.message)
            this.events.emit(event.data.type, event.data.message)
        }
        this.worker.onerror = event => {
            this.log('worker error', event)
            this.events.emit('error', event)
        }
        this.log('worker started')
    }

    emit(event, data, cb) {
        this.log('>> emit:', event, data, cb)
        if (this.worker) {
            // todo: ack cb
            const port = this.worker.port || this.worker
            port.postMessage({
                eventType: 'emit',
                event: event,
                data: data
            })
        } else {
            this.socket.emit(...arguments)
        }
    }

    on(event, cb) {
        if (this.worker) {
            this.log('worker add handler on event:', event)
            const port = this.worker.port || this.worker
            port.postMessage({
                eventType: 'on',
                event: event
            })
            this.events.on(event, cb)
        } else {
            this.log('socket add handler on event:', event)
            this.socket.on(...arguments)
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
            this.worker = null // disable worker
            this.startSocketIo()
        }
    }

    setWorkerType(WorkerType) {
        this.log('Setting WorkerType', WorkerType)
        this.WorkerType = WorkerType
    }

    getWorkerObjectUrl() {
        const script = '(' + SocketIoSharedWorker.toString() + ')()'
        return window.URL.createObjectURL(new Blob([script], {type: 'application/javascript'}))
    }

    getWorkerUri() {
        return this.workerUri || this.getWorkerObjectUrl()
    }

    useWorker(uri) {
        this.log('Starting worker', uri)
        this.workerUri = uri
        if (!this.started) {
            this.start()
        }
    }

    /**
     * @deprecated
     */
    setWorker = this.useWorker

}

SharedWorkerSocketIO.prototype.log = console.log.bind(console)

module.exports = window.wio = uri => new SharedWorkerSocketIO(uri)