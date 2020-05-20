'use strict'

const wio = require('../src/socket.io-worker')

const ws = wio('http://localhost:3000/')
//const workerType = confirm('Use SharedWorker? (Will use Worker if no)') ? SharedWorker : Worker
//ws.setWorkerType(workerType)
ws.start()
console.log('connecting...')

ws.on('connect', function() {
    console.log('connected!')
    ws.emit('message', 'Hi There!')
})

ws.on('message', function (data) {
    console.log('message', data)
})

ws.on('disconnect', function() {
    console.log('disconnected!')
})

ws.on('error', function (data) {
    console.log('error', data)
})

setTimeout(() =>  ws.emit('message', 'Hello!'), 1000)

if (typeof module !== 'undefined') {
    if (module.hot) {
        module.hot.accept()
    }
}