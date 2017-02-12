'use strict'

var ws = wio('http://localhost:8000/')
ws.setWorker('shared-worker.js')

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

if (typeof module !== 'undefined') {
    if (module.hot) {
        module.hot.accept()
    }
}