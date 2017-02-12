
**Socket.io inside a shared WebWorker**

Running Socket.io in a shared webworker allows you to share a single Socket.io websocket connection for multiple browser windows and tabs. A drop in replacement for the socket.io client. 

https://socket.io/
https://github.com/socketio/socket.io-client

**Quick Install**

`npm i --save 
`<script src="dist/socket.io-worker.bundle.js"></script>`

**Reason**

* It's more efficient to have a single websocket connection
* The websocket connection runs in a separate thread/process so your UI is 'faster'
* Cordination of event notifications is simpler as updates have a single source
* Can be extended as a basis for IPC between your browser windows/tabs
* It's the cool stuff..

**Current Support**

The aim is to support all methods from Socket.io client API. 
https://github.com/socketio/socket.io-client/blob/master/docs/API.md

All events to/from socket.io will be forwarded by the webworker. 

Subscribe to events `io.on('event', fn)` is a local for each tab/window

Emit any event/obj `io.emit('event', {data: 'blalba'})`. Missing acknowledgement callback param atm. 

Connect and disconnect `io.emit('connect', fn)` is broadcasted to all tabs/windows

Connection Manager `io.Manager` is not yet supported

```
var ws = wio('http://localhost:8000/')
ws.setWorker('shared-worker.js')

ws.on('connect', function() {
    console.log('connected!')
    
    ws.on('message', function (data) {
        console.log('message', data)
    })

    ws.emit('message', 'Hi There!')
})

ws.on('disconnect', function() {
    console.log('disconnected!')
})

ws.on('error', function (data) {
    console.log('error', data)
})

```

**Install**

Install locally using npm. (Alternatively clone the repo and look at `index.html` as an example)

`npm install --save socketio-shared-webworker`

To use in your nodejs based project:

```
var wio = require('socketio-shared-webworker')
var ws = wio('http://localhost:8000/')
ws.setWorker('node_modules/socketio-shared-webworker/shared-worker.js')

```

Use in HTML `wio` is global.

```
<script src="dist/socket.io-worker.bundle.js"></script>
<script>
var ws = wio('http://localhost:8000/')
ws.setWorker('node_modules/socketio-shared-webworker/shared-worker.js')
// use wio like io
</script>

```

See `index.html` for an example. 

To develop:

`$ git clone https://github.com/IguMail/socketio-shared-webworker`

`$ npm install`

`$ npm start` Starts the socket.io server

`$ npm run dev` Starts development server with HMR

In chrome visit the URL: chrome://inspect/#workers so see shared webworkers and inspect, debug.
Visit the `index.html` in the browser for the demo. 

Production build

`$ npm run build`


***Based heavily on**

Thanks to.

https://gonzalo123.com/2014/12/01/enclosing-socket-io-websocket-connection-inside-a-html5-sharedworker/

https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

https://www.sitepoint.com/javascript-shared-web-workers-html5/
