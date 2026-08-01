---
sidebar_position: 1
---

# Node JS

<iframe 
    src="https://www.canva.com/design/DAGu-4WfRDQ/VIHwselUZRjkD21_QspqxQ/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

General aspects of Node JS, differences with browser JavaScript, and server-side usage.

## What is Node JS?

Node.js is a JavaScript runtime environment built on Chrome's V8 engine. It allows executing JavaScript code on the server side, outside the browser. It was created by Ryan Dahl in 2009 with the goal of creating highly scalable and efficient applications for handling I/O (Input/Output) operations.

### Key Features

- **Asynchronous and non-blocking:** Node uses asynchronous operations by default, making it ideal for applications that handle many concurrent requests.
- **Single-threaded:** Although single-threaded, it handles concurrency through the Event Loop and delegates I/O operations to OS system threads using libuv.
- **Vast Ecosystem:** Powered by npm, the largest open-source package ecosystem.

### Difference with Browser JavaScript

- In the browser, JavaScript runs within the context of the DOM.
- In Node.js, there is no DOM; native modules like `fs` or `http` are used to access the file system or build web servers.

## How can Node JS be concurrent?

Node.js is single-threaded, but handles concurrency using:

- **Event Loop:** Manages and dispatches asynchronous tasks.
- **libuv:** C library providing a thread pool to execute blocking tasks (such as disk or network access) in a non-blocking manner for the main thread.

Example:

```js
const fs = require('fs');

console.log('Start');

fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log('Content:', data);
});

console.log('End');
```

## Event Loop

The Event Loop is the mechanism allowing Node.js to execute non-blocking operations despite being single-threaded.

### Event Loop Phases (Simplified):

1. **Timers:** Executes callbacks scheduled by `setTimeout` and `setInterval`.
2. **Pending callbacks:** Executes I/O callbacks deferred to the next loop iteration.
3. **Idle/prepare:** Internal Node use only.
4. **Poll:** Retrieves new I/O events.
5. **Check:** Executes `setImmediate()` callbacks.
6. **Close callbacks:** E.g., `socket.on('close')`.

### Microtasks vs Macrotasks

- **Microtasks:** Promises (`Promise.then`), `queueMicrotask`.
- **Macrotasks:** `setTimeout`, `setInterval`, `setImmediate`.

## Native Modules in Node JS

- **fs module:** File system interaction (`readFile`, `writeFile`).
- **http module:** Low-level HTTP server creation.
- **path module:** Normalizes and builds directory file paths (`path.join`).
- **os module:** Provides OS system details (`os.platform()`, `os.cpus()`).

---

## Self-Assessment Quiz

<Quiz id="compu3-s2-nodejs-quiz">
  <Question title="Which JavaScript engine powers Node.js?">
    <Option>Firefox SpiderMonkey</Option>
    <Option correct>Chrome V8</Option>
    <Option>Safari JavaScriptCore</Option>
    <Option>Edge Chakra</Option>
  </Question>
  <Question title="What is the primary execution model of Node.js on its main thread?">
    <Option>Synchronous multi-threaded</Option>
    <Option>Asynchronous multi-threaded</Option>
    <Option correct>Single-threaded asynchronous and non-blocking</Option>
    <Option>Purely synchronous single-threaded</Option>
  </Question>
  <Question title="Which library provides the system thread pool used by Node.js for blocking I/O operations?">
    <Option>V8</Option>
    <Option correct>libuv</Option>
    <Option>OpenSSL</Option>
    <Option>c-ares</Option>
  </Question>
  <Question title="Which object is NOT available in Node.js runtime environment unlike web browsers?">
    <Option>process</Option>
    <Option>Buffer</Option>
    <Option correct>document (DOM)</Option>
    <Option>global</Option>
  </Question>
  <Question title="In the Event Loop structure, which phase executes setTimeout and setInterval callbacks?">
    <Option correct>Timers</Option>
    <Option>Poll</Option>
    <Option>Check</Option>
    <Option>Pending callbacks</Option>
  </Question>
  <Question title="In which Event Loop phase are callbacks scheduled by setImmediate() executed?">
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
  <Question title="What problem occurs when multiple asynchronous callbacks are deeply nested inside one another?">
    <Option>Automatic Memory Leak</Option>
    <Option correct>Callback Hell</Option>
    <Option>Automatic Promise conversion</Option>
    <Option>Permanent thread lock</Option>
  </Question>
  <Question title="What are the 3 possible states of a JavaScript Promise?">
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
  <Question title="Which native Node.js module is used to interact with the file system?">
    <Option>path</Option>
    <Option>http</Option>
    <Option correct>fs</Option>
    <Option>os</Option>
  </Question>
  <Question title="What is the primary function of the path native module in Node.js?">
    <Option>Creating network servers</Option>
    <Option correct>Manipulating and concatenating file and directory paths</Option>
    <Option>Checking free RAM memory</Option>
    <Option>Monitoring CPU usage</Option>
  </Question>
  <Question title="What key behavior characterizes process.nextTick()?">
    <Option>It runs in the Check phase after setImmediate</Option>
    <Option correct>It executes its callback immediately before moving to the next Event Loop phase</Option>
    <Option>Schedules a task to run after 1 second delay</Option>
    <Option>Delegates the task directly to libuv thread pool</Option>
  </Question>
</Quiz>
