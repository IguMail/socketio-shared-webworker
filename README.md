
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
ws.start() // use default SharedWorker script URL

// same as socket.io-client api: https://github.com/socketio/socket.io-client
ws.on('connect', () => {
    console.log('connected!')
    ws.emit('message', 'Hi There!')
})
ws.on('message', data => console.log('received message', data))
ws.on('disconnect', () => console.log('disconnected!'))
ws.on('error', data => console.log('error', data))
```

## Install

Install locally using npm. (Alternatively clone the repo and look at `index.html` as an example)

```sh
npm install --save socketio-shared-webworker
```

### To use in your nodejs project:

```js
var wio = require('socketio-shared-webworker')
var ws = wio('http://localhost:8000/')
ws.start() // use default SharedWorker script URL

// same as socket.io-client
ws.on('connect', () => {
    console.log('connected!')
    ws.emit('message', 'Hi There!')
})

ws.on('message', data => console.log('received message', data))
ws.on('disconnect', () => console.log('disconnected!'))
ws.on('error', data => console.log('error', data))
```

### To use in HTML `wio` is global.

```html
<script src="socket.io-worker.js"></script>
<script>
var ws = wio('http://localhost:8000/')
ws.start() // use default SharedWorker script URL

// same as socket.io-client
ws.on('connect', () => {
    console.log('connected!')
    ws.emit('message', 'Hi There!')
})
ws.on('message', data => console.log('received message', data))
ws.on('disconnect', () => console.log('disconnected!'))
ws.on('error', data => console.log('error', data))
</script>
```

## Using a specific `SharedWorker` script

When using `ws.start()` the default worker located in `build/shared-worker-inline.js` is used. This worker is served inline using `URL.createObjectURL()` instead of being served over HTTP. This is limited to `Worker` and `SharedWorker` since `ServiceWorker` requires the same domain. (`ServiceWorker` is not yet supported)

In order to specify the Worker script URL manually use: 

```
ws.useWorker('http/same/domain/url/to/shared-worker.js')
```

Note: `ws.useWorker('shared-worker.js')` should point to the `shared-worker.js` url relative to your HTML page base URL. 
Shared webworkers can only be loaded from the same domain similar to CORS. 
When installed into a project with `npm i socketio-shared-webworker` you will find the script in: `node_modules/socketio-shared-webworker/build/shared-worker.js`

You may copy `dist/shared-worker.js` to your `public/` directory and serve using `express.static`. 
An example of this is found in `server.js`. 
You can also serve it as a regular JS file with Apache, Nginx etc. 

```js
var wio = require('socketio-shared-webworker')
var ws = wio('http://localhost:8000/')
ws.useWorker('shared-worker.js') // use a specific SharedWorker script URL
// same as socket.io-client
```


### Using a Worker instead of SharedWorker

By default the library will use `Worker` when `SharedWorker` is not available. 
If you want to specify using `Worker` specifically then use: 

```js
var wio = require('socketio-shared-webworker')
var ws = wio('http://localhost:8000/')
ws.setWorkerType(Worker)
ws.start()
// same as socket.io-client
```

At the moment only `SharedWorker` and `Worker` are supported. `ServiceWorker` is not. 

### Develop

```bash
git clone https://github.com/IguMail/socketio-shared-webworker
cd socketio-shared-webworker
npm install
# Start example/dev-server.js with HMR
npm run dev
# edit example/app.js, src/shared-worker.js, src/socket.io-worker.js etc.
``` 

In chrome visit the URL: chrome://inspect/#workers so see shared webworkers and inspect, debug.
Visit the `index.html` in the browser for the demo. 

### Test

```bash
git clone https://github.com/IguMail/socketio-shared-webworker
cd socketio-shared-webworker
npm install
# Start development server with HMR
npm run dev
# Run unit tests
npm test 
# Run e2e tests
npm run test:e2e
``` 

### Production build

```bash
npm run build
```

The builds will be placed in `build/` directory. Copy these to your `public/` directory in your server. 

** To start the http and socket.io server to test the build **

```bash
npm start
``` 


### Based heavily on

Thanks to.

https://gonzalo123.com/2014/12/01/enclosing-socket-io-websocket-connection-inside-a-html5-sharedworker/

https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

https://www.sitepoint.com/javascript-shared-web-workers-html5/
