
const assert = require('assert')
const wio = require('../src/socket.io-worker')

const hello = 'Hi There!'

describe('socket.io-worker', () => {

  /**
   * @note Jest tests will only use socket.io since webworkers is unavaible in Node.js
   */
  it('Creates socket.io-worker', done => {

    const ws = wio('http://localhost:3000/')
    ws.start()
    ws.on('connect', function() {
        ws.emit('message', hello)
    })

    ws.on('message', event => {
        assert(event === hello)
        if (ws.socket) ws.socket.close() // @todo fix
        done()
    })
  })
})