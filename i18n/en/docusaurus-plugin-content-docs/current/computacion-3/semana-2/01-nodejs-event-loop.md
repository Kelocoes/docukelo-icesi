---
sidebar_position: 1
description: "Understand what Node.js is, how it achieves concurrency with the Event Loop, and what callbacks are, with a supporting presentation."
---

# Node JS

<iframe 
    src="https://www.canva.com/design/DAGu-4WfRDQ/VIHwselUZRjkD21_QspqxQ/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

General aspects of Node JS, how it differs from browser JavaScript, and how it is used on the server side.

## What is Node JS?

Node.js is a JavaScript runtime environment built on Chrome's V8 engine. It lets you run JavaScript code on the server side, outside the browser. It was created by Ryan Dahl in 2009 with the goal of building highly scalable and efficient applications for handling I/O (input/output) operations.

For some reason, Node and its modules are now used on the server side...

### Key features

- **Asynchronous and non-blocking:** Node uses asynchronous operations by default, which makes it ideal for applications that handle many simultaneous requests.
- **Single-threaded:** Although it runs on a single thread, it can handle concurrency through the Event Loop and by delegating I/O operations to system threads through libuv.
- **Large ecosystem:** It has npm, the largest ecosystem of open source packages.

### Difference from JavaScript in the browser

- In the browser, JavaScript runs in the context of the DOM.
- In Node.js, there is no DOM; you use modules such as `fs` or `http` to access the file system or create servers.

## How can Node JS be concurrent?

Node.js is single-threaded, but it can handle concurrency thanks to:

- **Event Loop:** It manages asynchronous tasks and dispatches them.
- **libuv:** A library that provides a thread pool that lets blocking tasks (such as disk or network access) run without blocking the main thread. These threads do not belong to Node; they belong to the operating system.

Example:

```js title="How can Node JS be concurrent"
const fs = require('fs');

console.log('Inicio');

fs.readFile('archivo.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log('Contenido:', data);
});

console.log('Fin');
```

## Event Loop

The Event Loop is the mechanism that allows Node.js to run non-blocking operations, despite being single-threaded.

### Event Loop phases (simplified):

1. **Timers:** Runs `setTimeout` and `setInterval` callbacks.
2. **Pending callbacks:** Callbacks deferred by certain system operations.
3. **Idle/prepare:** Internal to Node.
4. **Poll:** Retrieves new events and runs I/O.
5. **Check:** Runs `setImmediate()`.
6. **Close callbacks:** E.g. `socket.on('close')`.

<img src="/img/computacion-3/event-loop.png" alt="Event Loop" />

<img src="/img/computacion-3/event-loop-1.png" alt="Event Loop 1" />

### Microtasks vs Macrotasks

- **Microtasks:** Promises (`Promise.then`), `queueMicrotask`.
- **Macrotasks:** `setTimeout`, `setInterval`, `setImmediate`.

Example:

```js title="Microtasks vs Macrotasks"
console.log('Inicio');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promesa'));

console.log('Fin');
```

**Expected output:**

```
Inicio
Fin
Promesa
Timeout
```

## What is a callback?

A callback is a function that is passed as an argument to another function and is executed after that function finishes its work.

Callback example:

```js title="What is a callback"
function saludar(nombre, callback) {
  console.log(`Hola ${nombre}`);
  callback();
}

saludar('Kevin', () => {
  console.log('Callback ejecutado');
});
```

### Callback Hell

When many callbacks are nested, the code becomes unreadable. This is known as "callback hell".

```js title="Callback Hell"
fs.readFile('archivo1.txt', 'utf-8', (err, data1) => {
    if (err) throw err;
    console.log('Archivo 1 leído');
    
    fs.readFile('archivo2.txt', 'utf-8', (err, data2) => {
        if (err) throw err;
        console.log('Archivo 2 leído');
        
        fs.readFile('archivo3.txt', 'utf-8', (err, data3) => {
            if (err) throw err;
            console.log('Archivo 3 leído');
            
            fs.readFile('archivo4.txt', 'utf-8', (err, data4) => {
                if (err) throw err;
                console.log('Archivo 4 leído');
            });
        });
    });
});
```

## Promises

A Promise represents a value that may be available now, in the future, or never.

States:

- **Pending**: waiting.
- **Fulfilled**: resolved successfully.
- **Rejected**: failed.

Example:

```js title="Promises"
const promesa = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Hecho!'), 1000);
});

promesa.then(res => console.log(res));
```

With async/await:

```js title="Promises (2)"
async function saludar() {
  const resultado = await promesa;
  console.log(resultado);
}

saludar();
```

## Difference between require/export and import/export

Node.js has two module systems:
- **CommonJS**: Uses `require` and `module.exports`.
- **ES6 Modules**: Uses `import` and `export`.

This is because Node.js was created before ES6 modules were standardized. 

```js title="Difference between require/export and"
const fs = require('fs'); // CommonJS
```
```js title="Difference between require/export and (2)"
import fs from 'fs'; // ES6 Modules
```

## Node JS modules

### fs module

It lets you work with the file system.

Example:

```js title="fs module"
const fs = require('fs');

fs.readFile('archivo.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### http module

It lets you create HTTP servers.

Example:

```js title="http module"
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hola desde Node.js');
});

server.listen(3000, () => console.log('Servidor en puerto 3000'));
```

### path module

It lets you work with file paths.

```js title="path module"
const path = require('path');

const ruta = path.join(__dirname, 'archivo.txt');
console.log(ruta);
```

### os module

It provides information about the operating system.

```js title="os module"
const os = require('os');

console.log('Sistema operativo:', os.platform());
console.log('Memoria libre:', os.freemem());
console.log('CPUs:', os.cpus());
```

### process.nextTick() example

`process.nextTick()` lets you run code asynchronously on the next iteration of the event loop, before any other asynchronous event:

```javascript title="process.nextTick() example"
console.log('Inicio del programa');

// Runs immediately
console.log('1. Código síncrono');

// Runs on the next iteration of the event loop
process.nextTick(() => {
    console.log('3. nextTick callback');
});

// Runs after nextTick
setTimeout(() => {
    console.log('4. setTimeout callback');
}, 0);

console.log('2. Final del código síncrono');

// Output:
// Inicio del programa
// 1. Código síncrono
// 2. Final del código síncrono
// 3. nextTick callback
// 4. setTimeout callback
```

#### Common use case: Error handling

```javascript title="Common use case: Error handling"
function asyncFunction(callback) {
    if (typeof callback !== 'function') {
        // Use nextTick to handle errors asynchronously
        process.nextTick(() => {
            throw new TypeError('Callback debe ser una función');
        });
        return;
    }
    
    // Simulate an asynchronous operation
    process.nextTick(callback);
}

// Usage
asyncFunction(() => {
    console.log('Callback ejecutado correctamente');
});
```

## Additional information or resources

- [Event loop example](https://www.jsv9000.app)

---

## Self-Assessment Quiz

<Quiz id="compu3-s2-nodejs-quiz">
  <Question title="Which JavaScript engine is Node.js built on?">
    <Option>Firefox's SpiderMonkey</Option>
    <Option correct>Chrome's V8</Option>
    <Option>Safari's JavaScriptCore</Option>
    <Option>Edge's Chakra</Option>
  </Question>
  <Question title="What is the main execution model of Node.js on its main thread?">
    <Option>Synchronous multi-threaded</Option>
    <Option>Asynchronous multi-threaded</Option>
    <Option correct>Asynchronous, non-blocking single-threaded</Option>
    <Option>Purely synchronous single-threaded</Option>
  </Question>
  <Question title="Which library does Node.js use to provide the system thread pool that handles blocking I/O operations?">
    <Option>V8</Option>
    <Option correct>libuv</Option>
    <Option>OpenSSL</Option>
    <Option>c-ares</Option>
  </Question>
  <Question title="Which of the following objects does NOT exist in the Node.js runtime, unlike in the browser?">
    <Option>process</Option>
    <Option>Buffer</Option>
    <Option correct>document (DOM)</Option>
    <Option>global</Option>
  </Question>
  <Question title="In the Event Loop structure, which phase is responsible for running setTimeout and setInterval callbacks?">
    <Option correct>Timers</Option>
    <Option>Poll</Option>
    <Option>Check</Option>
    <Option>Pending callbacks</Option>
  </Question>
  <Question title="In which Event Loop phase are callbacks scheduled with setImmediate() executed?">
    <Option>Poll</Option>
    <Option correct>Check</Option>
    <Option>Timers</Option>
    <Option>Close callbacks</Option>
  </Question>
  <Question title="Which of the following tasks is classified as a Microtask?">
    <Option>setTimeout</Option>
    <Option>setImmediate</Option>
    <Option correct>Promise.then</Option>
    <Option>setInterval</Option>
  </Question>
  <Question title="What happens when multiple asynchronous callbacks are deeply nested?">
    <Option>An automatic Memory Leak</Option>
    <Option correct>So-called Callback Hell occurs</Option>
    <Option>It automatically becomes a Promise</Option>
    <Option>Node.js blocks the main thread permanently</Option>
  </Question>
  <Question title="What are the 3 possible states of a Promise in JavaScript?">
    <Option>Start, Processing, Completed</Option>
    <Option correct>Pending, Fulfilled, Rejected</Option>
    <Option>Init, Success, Error</Option>
    <Option>Waiting, Active, Done</Option>
  </Question>
  <Question title="Which native Node.js module system uses require and module.exports?">
    <Option>ES6 Modules</Option>
    <Option correct>CommonJS</Option>
    <Option>AMD</Option>
    <Option>UMD</Option>
  </Question>
  <Question title="Which native Node.js module is used to work with the file system (reading/writing)?">
    <Option>path</Option>
    <Option>http</Option>
    <Option correct>fs</Option>
    <Option>os</Option>
  </Question>
  <Question title="What is the main function of the native path module in Node.js?">
    <Option>Creating network servers</Option>
    <Option correct>Manipulating and joining file and directory paths</Option>
    <Option>Getting the free memory of the operating system</Option>
    <Option>Monitoring the server CPU</Option>
  </Question>
  <Question title="Which behavior characterizes process.nextTick()?">
    <Option>It runs in the Check phase after setImmediate</Option>
    <Option correct>It runs its callback before moving on to the next Event Loop phase</Option>
    <Option>It schedules a task to run after 1 second</Option>
    <Option>It delegates the task directly to the libuv thread pool</Option>
  </Question>
</Quiz>