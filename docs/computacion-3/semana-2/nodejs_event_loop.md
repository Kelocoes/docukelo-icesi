---
sidebar_position: 1
---

# Node JS

Aspectos generales sobre Node JS, diferencias entre JavaScript, y su uso en el lado del servidor.

## ¿Qué es Node JS?

Node.js es un entorno de ejecución de JavaScript construido sobre el motor V8 de Chrome. Permite ejecutar código JavaScript en el lado del servidor, fuera del navegador. Fue creado por Ryan Dahl en 2009 con el objetivo de crear aplicaciones altamente escalables y eficientes en el manejo de operaciones I/O (entrada/salida).

Por algún motivo ahora se usa Node y sus módulos en el lado del servidor...

### Características clave

- **Asincronía y no bloqueo:** Node usa operaciones asincrónicas por defecto, lo que lo hace ideal para aplicaciones que manejan muchas solicitudes simultáneas.
- **Single-threaded:** Aunque es de un solo hilo, puede manejar concurrencia mediante el Event Loop y delegar operaciones I/O a hilos del sistema mediante libuv.
- **Gran ecosistema:** Cuenta con npm, el mayor ecosistema de paquetes de código abierto.

### Diferencia con JavaScript en el navegador

- En el navegador, JavaScript se ejecuta en el contexto del DOM.
- En Node.js, no existe el DOM; se usan módulos como `fs` o `http` para acceder al sistema de archivos o crear servidores.

## ¿Cómo puede ser concurrente Node JS?

Node.js es de un solo hilo (single-threaded), pero puede manejar concurrencia gracias a:

- **Event Loop:** Se encarga de gestionar las tareas asincrónicas y distribuirlas.
- **libuv:** Biblioteca que provee un pool de hilos que permite ejecutar tareas bloqueantes (como acceder al disco o red) de manera no bloqueante para el hilo principal. Estos hilos no son de Node, más bien son del sistema operativo.

Ejemplo:

```js
const fs = require('fs');

console.log('Inicio');

fs.readFile('archivo.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log('Contenido:', data);
});

console.log('Fin');
```

## Event Loop

El Event Loop es el mecanismo que permite a Node.js ejecutar operaciones no bloqueantes, a pesar de ser single-threaded.

### Fases del Event Loop (simplificadas):

1. **Timers:** Ejecuta callbacks de `setTimeout` y `setInterval`.
2. **Pending callbacks:** Callbacks postergados por ciertas operaciones del sistema.
3. **Idle/prepare:** Interno de Node.
4. **Poll:** Recupera nuevos eventos, ejecuta I/O.
5. **Check:** Ejecuta `setImmediate()`.
6. **Close callbacks:** Ej. `socket.on('close')`.

<img src="/img/event-loop.png" alt="Event Loop" />

<img src="/img/event-loop-1.png" alt="Event Loop 1" />

### Microtasks vs Macrotasks

- **Microtasks:** Promesas (`Promise.then`), `queueMicrotask`.
- **Macrotasks:** `setTimeout`, `setInterval`, `setImmediate`.

Ejemplo:

```js
console.log('Inicio');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promesa'));

console.log('Fin');
```

**Salida esperada:**

```
Inicio
Fin
Promesa
Timeout
```

## ¿Qué es un callback?

Un callback es una función que se pasa como argumento a otra función y que se ejecuta después de que esa función termina su trabajo.

Ejemplo con callback:

```js
function saludar(nombre, callback) {
  console.log(`Hola ${nombre}`);
  callback();
}

saludar('Kevin', () => {
  console.log('Callback ejecutado');
});
```

### Callback Hell

Cuando muchos callbacks se anidan, el código se vuelve ilegible. Esto se conoce como "callback hell".

```js
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

## Promesas

Una Promesa representa un valor que puede estar disponible ahora, en el futuro o nunca.

Estados:

- **Pending**: en espera.
- **Fulfilled**: resuelta con éxito.
- **Rejected**: fallida.

Ejemplo:

```js
const promesa = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Hecho!'), 1000);
});

promesa.then(res => console.log(res));
```

Con async/await:

```js
async function saludar() {
  const resultado = await promesa;
  console.log(resultado);
}

saludar();
```

## Diferencia entre require/export y import/export

En Node.js, existen dos sistemas de módulos:
- **CommonJS**: Usa `require` y `module.exports`.
- **ES6 Modules**: Usa `import` y `export`.

Esto se debe a que Node.js fue creado antes de que los módulos ES6 fueran estandarizados. 

```js
const fs = require('fs'); // CommonJS
```
```js
import fs from 'fs'; // ES6 Modules
```

## Módulos de Node JS

### Módulo fs

Permite trabajar con el sistema de archivos.

Ejemplo:

```js
const fs = require('fs');

fs.readFile('archivo.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### Módulo http

Permite crear servidores HTTP.

Ejemplo:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hola desde Node.js');
});

server.listen(3000, () => console.log('Servidor en puerto 3000'));
```

### Módulo path

Permite trabajar con rutas de archivos.

```js
const path = require('path');

const ruta = path.join(__dirname, 'archivo.txt');
console.log(ruta);
```

### Módulo os

Provee información del sistema operativo.

```js
const os = require('os');

console.log('Sistema operativo:', os.platform());
console.log('Memoria libre:', os.freemem());
console.log('CPUs:', os.cpus());
```

### Ejemplo de process.nextTick()

`process.nextTick()` permite ejecutar código de forma asíncrona en la próxima iteración del event loop, antes que cualquier otro evento asíncrono:

```javascript
console.log('Inicio del programa');

// Se ejecuta inmediatamente
console.log('1. Código síncrono');

// Se ejecuta en la siguiente iteración del event loop
process.nextTick(() => {
    console.log('3. nextTick callback');
});

// Se ejecuta después de nextTick
setTimeout(() => {
    console.log('4. setTimeout callback');
}, 0);

console.log('2. Final del código síncrono');

// Salida:
// Inicio del programa
// 1. Código síncrono
// 2. Final del código síncrono
// 3. nextTick callback
// 4. setTimeout callback
```

#### Caso de uso común: Manejo de errores

```javascript
function asyncFunction(callback) {
    if (typeof callback !== 'function') {
        // Usar nextTick para manejar errores de forma asíncrona
        process.nextTick(() => {
            throw new TypeError('Callback debe ser una función');
        });
        return;
    }
    
    // Simular operación asíncrona
    process.nextTick(callback);
}

// Uso
asyncFunction(() => {
    console.log('Callback ejecutado correctamente');
});
```

## Información o recursos adicionales

- [Event loop example](https://www.jsv9000.app)