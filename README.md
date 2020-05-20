
# Socket.io inside a shared WebWorker

Running Socket.io in a shared webworker allows you to share a single Socket.io websocket connection for multiple browser windows and tabs. A drop in replacement for the socket.io client. 

https://socket.io/
https://github.com/socketio/socket.io-client

##  Quick Install

```
npm i --save socketio-shared-webworker
```

## Reason

* It's more efficient to have a single websocket connection
* Page refreshes and new tabs already have a websocket connection, so connection setup time is zero
* The websocket connection runs in a separate thread/process so your UI is 'faster'
* Cordination of event notifications is simpler as updates have a single source
* Can be extended as a basis for IPC between your browser windows/tabs
* It's the cool stuff..

## Current Support

The aim is to support all methods from Socket.io client API. 
https://github.com/socketio/socket.io-client/blob/master/docs/API.md

All events to/from socket.io will be forwarded by the webworker. 

Subscribe to events `io.on('event', fn)` is a local for each tab/window

Emit any event/obj `io.emit('event', {data: 'blalba'})`. Missing acknowledgement callback param atm. 

Connect and disconnect `io.emit('connect', fn)` is broadcasted to all tabs/windows

Connection Manager `io.Manager` is not yet supported

```js
var ws = wio('http://localhost:8000/')
ws.useWorker('shared-worker.js')

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

## Install

Install locally using npm. (Alternatively clone the repo and look at `index.html` as an example)

```sh
npm install --save socketio-shared-webworker
```

To use in your nodejs project:

First make sure `node_modules/socketio-shared-webworker/dist/shared-worker.js` is served by your server. 
As an example see `server.js` for an example `express` and `socket.io` server serving `dist/shared-worker.js` as `shared-worker.js` via `express.static`.

You can also copy `dist/shared-worker.js` into your `public/` directory and serve that with `app.use(express.static('./public'))`.

```js
var wio = require('socketio-shared-webworker')
var ws = wio('http://localhost:8000/')
ws.useWorker('node_modules/socketio-shared-webworker/dist/shared-worker.js') // or just shared-worker.js if placed in public/
ws.on('connect', () => {
    console.log('connected!')
    ws.emit('message', 'Hi There!')
})
ws.on('message', data => console.log('received message', data))
ws.on('disconnect', () => console.log('disconnected!'))
ws.on('error', data => console.log('error', data))
```

Or to use in HTML `wio` is global.

```html
<script src="socket.io-worker.js"></script>
<script>
var ws = wio('http://localhost:8000/')
ws.useWorker('node_modules/socketio-shared-webworker/dist/shared-worker.js')
// use wio like io
</script>

```

Note: `ws.useWorker('node_modules/socketio-shared-webworker/shared-worker.js')` should point to the shared-worker.js url relative to your HTML page base URL. Shared webworkers can only be loaded from the same domain like CORS. 

See `index.html` for an example. 

### Using a Worker instead of SharedWorker

By default the library will use `Worker` when `SharedWorker` is not available. 
If you want to specify using `Worker` specifically then use: 

```js
var wio = require('socketio-shared-webworker')
var ws = wio('http://localhost:8000/')
ws.setWorkerType(Worker)
ws.useWorker('node_modules/socketio-shared-webworker/dist/shared-worker.js')
```

At the moment only `SharedWorker` and `Worker` are supported. `ServiceWorker` is not. 

### To develop:

```bash
git clone https://github.com/IguMail/socketio-shared-webworker
cd socketio-shared-webworker
npm install
# Start development server with HMR
npm run dev
``` 

In chrome visit the URL: chrome://inspect/#workers so see shared webworkers and inspect, debug.
Visit the `index.html` in the browser for the demo. 

### Production build

```bash
npm run build
```

The builds will be placed in `build/` directory. Copy these to your `public/` directory in your server. 

To start the http and socket.io server to test the build

```bash
npm start
``` 


### Based heavily on

Thanks to.

https://gonzalo123.com/2014/12/01/enclosing-socket-io-websocket-connection-inside-a-html5-sharedworker/

https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

https://www.sitepoint.com/javascript-shared-web-workers-html5/
